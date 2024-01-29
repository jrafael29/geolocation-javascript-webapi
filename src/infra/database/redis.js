

import Redis from 'ioredis';

export const redisConnection = new Redis(`redis://:root@${process.env.REDIS_HOST}:6379/0`);
