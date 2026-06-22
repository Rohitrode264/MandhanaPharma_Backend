import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

import { env } from './config/env';
import app from './app';
import { connectDB } from './config/db';

const startServer = async () => {
  await connectDB();

  app.listen(env.port, () => {
    console.log(`Server running in ${env.nodeEnv} mode on port ${env.port}`);
  });
};

startServer();
