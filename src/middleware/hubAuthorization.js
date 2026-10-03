import asyncHandler from "../utils/async-handler.js";
import AppError from "../utils/app-error.js";

import {
  getMembership,
} from "../services/hubMembership.service.js";

const requireHubMembership = async (req, _res, next) => {
    const membership = await getMembership({
      hubId: req.params.hubId,
      userId: req.user.id,
    });

    if (!membership) {
      throw new AppError(
        403,
        "You are not a member of this Hub.",
        "HUB_MEMBERSHIP_REQUIRED",
      );
    }

    if (membership.status !== "active") {
      throw new AppError(
        403,
        "Your Hub membership is not active.",
        "HUB_MEMBERSHIP_INACTIVE",
      );
    }

    req.hubMembership = membership;

    next();
};

const requireHubRole = (...allowedRoles) => {
  return (req, _res, next) => {
    if (!req.hubMembership) {
      return next(
        new AppError(
          403,
          "Hub membership required.",
          "HUB_MEMBERSHIP_REQUIRED",
        )
      );
    }

    if (!allowedRoles.includes(req.hubMembership.role)) {
      return next(
        new AppError(
          403,
          "You do not have permission to perform this action.",
          "HUB_PERMISSION_DENIED",
        )
      );
    }

    next();
  };
};

export { 
  requireHubMembership,
  requireHubRole,
};
