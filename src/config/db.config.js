const { PrismaClient } = require('../generated/prisma');
const logger = require('../utils/logger.util');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

const connectDB = async () => {
  try {
    await prisma.$connect();
    logger.info('Prisma connected to the database successfully');
  } catch (error) {
    logger.error('Database connection failed', error);
    process.exit(1);
  }
};

module.exports = { prisma, connectDB };
