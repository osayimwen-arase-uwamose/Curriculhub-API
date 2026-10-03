import { Router } from "express";

import * as courseController from "../controllers/course.controllers.js";

import { 
  createCourseSchema,
  updateCourseSchema,
} from "../validators/course.validator.js";

import authenticate from "../middleware/authenticate.js";
import validate from "../middleware/validate.js";

import { 
  requireHubMembership, requireHubRole,
} from "../middleware/hubAuthorization.js";

import asyncHandler from "../utils/async-handler.js";

const router = Router();

router.use(authenticate);
asyncHandler(requireHubMembership);

router.get(
  '/:slug/:courseId/:hubId',
  asyncHandler(courseController.getBySlug),
);

router.post(
  '/',
  requireHubRole([
    'owner',
    'admin',
  ]),
  validate(createCourseSchema),
  asyncHandler(courseController.create),
);

router.patch(
  '/:slug/:courseId/:hubId',
  requireHubRole([
    'owner',
    'admin',
  ]),
  validate(updateCourseSchema),
  asyncHandler(courseController.update)
);

export default router;
