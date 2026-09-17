import { Schema, model } from "mongoose";

const hubMembershipSchema = new Schema(
  {
    hub: {
      type: Schema.Types.ObjectId,
      ref: "Hub",
      required: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    role: {
      type: String,
      enum: ["owner", "admin", "member"],
      default: "member",
    },

    status: {
      type: String,
      enum: ["pending", "active", "suspended", "removed"],
      default: "active",
    },

    joinedAt: {
      type: Date,
      default: Date.now,
    },

    invitedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

hubMembershipSchema.index(
  { hub: 1, user: 1 },
  { unique: true }
);

export const HubMembership = model(
  "HubMembership",
  hubMembershipSchema
);