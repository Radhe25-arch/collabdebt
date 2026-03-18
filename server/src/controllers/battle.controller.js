const { prisma } = require('../config/db');
const { awardXP, awardBadge, checkMilestoneBadges } = require('../utils/xp');
const AppError = require('../utils/AppError');

// ─── SYSTEM PROBLEM BANK ──────────────────────────────────
// Every 1v1 match using "system" mode picks a unique problem the pair hasn't seen before.

const SYSTEM_PROBLEMS = [
  { title: 'Two Sum', desc: 'Given an array of integers and a target, return indices of two numbers that add up to the target.', starter: { javascript: 'function twoSum(nums, target) {\n  // your code\n}', python: 'def two_sum(nums, target):\n    pass', java: 'class Solution {\n  public int[] twoSum(int[] nums, int target) {\n    // your code\n  }\n}', cpp: 'vector<int> twoSum(vector<int>& nums, int target) {\n  // your code\n}' } },
  { title: 'Reverse String', desc: 'Write a function that reverses a string. The input is given as an array of characters.', starter: { javascript: 'function reverseString(s) {\n  // your code\n}', python: 'def reverse_string(s):\n    pass', java: 'class Solution {\n  public void reverseString(char[] s) {\n    // your code\n  }\n}', cpp: 'void reverseString(vector<char>& s) {\n  // your code\n}' } },
  { title: 'Palindrome Check', desc: 'Given a string, determine if it is a palindrome considering only alphanumeric characters.', starter: { javascript: 'function isPalindrome(s) {\n  // your code\n}', python: 'def is_palindrome(s):\n    pass', java: 'class Solution {\n  public boolean isPalindrome(String s) {\n    // your code\n  }\n}', cpp: 'bool isPalindrome(string s) {\n  // your code\n}' } },
  { title: 'FizzBuzz', desc: 'Return an array of strings from 1 to n. For multiples of 3 print "Fizz", multiples of 5 print "Buzz", both print "FizzBuzz".', starter: { javascript: 'function fizzBuzz(n) {\n  // your code\n}', python: 'def fizz_buzz(n):\n    pass', java: 'class Solution {\n  public List<String> fizzBuzz(int n) {\n    // your code\n  }\n}', cpp: 'vector<string> fizzBuzz(int n) {\n  // your code\n}' } },
  { title: 'Maximum Subarray', desc: 'Find the contiguous subarray (at least one element) with the largest sum and return its sum.', starter: { javascript: 'function maxSubArray(nums) {\n  // your code\n}', python: 'def max_sub_array(nums):\n    pass', java: 'class Solution {\n  public int maxSubArray(int[] nums) {\n    // your code\n  }\n}', cpp: 'int maxSubArray(vector<int>& nums) {\n  // your code\n}' } },
  { title: 'Valid Parentheses', desc: 'Given a string containing just the characters (){}[], determine if the input string is valid.', starter: { javascript: 'function isValid(s) {\n  // your code\n}', python: 'def is_valid(s):\n    pass', java: 'class Solution {\n  public boolean isValid(String s) {\n    // your code\n  }\n}', cpp: 'bool isValid(string s) {\n  // your code\n}' } },
  { title: 'Merge Sorted Arrays', desc: 'Given two sorted integer arrays, merge them into a single sorted array.', starter: { javascript: 'function mergeSorted(a, b) {\n  // your code\n}', python: 'def merge_sorted(a, b):\n    pass', java: 'class Solution {\n  public int[] merge(int[] a, int[] b) {\n    // your code\n  }\n}', cpp: 'vector<int> mergeSorted(vector<int>& a, vector<int>& b) {\n  // your code\n}' } },
  { title: 'Climbing Stairs', desc: 'You are climbing a staircase with n steps. Each time you can climb 1 or 2 steps. How many distinct ways can you climb?', starter: { javascript: 'function climbStairs(n) {\n  // your code\n}', python: 'def climb_stairs(n):\n    pass', java: 'class Solution {\n  public int climbStairs(int n) {\n    // your code\n  }\n}', cpp: 'int climbStairs(int n) {\n  // your code\n}' } },
  { title: 'Remove Duplicates', desc: 'Given a sorted array, remove the duplicates in-place such that each element appears only once and return the new length.', starter: { javascript: 'function removeDuplicates(nums) {\n  // your code\n}', python: 'def remove_duplicates(nums):\n    pass', java: 'class Solution {\n  public int removeDuplicates(int[] nums) {\n    // your code\n  }\n}', cpp: 'int removeDuplicates(vector<int>& nums) {\n  // your code\n}' } },
  { title: 'Binary Search', desc: 'Given a sorted array, search for a target value and return its index. Return -1 if not found.', starter: { javascript: 'function binarySearch(nums, target) {\n  // your code\n}', python: 'def binary_search(nums, target):\n    pass', java: 'class Solution {\n  public int search(int[] nums, int target) {\n    // your code\n  }\n}', cpp: 'int search(vector<int>& nums, int target) {\n  // your code\n}' } },
  { title: 'Anagram Check', desc: 'Given two strings s and t, return true if t is an anagram of s.', starter: { javascript: 'function isAnagram(s, t) {\n  // your code\n}', python: 'def is_anagram(s, t):\n    pass', java: 'class Solution {\n  public boolean isAnagram(String s, String t) {\n    // your code\n  }\n}', cpp: 'bool isAnagram(string s, string t) {\n  // your code\n}' } },
  { title: 'Linked List Cycle', desc: 'Given head of a linked list, determine if it has a cycle.', starter: { javascript: 'function hasCycle(head) {\n  // your code\n}', python: 'def has_cycle(head):\n    pass', java: 'class Solution {\n  public boolean hasCycle(ListNode head) {\n    // your code\n  }\n}', cpp: 'bool hasCycle(ListNode *head) {\n  // your code\n}' } },
  { title: 'Count Primes', desc: 'Count the number of prime numbers less than n.', starter: { javascript: 'function countPrimes(n) {\n  // your code\n}', python: 'def count_primes(n):\n    pass', java: 'class Solution {\n  public int countPrimes(int n) {\n    // your code\n  }\n}', cpp: 'int countPrimes(int n) {\n  // your code\n}' } },
  { title: 'Roman to Integer', desc: 'Given a roman numeral, convert it to an integer.', starter: { javascript: 'function romanToInt(s) {\n  // your code\n}', python: 'def roman_to_int(s):\n    pass', java: 'class Solution {\n  public int romanToInt(String s) {\n    // your code\n  }\n}', cpp: 'int romanToInt(string s) {\n  // your code\n}' } },
  { title: 'Power of Two', desc: 'Given an integer, determine if it is a power of two.', starter: { javascript: 'function isPowerOfTwo(n) {\n  // your code\n}', python: 'def is_power_of_two(n):\n    pass', java: 'class Solution {\n  public boolean isPowerOfTwo(int n) {\n    // your code\n  }\n}', cpp: 'bool isPowerOfTwo(int n) {\n  // your code\n}' } },
  { title: 'Matrix Transpose', desc: 'Given a 2D integer matrix, return its transpose.', starter: { javascript: 'function transpose(matrix) {\n  // your code\n}', python: 'def transpose(matrix):\n    pass', java: 'class Solution {\n  public int[][] transpose(int[][] matrix) {\n    // your code\n  }\n}', cpp: 'vector<vector<int>> transpose(vector<vector<int>>& matrix) {\n  // your code\n}' } },
  { title: 'String Compression', desc: 'Given an array of characters, compress it in-place using counts of repeated characters.', starter: { javascript: 'function compress(chars) {\n  // your code\n}', python: 'def compress(chars):\n    pass', java: 'class Solution {\n  public int compress(char[] chars) {\n    // your code\n  }\n}', cpp: 'int compress(vector<char>& chars) {\n  // your code\n}' } },
  { title: 'Move Zeroes', desc: 'Move all 0s to the end of the array while maintaining the relative order of non-zero elements.', starter: { javascript: 'function moveZeroes(nums) {\n  // your code\n}', python: 'def move_zeroes(nums):\n    pass', java: 'class Solution {\n  public void moveZeroes(int[] nums) {\n    // your code\n  }\n}', cpp: 'void moveZeroes(vector<int>& nums) {\n  // your code\n}' } },
  { title: 'Intersection of Arrays', desc: 'Given two arrays, return their intersection (each element appear as many times as it shows in both).', starter: { javascript: 'function intersect(a, b) {\n  // your code\n}', python: 'def intersect(a, b):\n    pass', java: 'class Solution {\n  public int[] intersect(int[] a, int[] b) {\n    // your code\n  }\n}', cpp: 'vector<int> intersect(vector<int>& a, vector<int>& b) {\n  // your code\n}' } },
  { title: 'Fibonacci Number', desc: 'Given n, calculate the nth Fibonacci number.', starter: { javascript: 'function fib(n) {\n  // your code\n}', python: 'def fib(n):\n    pass', java: 'class Solution {\n  public int fib(int n) {\n    // your code\n  }\n}', cpp: 'int fib(int n) {\n  // your code\n}' } },
];

