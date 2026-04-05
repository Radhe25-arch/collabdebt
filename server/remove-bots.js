const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🗑️  Starting bot purge for SkillForge...');

  // Identify bots by their email domain
  const botPattern = '@bot.skillforge.com';

  const countBefore = await prisma.user.count({
    where: {
      email: {
        endsWith: botPattern
      }
    }
  });

  console.log(`🔍 Found approximately ${countBefore} bots in the system.`);

  if (countBefore === 0) {
    console.log('✅ No bots found to remove.');
    return;
  }

  const deleteResult = await prisma.user.deleteMany({
    where: {
      email: {
        endsWith: botPattern
      }
    }
  });

  console.log(`✅ Successfully purged ${deleteResult.count} bots from the database.`);
}

main()
  .catch((e) => {
    console.error('❌ Error during bot purge:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
