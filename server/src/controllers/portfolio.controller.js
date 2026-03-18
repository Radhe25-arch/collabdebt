const { prisma } = require('../config/db');
const AppError = require('../utils/AppError');

// ─── GET PORTFOLIO ─────────────────────────────────────────

async function getPortfolio(req, res, next) {
  try {
    const userId = req.params.userId || req.user.id;
    const portfolio = await prisma.portfolio.findUnique({
      where: { userId },
      include: {
        projects: { orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }] },
        user: { select: { username: true, fullName: true, xp: true, level: true, coursesCompleted: true, streak: true, createdAt: true } },
      },
    });

    if (!portfolio) {
      return res.json({ portfolio: null });
    }

    res.json({ portfolio });
  } catch (err) { next(err); }
}

// ─── UPSERT PORTFOLIO ──────────────────────────────────────

async function upsertPortfolio(req, res, next) {
  try {
    const { githubUsername, bio, skills, socialLinks, themeColor, customDomain } = req.body;

    const portfolio = await prisma.portfolio.upsert({
      where: { userId: req.user.id },
      update: { githubUsername, bio, skills, socialLinks, themeColor, customDomain },
      create: { userId: req.user.id, githubUsername, bio, skills, socialLinks, themeColor, customDomain },
    });

    res.json({ portfolio });
  } catch (err) { next(err); }
}

// ─── GENERATE README MARKDOWN ─────────────────────────────

async function generateReadme(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        interests: true,
        badges: { include: { badge: true }, take: 10 },
        enrollments: {
          where: { completedAt: { not: null } },
          include: { course: { include: { category: true } } },
          orderBy: { completedAt: 'desc' },
          take: 10,
        },
      },
    });

    const portfolio = await prisma.portfolio.findUnique({
      where: { userId: req.user.id },
      include: { projects: { where: { featured: true }, take: 6 } },
    });

    const rank = (await prisma.user.count({ where: { xp: { gt: user.xp } } })) + 1;
    const LEVEL_NAMES = ['Beginner','Apprentice','Coder','Developer','Senior Dev','Architect','Pro','Expert','Master','Legend'];
    const levelName = LEVEL_NAMES[Math.min(user.level - 1, 9)];

    // Build skill breakdown
    const skillMap = {};
    for (const e of user.enrollments) {
      const cat = e.course.category?.name || 'General';
      skillMap[cat] = (skillMap[cat] || 0) + 1;
    }

    const completedCourses = user.enrollments.map((e) => `- ✅ **${e.course.title}** (${e.course.category?.name})`).join('\n');
    const badgeList = user.badges.map((b) => `![${b.badge.name}](https://img.shields.io/badge/${encodeURIComponent(b.badge.name)}-${encodeURIComponent(b.badge.rarity === 'legendary' ? 'gold' : b.badge.rarity === 'epic' ? '9D65F5' : '00D9B5')}-black)`).join(' ');
    const skillBars = Object.entries(skillMap).map(([cat, n]) => {
      const bars = '█'.repeat(Math.min(n * 2, 10)) + '░'.repeat(Math.max(0, 10 - n * 2));
      return `| ${cat} | ${bars} | ${n} courses |`;
    }).join('\n');

    const projects = (portfolio?.projects || []).map((p) => `
### ${p.title}
${p.description || ''}
${p.tags ? `**Tech:** ${JSON.parse(JSON.stringify(p.tags)).join(', ')}` : ''}
${p.repoUrl ? `[View Code](${p.repoUrl})` : ''} ${p.liveUrl ? `[Live Demo](${p.liveUrl})` : ''}
`).join('\n---\n');

    const readme = `# ${user.fullName || user.username}
> **${levelName}** on CodeArena · Rank #${rank.toLocaleString()} · ${user.xp.toLocaleString()} XP

${portfolio?.bio || `I'm a developer currently leveling up through CodeArena. ${user.streak}-day learning streak and counting.`}

---

## CodeArena Stats

| Metric | Value |
|--------|-------|
| Level | ${user.level} · ${levelName} |
| Total XP | ${user.xp.toLocaleString()} |
| Global Rank | #${rank.toLocaleString()} |
| Courses Completed | ${user.coursesCompleted} |
| Current Streak | ${user.streak} days |
| Member Since | ${new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })} |

---

## Skill Progress

| Category | Progress | Courses |
|----------|----------|---------|
${skillBars || '| Getting Started | ░░░░░░░░░░ | 0 courses |'}

---

## Completed Courses

