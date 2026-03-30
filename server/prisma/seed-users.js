const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding mock users for SkillForge...');

  const passwordHash = await bcrypt.hash('password123', 12);

  const mockUsers = [
    { username: 'vector_prime', fullName: 'Alex Rivera', email: 'alex@skillforge.dev', xp: 12500, level: 12, streak: 45, role: 'STUDENT' },
    { username: 'neural_ghost', fullName: 'Sarah Chen', email: 'sarah@skillforge.dev', xp: 9800, level: 10, streak: 32, role: 'STUDENT' },
    { username: 'bit_architect', fullName: 'Marcus Thorne', email: 'marcus@skillforge.dev', xp: 15400, level: 15, streak: 89, role: 'INSTRUCTOR' },
    { username: 'void_pointer', fullName: 'Elena Vance', email: 'elena@skillforge.dev', xp: 7200, level: 8, streak: 14, role: 'STUDENT' },
    { username: 'logic_gate', fullName: 'David Park', email: 'david@skillforge.dev', xp: 11000, level: 11, streak: 56, role: 'STUDENT' },
    { username: 'cyber_skye', fullName: 'Skyler J.', email: 'skye@skillforge.dev', xp: 6500, level: 7, streak: 21, role: 'STUDENT' },
    { username: 'macro_dev', fullName: 'Jordan Hayes', email: 'jordan@skillforge.dev', xp: 8900, level: 9, streak: 30, role: 'STUDENT' },
    { username: 'kernel_panic', fullName: 'Liam O\'Shea', email: 'liam@skillforge.dev', xp: 4200, level: 5, streak: 7, role: 'STUDENT' },
    { username: 'syntax_sage', fullName: 'Mei Lin', email: 'mei@skillforge.dev', xp: 18200, level: 18, streak: 124, role: 'INSTRUCTOR' },
    { username: 'binary_beast', fullName: 'Thorsten V.', email: 'thor@skillforge.dev', xp: 5100, level: 6, streak: 12, role: 'STUDENT' },
  ];

  for (const u of mockUsers) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: { ...u, passwordHash, isActive: true, onboarded: true },
      create: { ...u, passwordHash, isActive: true, onboarded: true },
    });
  }

  console.log(`✅ ${mockUsers.length} mock users seeded.`);
  console.log('🎉 Done!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
