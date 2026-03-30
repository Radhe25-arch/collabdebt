const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const FIRST_NAMES = [
  'Alex','Jordan','Taylor','Morgan','Casey','Jamie','Riley','Avery','Quinn','Peyton',
  'Skyler','Cameron','Reese','Blake','Drew','Harper','Rowan','Hayden','Emerson','Finley',
  'Micah','Sidney','Kendall','Dakota','Parker','Sage','Charlie','Robin','Rory','Justice'
];

const LAST_NAMES = [
  'Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Rodriguez','Martinez',
  'Hernandez','Lopez','Gonzalez','Wilson','Anderson','Thomas','Taylor','Moore','Jackson','Martin',
  'Lee','Perez','Thompson','White','Harris','Sanchez','Clark','Ramirez','Lewis','Robinson'
];

const getRandomAvatar = (seed) => `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffdfbf,ffd5dc`;

async function main() {
  console.log('Generating 1,000 realistic bot profiles...');
  
  const botData = [];
  
  // We will track used usernames and emails to avoid collisions
  const usedUsernames = new Set();
  const usedEmails = new Set();

  for (let i = 0; i < 1000; i++) {
    const fName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const lName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    
    // Generate a unique username
    let usernameBase = `${fName.toLowerCase()}_${lName.toLowerCase()}`;
    let username = usernameBase;
    let counter = 1;
    while (usedUsernames.has(username)) {
      username = `${usernameBase}${counter}`;
      counter++;
    }
    usedUsernames.add(username);
    
    // Email
    let email = `${username}@bot.skillforge.com`;
    while (usedEmails.has(email)) {
      email = `${username}${counter}@bot.skillforge.com`;
      counter++;
    }
    usedEmails.add(email);

    // Realistic XP (heavy left-skew, some high performers)
    // 70% low (0-2000), 20% medium (2000-8000), 10% high (8000-25000)
    const roll = Math.random();
    let xp = 0;
    if (roll < 0.7) {
      xp = Math.floor(Math.random() * 2000);
    } else if (roll < 0.9) {
      xp = Math.floor(Math.random() * 6000) + 2000;
    } else {
      xp = Math.floor(Math.random() * 17000) + 8000;
    }

    const level = Math.floor(xp / 1000) + 1;

    botData.push({
      email,
      username,
      fullName: `${fName} ${lName}`,
      role: 'STUDENT',
      ageGroup: 'COLLEGE',
      xp,
      level,
      streak: Math.floor(Math.random() * 15),
      longestStreak: Math.floor(Math.random() * 30),
      isActive: true,
      onboarded: true,
      avatarUrl: getRandomAvatar(username),
      passwordHash: '$2b$10$xyzFakePasswordHashForBotsNoLoginAllowed123' // Fake un-loginable hash
    });
  }

  // Bulk Insert
  try {
    const result = await prisma.user.createMany({
      data: botData,
      skipDuplicates: true // In case some emails/usernames already exist in DB
    });
    console.log(`Successfully seeded ${result.count} bot profiles!`);
  } catch (err) {
    console.error('Failed to seed bots:', err.message);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
