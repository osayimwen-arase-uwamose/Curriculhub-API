import mongoose from "mongoose";
import { env } from "../config/env.js";

const connectDatabase =  async () => { 
  try { 
    mongoose.set('strictQuery', true);

    const connectionInstance = await mongoose.connect(env.MONGODB_URI);

    console.log(`[connectDatabase] MongoDB connected: ${connectionInstance}`);
  } catch (_err) { 
    console.log(`[connectDatabase] Error connecting MongoDB: ${_err}`);
  };
};

const disconnectDatabase = async () => { 
  try { 
    await mongoose.disconnect();

    console.log('[disconnectDatabase] MongoDB disconnected');
  } catch (_err) { 
    console.log(`[disconnectDatabase] Error disconnecting MongoDB ${_err}`);
  };
};

export { 
  connectDatabase,
  disconnectDatabase,
};