const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const firstNames = ['Alex', 'Sarah', 'Marcus', 'Elena', 'David', 'Skyler', 'Jordan', 'Liam', 'Mei', 'Thorsten', 'Arjun', 'Neha', 'Marco', 'Sofia', 'Priya', 'Juan', 'Maria', 'Chen', 'Wei', 'Liu', 'Ahmed', 'Fatima', 'Olivia', 'Emma', 'Ava', 'Charlotte', 'Sophia', 'Amelia', 'Isabella', 'Mia', 'Evelyn', 'Harper', 'James', 'Arthur', 'Mohammed', 'Yusuf', 'Aisha', 'Zainab', 'Omar', 'Ali', 'Daniel', 'Carlos', 'Miguel', 'Aiden', 'Lucas', 'Ethan', 'Mateo', 'Elijah'];
const lastNames = ['Rivera', 'Chen', 'Thorne', 'Vance', 'Park', 'Hayes', 'OShea', 'Lin', 'Shah', 'Kulkarni', 'Diaz', 'Garcia', 'Martinez', 'Rodriguez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Campbell'];

const roles = ['STUDENT', 'PROFESSIONAL', 'BEGINNER'];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomDateWithinLast(days) {
  const now = new Date();
  const past = new Date(now.getTime() - getRandomInt(0, days * 24 * 60 * 60 * 1000));
  return past;
}

async function main() {
  console.log('🌱 Seeding 25,000 massive bots for SkillForge...');

  const passwordHash = await bcrypt.hash('botpassword123!', 10);
  const BATCH_SIZE = 5000;
  const TOTAL_BOTS = 25000;
  
  let inserted = 0;

  for (let i = 0; i < TOTAL_BOTS; i += BATCH_SIZE) {
    const batch = [];
    for (let j = 0; j < BATCH_SIZE; j++) {
      const idx = i + j;
      const fName = firstNames[getRandomInt(0, firstNames.length - 1)];
      const lName = lastNames[getRandomInt(0, lastNames.length - 1)];
      const randomSuffix = getRandomInt(100, 99999);
      const username = `${fName.toLowerCase()}_${lName.toLowerCase()}${randomSuffix}_${idx}`;
      const email = `bot_${idx}_${Date.now()}@bot.skillforge.com`;
      
      const xp = getRandomInt(0, 45000);
      let level = 1;
      const THRESHOLDS  = [0,500,1200,2500,4500,7500,12000,18000,26000,36000];
      for(let l=0; l<THRESHOLDS.length; l++){
          if(xp >= THRESHOLDS[l]) level = l + 1;
      }

      batch.push({
        email,
        username: username.slice(0, 40), 
        fullName: `${fName} ${lName}`,
        passwordHash,
        role: roles[getRandomInt(0, roles.length - 1)],
        xp,
        level,
        streak: getRandomInt(0, 100),
        longestStreak: getRandomInt(0, 150),
        isActive: true,
        onboarded: true,
        isVerified: true,
        lastActiveAt: getRandomDateWithinLast(7), 
        createdAt: getRandomDateWithinLast(365),
      });
    }

    await prisma.user.createMany({
      data: batch,
      skipDuplicates: true,
    });
    
    inserted += batch.length;
    console.log(`Inserted ${inserted} / ${TOTAL_BOTS} bots...`);
  }

  console.log('✅ 25,000 bots seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