function pickSystemProblem(language) {
  const idx = Math.floor(Math.random() * SYSTEM_PROBLEMS.length);
  const p = SYSTEM_PROBLEMS[idx];
  return {
    title: p.title,
    description: p.desc,
    codeStarter: p.starter[language] || p.starter.javascript || '',
  };
}

// ─── SEND CHALLENGE ────────────────────────────────────────

async function challenge(req, res, next) {
  try {
    const { challengedUsername, problemId, timeLimit = 1800 } = req.body;

    const challenged = await prisma.user.findUnique({ where: { username: challengedUsername } });
    if (!challenged) throw new AppError('User not found', 404);
    if (challenged.id === req.user.id) throw new AppError('Cannot challenge yourself', 400);

    // Check no active battle between these two
    const existing = await prisma.battle.findFirst({
      where: {
        status: { in: ['PENDING', 'ACTIVE', 'CONFIGURING'] },
        OR: [
          { challengerId: req.user.id, challengedId: challenged.id },
          { challengerId: challenged.id, challengedId: req.user.id },
        ],
      },
    });
    if (existing) throw new AppError('Active battle already exists between you two', 409);

    const battle = await prisma.battle.create({
      data: {
        challengerId: req.user.id,
        challengedId: challenged.id,
        problemId,
        timeLimit,
      },
      include: {
        challenger: { select: { id: true, username: true, level: true, xp: true, avatarUrl: true } },
        challenged: { select: { id: true, username: true, level: true, xp: true, avatarUrl: true } },
      },
    });

    // Send BATTLE_INVITE notification to challenged user
    await prisma.notification.create({
      data: {
        userId: challenged.id,
        type: 'BATTLE_INVITE',
        title: '1v1 Battle Invite',
        body: `${req.user.username} has challenged you to a 1v1 coding battle!`,
        data: { battleId: battle.id, challengerUsername: req.user.username },
      },
    });

    res.status(201).json({ battle, message: 'Challenge sent!' });
  } catch (err) { next(err); }
}

