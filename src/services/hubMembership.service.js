import { Hub } from "../models/hub.model.js";
import { HubMembership } from "../models/hubMembership.model.js";
import { User } from "../models/user.model.js";

import AppError from "../utils/app-error.js";

const findHub = async (hubId) => {
  const hub = await Hub.findById(hubId);

  if (!hub) {
    throw new AppError(
      404,
      "Hub not found.",
      "HUB_NOT_FOUND",
    );
  }

  return hub;
};

const findUser = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(
      404,
      "User not found.",
      "USER_NOT_FOUND",
    );
  }

  return user;
};

const addMember = async ({
  hubId,
  userId,
  invitedBy,
  role = "member",
}) => {
  await findHub(hubId);
  await findUser(userId);

  const existingMembership =
    await HubMembership.findOne({
      hubId,
      userId,
    });

  if (existingMembership) {
    throw new AppError(
      409,
      "User already has a membership in this Hub.",
      "MEMBERSHIP_EXISTS",
    );
  }

  try {
    const membership = await HubMembership.create({
      hubId,
      userId,
      role,
      status: "active",
      invitedBy,
    });

    return membership;
  } catch (error) {
    if (error?.code === 11000) {
      throw new AppError(
        409,
        "User already has a membership in this Hub.",
        "MEMBERSHIP_EXISTS",
      );
    }

    throw error;
  }
};

const inviteMember = async ({
  hubId,
  userId,
  invitedBy,
}) => {
  await findHub(hubId);
  await findUser(userId);

  const existingMembership =
    await HubMembership.findOne({
      hubId,
      userId,
    });

  if (existingMembership) {
    throw new AppError(
      409,
      "User already has a membership in this Hub.",
      "MEMBERSHIP_EXISTS",
    );
  }

  try {
    return await HubMembership.create({
      hubId,
      userId,
      status: "pending",
      role: "member",
      invitedBy,
    });
  } catch (error) {
    if (error?.code === 11000) {
      throw new AppError(
        409,
        "User already has a membership in this Hub.",
        "MEMBERSHIP_EXISTS",
      );
    }

    throw error;
  }
};

const approveMember = async (
  hubId,
  userId,
) => {
  const membership =
    await HubMembership.findOne({
      hubId,
      userId,
    });

  if (!membership) {
    throw new AppError(
      404,
      "Hub membership not found.",
      "MEMBERSHIP_NOT_FOUND",
    );
  }

  if (membership.status === "active") {
    throw new AppError(
      409,
      "Membership is already active.",
      "MEMBERSHIP_ALREADY_ACTIVE",
    );
  }

  if (membership.status === "removed") {
    throw new AppError(
      409,
      "A removed membership cannot be approved.",
      "MEMBERSHIP_REMOVED",
    );
  }

  membership.status = "active";

  await membership.save();

  return membership;
};

const suspendMember = async (
  hubId,
  userId,
) => {
  const membership =
    await HubMembership.findOne({
      hubId,
      userId,
    });

  if (!membership) {
    throw new AppError(
      404,
      "Hub membership not found.",
      "MEMBERSHIP_NOT_FOUND",
    );
  }

  if (membership.role === "owner") { 
    throw new AppError(
      409,
      "Hub owner cannot be suspended",
      "OWNER_NOT_SUSPENDABLE"
    )
  };

  if (membership.status === "suspended") {
    throw new AppError(
      409,
      "Membership is already suspended.",
      "MEMBERSHIP_ALREADY_SUSPENDED",
    );
  }

  if (membership.status === "removed") {
    throw new AppError(
      409,
      "A removed membership cannot be suspended.",
      "MEMBERSHIP_REMOVED",
    );
  }

  membership.status = "suspended";

  await membership.save();

  return membership;
};

const restoreMember = async (
  hubId,
  userId,
) => {
  const membership =
    await HubMembership.findOne({
      hubId,
      userId,
    });

  if (!membership) {
    throw new AppError(
      404,
      "Hub membership not found.",
      "MEMBERSHIP_NOT_FOUND",
    );
  }

  if (membership.status === "active") {
    throw new AppError(
      409,
      "Membership is already active.",
      "MEMBERSHIP_ALREADY_ACTIVE",
    );
  }

  if (membership.status === "removed") {
    throw new AppError(
      409,
      "A removed membership cannot be restored.",
      "MEMBERSHIP_REMOVED",
    );
  }

  membership.status = "active";

  await membership.save();

  return membership;
};

