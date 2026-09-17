import slugify from "slugify"

import { Hub } from "../models/hub.model.js";
import { HubMembership } from "../models/hubMembership.model.js"

import AppError from "../utils/app-error.js";

const getHubs = async ({
  userId,
}) => {
  const memberships =
    await HubMembership.find({
      user: userId,
      status: "active",
    })
      .populate({
        path: "hub",
        select:
          "title description slug status createdBy createdAt updatedAt",
      })
      .sort({
        updatedAt: -1,
      })
      .lean();

  return memberships
    .filter(
      (membership) => membership.hub,
    )
    .map((membership) => ({
      id: membership.hub._id,
      title: membership.hub.title,
      description:
        membership.hub.description,
      slug: membership.hub.slug,
      status: membership.hub.status,
      createdBy:
        membership.hub.createdBy,
      createdAt:
        membership.hub.createdAt,
      updatedAt:
        membership.hub.updatedAt,
      membershipStatus:
        membership.status,
      role: membership.role,
    }));
};

const createHub = async ({
  title,
  description,
  createdBy,
}) => {
  const slug = slugify(title);

  const existingHub = await Hub.exists({
    slug,
  });

  if (existingHub) {
    throw new AppError(
      409,
      "A Hub with this title already exists.",
      "HUB_SLUG_EXISTS",
    );
  }

  try {
    const hub = await Hub.create({
      title,
      description,
      slug,
      createdBy,
    });

    await HubMembership.create({ 
      hub: hub._id,
      user: createdBy,
      role: 'owner',
      status: 'active',
    });

    return hub;
  } catch (error) {
    if (error?.code === 11000) {
      throw new AppError(
        409,
        "A Hub with this title already exists.",
        "HUB_SLUG_EXISTS",
      );
    }

    throw error;
  }
};

const getHubById = async (hubId) => {
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

const getHubBySlug = async (slug) => {
  const hub = await Hub.findOne({
    slug,
  });

  if (!hub) {
    throw new AppError(
      404,
      "Hub not found.",
      "HUB_NOT_FOUND",
    );
  }

  return hub;
};

const updateHub = async (
  hubId,
  updates,
) => {
  const hub = await Hub.findById(hubId);

  if (!hub) {
    throw new AppError(
      404,
      "Hub not found.",
      "HUB_NOT_FOUND",
    );
  }

  if (updates.title !== undefined) {
    throw new AppError(
      400,
      "Hub titles cannot be changed after creation because Hub slugs are permanent.",
      "HUB_TITLE_IMMUTABLE",
    );
  }

  const allowedUpdates = {};

  if (updates.description !== undefined) {
    allowedUpdates.description =
      updates.description;
  }

  const updatedHub =
    await Hub.findByIdAndUpdate(
      hubId,
      allowedUpdates,
      {
        new: true,
        runValidators: true,
      },
    );

  return updatedHub;
};

const archiveHub = async (hubId) => {
  const hub = await Hub.findById(hubId);

  if (!hub) {
    throw new AppError(
      404,
      "Hub not found.",
      "HUB_NOT_FOUND",
    );
  }

  if (hub.status === "archived") {
    throw new AppError(
      409,
      "Hub is already archived.",
      "HUB_ALREADY_ARCHIVED",
    );
  }

  hub.status = "archived";

  await hub.save();

  return hub;
};

const getHubMemberCount = async (
  hubId,
) => {
  const exists = await Hub.exists({
    _id: hubId,
  });

  if (!exists) {
    throw new AppError(
      404,
      "Hub not found.",
      "HUB_NOT_FOUND",
    );
  }

  return HubMembership.countDocuments({
    hubId,
    status: "active",
  });
};

export { 
  getHubs,
  createHub,
  getHubById,
  getHubBySlug,
  updateHub,
  archiveHub,
  getHubMemberCount,
};