${completedCourses || '_No courses completed yet — but they\'re working on it!_'}

---

## Badges Earned

${badgeList || '_No badges yet_'}

---

${projects ? `## Projects\n\n${projects}\n\n---\n\n` : ''}

## Connect

${portfolio?.socialLinks ? Object.entries(JSON.parse(JSON.stringify(portfolio.socialLinks))).filter(([,v]) => v).map(([k, v]) => `- **${k.charAt(0).toUpperCase() + k.slice(1)}**: [${v}](${v})`).join('\n') : `- **CodeArena Profile**: [codearena.dev/u/${user.username}](https://codearena.dev/u/${user.username})`}

---

<p align="center">
  <i>Built automatically by <a href="https://codearena.dev">CodeArena</a> · Updated ${new Date().toLocaleDateString()}</i>
</p>
`;

    res.json({ readme, filename: 'README.md' });
  } catch (err) { next(err); }
}

// ─── PUSH TO GITHUB ────────────────────────────────────────

async function pushToGithub(req, res, next) {
  try {
    const { token, repoName = 'codearena-portfolio' } = req.body;

    if (!token) throw new AppError('GitHub Personal Access Token required', 400);

    // Generate readme content
    const fakeReq = { user: req.user };
    let readmeContent = '';
    const fakeRes = {
      json: (d) => { readmeContent = d.readme; },
    };
    await generateReadme(fakeReq, fakeRes, next);
    if (!readmeContent) throw new AppError('Failed to generate README', 500);

    // Get GitHub user info
    const ghUserRes = await fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${token}`, 'User-Agent': 'CodeArena/1.0' },
    });
    if (!ghUserRes.ok) throw new AppError('Invalid GitHub token', 401);
    const ghUser = await ghUserRes.json();

    // Check if repo exists
    const repoCheckRes = await fetch(`https://api.github.com/repos/${ghUser.login}/${repoName}`, {
      headers: { Authorization: `Bearer ${token}`, 'User-Agent': 'CodeArena/1.0' },
    });

    let repoUrl;
    if (repoCheckRes.status === 404) {
      // Create repo
      const createRes = await fetch('https://api.github.com/user/repos', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'User-Agent': 'CodeArena/1.0',
        },
        body: JSON.stringify({
          name: repoName,
          description: 'My CodeArena developer portfolio — auto-generated',
          auto_init: true,
          private: false,
        }),
      });
      const repo = await createRes.json();
      repoUrl = repo.html_url;
    } else {
      const repo = await repoCheckRes.json();
      repoUrl = repo.html_url;
    }

    // Get current SHA of README if it exists
    let sha = undefined;
    const fileRes = await fetch(`https://api.github.com/repos/${ghUser.login}/${repoName}/contents/README.md`, {
      headers: { Authorization: `Bearer ${token}`, 'User-Agent': 'CodeArena/1.0' },
    });
    if (fileRes.ok) {
      const fileData = await fileRes.json();
      sha = fileData.sha;
    }

    // Push README
    const content = Buffer.from(readmeContent).toString('base64');
    await fetch(`https://api.github.com/repos/${ghUser.login}/${repoName}/contents/README.md`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'CodeArena/1.0',
      },
      body: JSON.stringify({
        message: `Update CodeArena portfolio — ${new Date().toLocaleDateString()}`,
        content,
        ...(sha ? { sha } : {}),
      }),
    });

    // Save token+repo reference (in real app, encrypt token)
    await prisma.portfolio.upsert({
      where: { userId: req.user.id },
      update: { githubUsername: ghUser.login, repoName, repoUrl, lastBuiltAt: new Date() },
      create: { userId: req.user.id, githubUsername: ghUser.login, repoName, repoUrl, lastBuiltAt: new Date() },
    });

    res.json({ success: true, repoUrl, message: 'Portfolio pushed to GitHub!' });
  } catch (err) { next(err); }
}

// ─── ADD PROJECT ───────────────────────────────────────────

async function deleteProject(req, res, next) {
  try {
    const { projectId } = req.params;
    const portfolio = await prisma.portfolio.findUnique({ where: { userId: req.user.id } });
    if (!portfolio) throw new AppError('Portfolio not found', 404);

    await prisma.portfolioProject.delete({
      where: { id: projectId, portfolioId: portfolio.id },
    });

    res.json({ success: true, message: 'Project deleted' });
  } catch (err) { next(err); }
}

module.exports = { getPortfolio, upsertPortfolio, generateReadme, pushToGithub, addProject, deleteProject };
