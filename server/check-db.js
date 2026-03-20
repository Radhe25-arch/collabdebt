const { prisma } = require('./src/config/db');

async function check() {
  try {
    const friendCount = await prisma.friendship.count();
    console.log('Friendship count:', friendCount);
    const userCount = await prisma.user.count();
    console.log('User count:', userCount);
    process.exit(0);
  } catch (err) {
    console.error('DB Check Failed:', err.message);
    process.exit(1);
  }
}

check();