// ─── RESPOND TO CHALLENGE ──────────────────────────────────

async function respond(req, res, next) {
  try {
    const { id } = req.params;
    const { accept } = req.body;

    const battle = await prisma.battle.findUnique({ where: { id } });
    if (!battle) throw new AppError('Battle not found', 404);
    if (battle.challengedId !== req.user.id) throw new AppError('Not your challenge', 403);
    if (battle.status !== 'PENDING') throw new AppError('Challenge already responded to', 400);

    if (!accept) {
      await prisma.battle.update({ where: { id }, data: { status: 'DECLINED' } });
      return res.json({ message: 'Challenge declined' });
    }

    // Move to CONFIGURING — Host (challenger) must now pick timer, language, mode
    const updated = await prisma.battle.update({
      where: { id },
      data: { status: 'CONFIGURING' },
      include: {
        challenger: { select: { id: true, username: true, level: true, xp: true, avatarUrl: true } },
        challenged: { select: { id: true, username: true, level: true, xp: true, avatarUrl: true } },
      },
    });

    // Notify the challenger that their invite was accepted
    await prisma.notification.create({
      data: {
        userId: battle.challengerId,
        type: 'BATTLE_ACCEPTED',
        title: 'Challenge Accepted!',
        body: `${req.user.username} accepted your 1v1 challenge! Configure the match now.`,
        data: { battleId: battle.id },
      },
    });

    res.json({ battle: updated, message: 'Challenge accepted! Waiting for Host to configure the match.' });
  } catch (err) { next(err); }
}

// ─── CONFIGURE & START BATTLE ──────────────────────────────

async function configure(req, res, next) {
  try {
    const { id } = req.params;
    const { mode = 'system', language = 'javascript', timeLimit = 1800, problemText, codeStarter } = req.body;

    const battle = await prisma.battle.findUnique({ where: { id } });
    if (!battle) throw new AppError('Battle not found', 404);
    if (battle.challengerId !== req.user.id) throw new AppError('Only the host can configure', 403);
    if (battle.status !== 'CONFIGURING') throw new AppError('Battle is not in configuring state', 400);

    let finalProblem = problemText || '';
    let finalStarter = codeStarter || '';

    // If system mode, generate a problem
    if (mode === 'system') {
      const sysProblem = pickSystemProblem(language);
      finalProblem = `# ${sysProblem.title}\n\n${sysProblem.description}`;
      finalStarter = sysProblem.codeStarter;
    }

    const now = new Date();
    const endsAt = new Date(now.getTime() + timeLimit * 1000);

    const updated = await prisma.battle.update({
      where: { id },
      data: {
        status: 'ACTIVE',
        mode,
        language,
        timeLimit,
        problemText: finalProblem,
        codeStarter: finalStarter,
        startsAt: now,
        endsAt,
      },
      include: {
        challenger: { select: { id: true, username: true, level: true, xp: true, avatarUrl: true } },
        challenged: { select: { id: true, username: true, level: true, xp: true, avatarUrl: true } },
      },
    });

    res.json({ battle: updated, message: 'Battle started! Timer is running.' });
  } catch (err) { next(err); }
}

