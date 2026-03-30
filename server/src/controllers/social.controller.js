const { prisma } = require('../config/db');

const getCommunityUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        id: { not: req.user.id },
        isActive: true,
      },
      select: {
        id: true,
        username: true,
        avatarUrl: true,
        role: true,
        xp: true,
        level: true,
        _count: {
          select: { badges: true }
        }
      },
      orderBy: { xp: 'desc' },
      take: 50
    });
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const sendFriendRequest = async (req, res) => {
  const { id: receiverId } = req.params;
  const senderId = req.user.id;

  if (senderId === receiverId) return res.status(400).json({ message: "Cannot friend yourself" });

  try {
    const existing = await prisma.friendship.findFirst({
      where: {
        OR: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId }
        ]
      }
    });

    if (existing) return res.status(400).json({ message: "Relationship already exists" });

    // Look up the receiver to see if they are a bot
    const receiver = await prisma.user.findUnique({ where: { id: receiverId } });
    if (!receiver) return res.status(404).json({ message: "User not found" });

    const isBot = receiver.email.endsWith('@bot.skillforge.com');
    const initialStatus = isBot ? 'ACCEPTED' : 'PENDING';

    const friendship = await prisma.friendship.create({
      data: { senderId, receiverId, status: initialStatus }
    });

    if (!isBot) {
      // Only create notification if it's a real user
      await prisma.notification.create({
        data: {
          userId: receiverId,
          type: 'FRIEND_REQUEST',
          title: 'New Friend Request',
          body: `${req.user.username} sent you a friend request!`,
          data: { senderId, friendshipId: friendship.id }
        }
      });
    }

    res.json({ message: isBot ? "Friend added instantly!" : "Request sent", friendship });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const acceptFriendRequest = async (req, res) => {
  const { id: friendshipId } = req.params;
  const userId = req.user.id;

  try {
    const friendship = await prisma.friendship.findUnique({
      where: { id: friendshipId }
    });

    if (!friendship || friendship.receiverId !== userId) {
      return res.status(404).json({ message: "Request not found" });
    }

    const updated = await prisma.friendship.update({
      where: { id: friendshipId },
      data: { status: 'ACCEPTED' }
    });

    // Notify sender
    await prisma.notification.create({
      data: {
        userId: friendship.senderId,
        type: 'FRIEND_ACCEPTED',
        title: 'Friend Request Accepted',
        body: `${req.user.username} accepted your friend request!`,
        data: { friendId: userId }
      }
    });

    res.json({ message: "Request accepted", friendship: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFriends = async (req, res) => {
  const userId = req.user.id;
  try {
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
        status: 'ACCEPTED'
      },
      include: {
        sender: {
          select: { id: true, username: true, avatarUrl: true, xp: true, lastActiveAt: true }
        },
        receiver: {
          select: { id: true, username: true, avatarUrl: true, xp: true, lastActiveAt: true }
        }
      }
    });

    const friends = friendships.map(f => f.senderId === userId ? f.receiver : f.sender);
    res.json({ friends });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPendingRequests = async (req, res) => {
  const userId = req.user.id;
  try {
    const requests = await prisma.friendship.findMany({
      where: { receiverId: userId, status: 'PENDING' },
      include: {
        sender: {
          select: { id: true, username: true, avatarUrl: true, xp: true }
        }
      }
    });
    res.json({ requests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const sendMessage = async (req, res) => {
  const senderId = req.user.id;
  const { receiverId, content } = req.body;

  if (!content?.trim()) return res.status(400).json({ message: "Content required" });

  try {
    const message = await prisma.message.create({
      data: { senderId, receiverId, content }
    });
    res.status(201).json({ message });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMessages = async (req, res) => {
  const userId = req.user.id;
  const { friendId } = req.params;

  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: friendId },
          { senderId: friendId, receiverId: userId }
        ]
      },
      orderBy: { createdAt: 'asc' }
    });
    res.json({ messages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCommunityUsers,
  sendFriendRequest,
  acceptFriendRequest,
  getFriends,
  getPendingRequests,
  sendMessage,
  getMessages
};
