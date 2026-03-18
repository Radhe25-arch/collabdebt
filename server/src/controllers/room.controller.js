const { prisma } = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const AppError = require('../utils/AppError');

async function createRoom(req, res, next) {
  try {
    const { name, language = 'javascript', isPublic = false, maxUsers = 4 } = req.body;

    // Expire in 24 hours by default
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const room = await prisma.codeRoom.create({
      data: {
        name: name || `${req.user.id.slice(0,6)}'s Room`,
        language,
        isPublic,
        maxUsers,
        ownerId: req.user.id,
        expiresAt,
        code: getStarterCode(language),
      },
      include: {
        owner: { select: { id: true, username: true, avatarUrl: true } },
        participants: { include: { user: { select: { id: true, username: true, avatarUrl: true } } } },
      },
    });

    // Auto-join as participant
    await prisma.codeRoomParticipant.create({
      data: { roomId: room.id, userId: req.user.id },
    });

    res.status(201).json({ room });
  } catch (err) { next(err); }
}

async function joinRoom(req, res, next) {
  try {
    const { id } = req.params;
    const room = await prisma.codeRoom.findUnique({
      where: { id },
      include: {
        participants: true,
        owner: { select: { id: true, username: true } },
      },
    });

    if (!room) throw new AppError('Room not found', 404);
    if (room.expiresAt && new Date() > room.expiresAt) throw new AppError('Room has expired', 410);
    if (!room.isPublic && room.ownerId !== req.user.id) throw new AppError('Private room — invite only', 403);
    if (room.participants.length >= room.maxUsers) throw new AppError('Room is full', 409);

    await prisma.codeRoomParticipant.upsert({
      where: { roomId_userId: { roomId: id, userId: req.user.id } },
      update: {},
      create: { roomId: id, userId: req.user.id },
    });

    const updated = await prisma.codeRoom.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, username: true, avatarUrl: true } },
        participants: { include: { user: { select: { id: true, username: true, avatarUrl: true } } } },
      },
    });

    res.json({ room: updated });
  } catch (err) { next(err); }
}

async function getRoom(req, res, next) {
  try {
    const room = await prisma.codeRoom.findUnique({
      where: { id: req.params.id },
      include: {
        owner: { select: { id: true, username: true, avatarUrl: true } },
        participants: { include: { user: { select: { id: true, username: true, avatarUrl: true } } } },
      },
    });
    if (!room) throw new AppError('Room not found', 404);
    res.json({ room });
  } catch (err) { next(err); }
}

async function updateCode(req, res, next) {
  try {
    const { id } = req.params;
    const { code, language } = req.body;

    const room = await prisma.codeRoom.findUnique({ where: { id }, include: { participants: true } });
    if (!room) throw new AppError('Room not found', 404);

    const isParticipant = room.participants.some((p) => p.userId === req.user.id);
    if (!isParticipant) throw new AppError('Not a participant', 403);

    await prisma.codeRoom.update({
      where: { id },
      data: {
        ...(code !== undefined && { code }),
        ...(language && { language }),
      },
    });

    res.json({ message: 'Code updated' });
  } catch (err) { next(err); }
}

async function getPublicRooms(req, res, next) {
  try {
    const rooms = await prisma.codeRoom.findMany({
      where: {
        isPublic: true,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
      include: {
        owner: { select: { id: true, username: true, avatarUrl: true } },
        _count: { select: { participants: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    res.json({ rooms });
  } catch (err) { next(err); }
}

async function leaveRoom(req, res, next) {
  try {
    await prisma.codeRoomParticipant.deleteMany({
      where: { roomId: req.params.id, userId: req.user.id },
    });
    res.json({ message: 'Left room' });
  } catch (err) { next(err); }
}

function getStarterCode(language) {
  const starters = {
    javascript: '// CodeArena Code Room\n// Start coding together!\n\nfunction solution(input) {\n  // Your code here\n  return input;\n}\n\nconsole.log(solution("Hello, Arena!"));',
    python:     '# CodeArena Code Room\n# Start coding together!\n\ndef solution(input):\n    # Your code here\n    return input\n\nprint(solution("Hello, Arena!"))',
    cpp:        '// CodeArena Code Room\n#include <iostream>\nusing namespace std;\n\nint main() {\n    // Your code here\n    cout << "Hello, Arena!" << endl;\n    return 0;\n}',
    java:       '// CodeArena Code Room\npublic class Solution {\n    public static void main(String[] args) {\n        // Your code here\n        System.out.println("Hello, Arena!");\n    }\n}',
    typescript: '// CodeArena Code Room\nfunction solution(input: string): string {\n  // Your code here\n  return input;\n}\n\nconsole.log(solution("Hello, Arena!"));',
  };
  return starters[language] || starters.javascript;
}

module.exports = { createRoom, joinRoom, getRoom, updateCode, getPublicRooms, leaveRoom };
