const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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

    const friendship = await prisma.friendship.create({
      data: { senderId, receiverId, status: 'PENDING' }
    });

    // Create notification
    await prisma.notification.create({
      data: {
        userId: receiverId,
        type: 'FRIEND_REQUEST',
        title: 'New Friend Request',
        body: `${req.user.username} sent you a friend request!`,
        data: { senderId, friendshipId: friendship.id }
      }
    });

    res.json({ message: "Request sent", friendship });
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

module.exports = {
  getCommunityUsers,
  sendFriendRequest,
  acceptFriendRequest,
  getFriends,
  getPendingRequests
};
