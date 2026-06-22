import serverless from 'serverless-http';
import app from './app';
import { connectDB } from './config/db';
import mongoose from 'mongoose';

let isConnected = false;

export const handler = async (event: any, context: any) => {
  // Prevent Lambda from hanging if the event loop is not empty (e.g., Mongoose connections remain open)
  context.callbackWaitsForEmptyEventLoop = false;
  
  if (!isConnected && mongoose.connection.readyState !== 1) {
    await connectDB();
    isConnected = true;
  }
  
  const lambdaHandler = serverless(app);
  return lambdaHandler(event, context);
};