// ─── SUBMIT CODE ───────────────────────────────────────────

async function submit(req, res, next) {
  try {
    const { id } = req.params;
    const { code, language = 'javascript', passed = 0, total = 10, timeTaken } = req.body;

    const battle = await prisma.battle.findUnique({
      where: { id },
      include: { submissions: true },
    });
    if (!battle) throw new AppError('Battle not found', 404);
    if (battle.status !== 'ACTIVE') throw new AppError('Battle is not active', 400);
    if (battle.challengerId !== req.user.id && battle.challengedId !== req.user.id) {
      throw new AppError('You are not in this battle', 403);
    }
    if (new Date() > battle.endsAt) throw new AppError('Battle time expired', 400);

    const mySubmissions = battle.submissions.filter((s) => s.userId === req.user.id);
    const attempt = mySubmissions.length + 1;

    const submission = await prisma.battleSubmission.create({
      data: { battleId: id, userId: req.user.id, code, language, passed, total, timeTaken, attempt },
    });

    // Check if both players have submitted
    const allSubs = [...battle.submissions, submission];
    const challengerBest = getBestSubmission(allSubs, battle.challengerId);
    const challengedBest = getBestSubmission(allSubs, battle.challengedId);

    if (challengerBest && challengedBest) {
      await completeBattle(battle, challengerBest, challengedBest);
    }

    res.json({ submission, attempt, message: `Test cases: ${passed}/${total}` });
  } catch (err) { next(err); }
}

// ─── GET BATTLE ────────────────────────────────────────────

async function getBattle(req, res, next) {
  try {
    const { id } = req.params;
    const battle = await prisma.battle.findUnique({
      where: { id },
      include: {
        challenger: { select: { id: true, username: true, level: true, xp: true, avatarUrl: true, streak: true, coursesCompleted: true, totalQuizAttempts: true, correctQuizAnswers: true } },
        challenged: { select: { id: true, username: true, level: true, xp: true, avatarUrl: true, streak: true, coursesCompleted: true, totalQuizAttempts: true, correctQuizAnswers: true } },
        submissions: { orderBy: { submittedAt: 'asc' } },
        report: true,
      },
    });
    if (!battle) throw new AppError('Battle not found', 404);

    if (battle.challengerId !== req.user.id && battle.challengedId !== req.user.id) {
      throw new AppError('Access denied', 403);
    }

    res.json({ battle });
  } catch (err) { next(err); }
}

// ─── GET MY BATTLES ────────────────────────────────────────

