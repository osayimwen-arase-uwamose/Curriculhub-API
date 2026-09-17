import asyncHandler from "../utils/async-handler.js"

import {
  createHubSchema,
} from "../validators/hub.validator.js";

import {
  getHubs,
  createHub,
  getHubById,
  getHubBySlug,
  updateHub,
  archiveHub,
  getHubMemberCount,
} from "../services/hub.service.js";

const get = async (req, res) => { 
  const hubs = await getHubs({ 
    userId: req.user.id,
  });

  return res.status(201).json({ 
    data: hubs,
  });
};

const create = async (req, res) => {
  const data = req.validated;

  const hub = await createHub({
    ...data,
    createdBy: req.user.id,
  });

  return res.status(201).json({
    data: hub,
  });
};

const getById = async (req, res) => {
  const hub = await getHubById(
    req.params.hubId
  );

  return res.status(200).json({
    data: hub,
  });
};

const getBySlug = async (req, res) => {
  const hub = await getHubBySlug(
    req.params.slug
  );

  return res.status(200).json({
    data: hub,
  });
};

const update = async (req, res) => {
  const hub = await updateHub(
    req.params.hubId,
    req.validated,
  );

  return res.status(200).json({
    data: hub,
  });
};

const archive = async (req, res) => {
  const hub = await archiveHub(
    req.params.hubId
  );

  return res.status(200).json({
    data: hub,
  });
};

const memberCount = async (req, res) => {
    const count = await getHubMemberCount(
      req.params.hubId
    );

    return res.status(200).json({
      data: {
        count,
      },
    });
};

export { 
  get,
  create,
  getById,
  getBySlug,
  update,
  archive,
  memberCount,
};