const removeMember = async (
  hubId,
  userId,
) => {
  const membership =
    await HubMembership.findOne({
      hubId,
      userId,
    });

  if (!membership) {
    throw new AppError(
      404,
      "Hub membership not found.",
      "MEMBERSHIP_NOT_FOUND",
    );
  }

  if (membership.status === "removed") {
    throw new AppError(
      409,
      "Membership is already removed.",
      "MEMBERSHIP_ALREADY_REMOVED",
    );
  };

  if (membership.role === "owner") { 
    throw new AppError(
      409,
      "Hub owner cannot be removed",
      "OWNER_NON_REMOVABLE"
    )
  };

  membership.status = "removed";

  await membership.save();
};

const changeMemberRole = async (
  hubId,
  userId,
  role,
) => {
  const membership =
    await HubMembership.findOne({
      hubId,
      userId,
    });

  if (!membership) {
    throw new AppError(
      404,
      "Hub membership not found.",
      "MEMBERSHIP_NOT_FOUND",
    );
  }

  if (membership.status === "removed") {
    throw new AppError(
      409,
      "A removed member cannot have their role changed.",
      "MEMBERSHIP_REMOVED",
    );
  };

  if (membership.role === "owner") { 
    throw new AppError(
      409,
      "Hub owner role can only be transfered",
      "OWNER_ROLE_UNCHANGEABLE"
    )
  };

  if (membership.role === role) {
    throw new AppError(
      409,
      `Member already has the ${role} role.`,
      "ROLE_ALREADY_ASSIGNED",
    );
  }

  membership.role = role;

  await membership.save();

  return membership;
};

const transferOwnership = async (
  hubId,
  currentOwnerId,
  newOwnerId,
) => {
  if (currentOwnerId === newOwnerId) {
    throw new AppError(
      400,
      "The current owner cannot be assigned ownership again.",
      "INVALID_OWNER_TRANSFER",
    );
  }

  const hub = await findHub(hubId);

  const currentOwner =
    await HubMembership.findOne({
      hubId,
      userId: currentOwnerId,
      role: "owner",
      status: "active",
    });

  if (!currentOwner) {
    throw new AppError(
      403,
      "Only the current Hub owner can transfer ownership.",
      "HUB_OWNER_REQUIRED",
    );
  }

  const newOwner =
    await HubMembership.findOne({
      hubId,
      userId: newOwnerId,
      status: "active",
    });

  if (!newOwner) {
    throw new AppError(
      404,
      "The new owner must be an active Hub member.",
      "NEW_OWNER_NOT_MEMBER",
    );
  }

  currentOwner.role = "admin";
  newOwner.role = "owner";

  await currentOwner.save();
  await newOwner.save();

  return hub;
};

const getMembership = async (
  hubId,
  userId,
) => {
  const membership =
    await HubMembership.findOne({
      hubId,
      userId,
    }).populate(
      "user",
      "username email",
    );

  if (!membership) {
    throw new AppError(
      404,
      "Hub membership not found.",
      "MEMBERSHIP_NOT_FOUND",
    );
  }

  return membership;
};

const getMembers = async (
  hubId,
  {
    page = 1,
    limit = 20,
    status = "active",
  } = {},
) => {
  await findHub(hubId);

  const skip = (page - 1) * limit;

  const filter = {
    hubId,
    status,
  };

  const [members, total] =
    await Promise.all([
      HubMembership.find(filter)
        .populate(
          "userId",
          "username email",
        )
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit)
        .lean(),

      HubMembership.countDocuments(filter),
    ]);

  return {
    members,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

export {
  addMember,
  inviteMember,
  approveMember,
  suspendMember,
  restoreMember,
  removeMember,
  changeMemberRole,
  transferOwnership,
  getMembership,
  getMembers,
};
