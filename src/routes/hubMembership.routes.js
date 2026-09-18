import { Router } from "express";

import * as membershipController from "../controllers/hubMembership.controller.js";

import {
  addMemberSchema,
  changeMemberRoleSchema,
  listMembersSchema,
  memberIdParamsSchema,
  transferOwnershipSchema,
} from "../validators/hubMembership.validator.js";

import {
  requireHubMembership,
  requireHubRole,
} from "../middleware/hubAuthorization.js";

import { authenticate } from "../middleware/authenticate.js";
import asyncHandler from "../utils/async-handler.js";
import validate from "../middleware/validate.js";

const router = Router();

router.use(authenticate);
router.use(
  asyncHandler(requireHubMembership)
);

router.get(
  "/:hubId/members",
  requireHubMembership,
  validate(listMembersSchema),
  asyncHandler(membershipController.list),
);

router.get(
  "/:hubId/members/:userId",
  requireHubMembership,
  validate(memberIdParamsSchema),
  asyncHandler(membershipController.getMembership),
);

router.post(
  "/:hubId/members",
  requireHubRole([
    'owner',
    'admin',
  ]),
  validate(addMemberSchema),
  asyncHandler(membershipController.add),
);

router.post(
  "/:hubId/members/invite",
  requireHubRole([
    'owner',
    'admin',
  ]),
  validate(memberIdParamsSchema),
  asyncHandler(membershipController.invite),
);

router.patch(
  "/:hubId/members/:userId/approve",
  requireHubRole([
    'owner',
    'admin',
  ]),
  validate(memberIdParamsSchema),
  asyncHandler(membershipController.approve),
);

router.patch(
  "/:hubId/members/:userId/suspend",
  requireHubRole([
    'owner',
    'admin',
  ]),
  validate(memberIdParamsSchema),
  asyncHandler(membershipController.suspend),
);

router.patch(
  "/:hubId/members/:userId/restore",
  requireHubRole([
    'owner',
    'admin',
  ]),
  validate(memberIdParamsSchema),
  asyncHandler(membershipController.restore),
);

router.patch(
  "/:hubId/members/:userId/role",
  requireHubRole([
    'owner',
  ]),
  validate(changeMemberRoleSchema),
  asyncHandler(membershipController.changeRole)
);

router.delete(
  "/:hubId/members/:userId",
  requireHubRole([
    'owner',
    'admin',
  ]),
  validate(memberIdParamsSchema),
  asyncHandler(membershipController.remove),
);

router.patch(
  "/:hubId/ownership",
  requireHubRole([
    'owner',
  ]),
  validate(transferOwnershipSchema),
  asyncHandler(membershipController.transferOwner)
);

export default router;
