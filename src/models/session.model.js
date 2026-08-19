import { Schema, model } from "mongoose";

const sessionSchema = new Schema({ 
  user: { 
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },

  refreshTokenHash: { 
    type: String,
    required: true,
    unique: true,
    index: true,
  },

  expiresAt: { 
    type: Date,
    required: true,
    index: true,
  },

  revokedAt: { 
    type: Date,
    default: null,
    index: true,
  },

  lastUsedAt: { 
    type: Date,
    default: Date.now,
  },

  ipAddress: { 
    type: String,
    default: null
  },

  userAgent: { 
    type: String,
    default: null
  },
}, { 
  timestamps: true,
});

export const Session = model("Session", sessionSchema);
