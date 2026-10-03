import { Router } from "express";

import * as hubController from "../controllers/hub.controllers.js"

import { 
  createHubSchema,
  updateHubSchema,
} from "../validators/hub.validator.js";

import authenticate from "../middleware/authenticate.js";
import validate from "../middleware/validate.js";
import { 
  requireHubMembership,
  requireHubRole,
} from "../middleware/hubAuthorization.js";

import asyncHandler from "../utils/async-handler.js";

const router = Router();

router.get(
  "/slug/:slug",
  authenticate,
  asyncHandler(hubController.getBySlug),
);

router.get(
  "/",
  authenticate,
  asyncHandler(hubController.get),
);

router.post(
  "/",
  authenticate,
  validate(createHubSchema),
  asyncHandler(hubController.create)
);

router.get(
  "/:hubId",
  authenticate,
  asyncHandler(hubController.getById)
);

router.patch(
  "/:hubId",
  authenticate,
  asyncHandler(requireHubMembership),
  requireHubRole([
    'owner',
    'admin',
  ]),
  validate(updateHubSchema),
  asyncHandler(hubController.update)
);

router.patch(
  "/:hubId/archive",
  authenticate,
  asyncHandler(requireHubMembership),
  requireHubRole(['owner']),
  asyncHandler(hubController.archive)
);

router.get(
  "/:hubId/members/count",
  authenticate,
  asyncHandler(requireHubMembership),
  asyncHandler(hubController.memberCount)
);

export default router;
