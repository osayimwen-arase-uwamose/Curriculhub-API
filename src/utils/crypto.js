// TODO: Verify why node:crypto
import crypto from "node:crypto";

const generateTimeBasedCode = () => { 
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  const timePart = Date.now().toString(36).toUpperCase();
  
  const bytes = crypto.randomBytes(6);

  let cryptoPart = '';

  for (let i = 0; i < 6; i++) {
    cryptoPart += chars[bytes[i] % chars.length];
  }
  
  return { 
    timePart,
    cryptoPart,
  };
};

const generateRandomToken = (bytes = 32) => { 
  return crypto
    .randomBytes(bytes)
    .toString('hex');
};

const hashToken = (token) => { 
  return crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
};

export { 
  generateTimeBasedCode,
  generateRandomToken,
  hashToken,
};
