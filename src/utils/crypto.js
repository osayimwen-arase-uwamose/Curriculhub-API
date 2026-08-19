// TODO: Verify why node:crypto
import crypto from "node:crypto";

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
  generateRandomToken,
  hashToken,
};