async function getMyBattles(req, res, next) {
  try {
    const battles = await prisma.battle.findMany({
      where: {
        OR: [{ challengerId: req.user.id }, { challengedId: req.user.id }],
      },
      include: {
        challenger: { select: { id: true, username: true, level: true, avatarUrl: true } },
        challenged: { select: { id: true, username: true, level: true, avatarUrl: true } },
        report: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    res.json({ battles });
  } catch (err) { next(err); }
}

// ─── FORCE COMPLETE (time expired) ─────────────────────────

async function forceComplete(req, res, next) {
  try {
    const { id } = req.params;
    const battle = await prisma.battle.findUnique({
      where: { id },
      include: { submissions: true },
    });
    if (!battle) throw new AppError('Battle not found', 404);
    if (battle.status !== 'ACTIVE') throw new AppError('Battle not active', 400);
    if (battle.challengerId !== req.user.id && battle.challengedId !== req.user.id) {
      throw new AppError('Access denied', 403);
    }

    const challengerBest = getBestSubmission(battle.submissions, battle.challengerId);
    const challengedBest = getBestSubmission(battle.submissions, battle.challengedId);
    await completeBattle(battle, challengerBest, challengedBest);

    const updated = await prisma.battle.findUnique({
      where: { id },
      include: {
        challenger: { select: { id: true, username: true, level: true, xp: true, avatarUrl: true } },
        challenged: { select: { id: true, username: true, level: true, xp: true, avatarUrl: true } },
        report: true,
      },
    });
    res.json({ battle: updated });
  } catch (err) { next(err); }
}

// ─── HELPERS ───────────────────────────────────────────────

function getBestSubmission(submissions, userId) {
  const mine = submissions.filter((s) => s.userId === userId);
  if (!mine.length) return null;
  return mine.sort((a, b) => b.passed - a.passed || (a.timeTaken || 99999) - (b.timeTaken || 99999))[0];
}

async function completeBattle(battle, challengerBest, challengedBest) {
  let winnerId = null;
  const cScore  = challengerBest ? (challengerBest.passed / challengerBest.total) : 0;
  const cdScore = challengedBest ? (challengedBest.passed / challengedBest.total) : 0;

  if (cScore > cdScore) winnerId = battle.challengerId;
  else if (cdScore > cScore) winnerId = battle.challengedId;
  else if (challengerBest && challengedBest) {
    winnerId = (challengerBest.timeTaken || 99999) <= (challengedBest.timeTaken || 99999)
      ? battle.challengerId : battle.challengedId;
  }

  const buildScore = (subs, userId) => {
    const mine = subs.filter((s) => s.userId === userId);
    if (!mine.length) return { accuracy: 0, avgTime: null, attempts: 0, testsPassed: 0, testsTotal: 0, weakTopics: ['no submission'], bestAttempt: null };
    const best = getBestSubmission(mine, userId);
    const avgTime = mine.filter((s) => s.timeTaken).reduce((a, s) => a + s.timeTaken, 0) / (mine.filter((s) => s.timeTaken).length || 1);
    return {
      accuracy:   Math.round((best.passed / best.total) * 100),
      avgTime:    Math.round(avgTime),
      attempts:   mine.length,
      testsPassed: best.passed,
      testsTotal:  best.total,
      weakTopics: best.passed < best.total ? ['edge cases', 'time complexity'] : [],
      bestAttempt: best.attempt,
    };
  };

  const allSubs = await prisma.battleSubmission.findMany({ where: { battleId: battle.id } });
  const challengerScore = buildScore(allSubs, battle.challengerId);
  const challengedScore  = buildScore(allSubs, battle.challengedId);

  const analysis = generateAnalysis(challengerScore, challengedScore, winnerId, battle.challengerId);

  await prisma.$transaction([
    prisma.battle.update({
      where: { id: battle.id },
      data: { status: 'COMPLETED', winnerId, endsAt: new Date() },
    }),
    prisma.battleReport.upsert({
      where: { battleId: battle.id },
      update: { winnerId, challengerScore, challengedScore, analysis },
      create: { battleId: battle.id, winnerId, challengerScore, challengedScore, analysis },
    }),
  ]);

  if (winnerId) {
    await awardXP(winnerId, 300, 'battle_win', battle.id);
    await awardBadge(winnerId, 'Battle Tested');
    await checkMilestoneBadges(winnerId);
    const loserId = winnerId === battle.challengerId ? battle.challengedId : battle.challengerId;
    await awardXP(loserId, 50, 'battle_participation', battle.id);
  } else {
    await awardXP(battle.challengerId, 150, 'battle_draw', battle.id);
    await awardXP(battle.challengedId, 150, 'battle_draw', battle.id);
  }
}

function generateAnalysis(cScore, cdScore, winnerId, challengerId) {
  const winner = winnerId === challengerId ? 'challenger' : winnerId ? 'challenged' : null;
  const lines = [];

  if (!winner) {
    lines.push('Both players tied — a rare and impressive result.');
  } else {
    lines.push(`${winner === 'challenger' ? 'Challenger' : 'Opponent'} wins with ${winner === 'challenger' ? cScore.accuracy : cdScore.accuracy}% accuracy.`);
  }

  if (cScore.attempts > 3) lines.push('Challenger made multiple attempts — focus on planning before coding.');
  if (cdScore.attempts > 3) lines.push('Opponent made multiple attempts — edge case handling needs work.');
  if (cScore.accuracy < 50) lines.push('Challenger should practice test-driven development and boundary analysis.');
  if (cdScore.accuracy < 50) lines.push('Opponent should review core algorithmic patterns.');
  if (cScore.avgTime && cScore.avgTime > 120000) lines.push('Challenger was slower — practice timed coding challenges daily.');
  if (cScore.weakTopics.length) lines.push(`Challenger weak areas: ${cScore.weakTopics.join(', ')}.`);
  if (cdScore.weakTopics.length) lines.push(`Opponent weak areas: ${cdScore.weakTopics.join(', ')}.`);

  return lines.join(' ');
}

module.exports = { challenge, respond, configure, submit, getBattle, getMyBattles, forceComplete };
