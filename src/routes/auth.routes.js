import { Router } from "express";

import  {
  register,
  login,
  refresh,
  logout,
  logoutAll,
} from '../controllers/auth.controllers.js';

import authenticate from "../middleware/authenticate.js";

import { 
  authRateLimit,
  loginRateLimit,
} from "../middleware/rate-limit.js";

import asyncHandler from "../utils/async-handler.js";

const router = Router();

router.post(
  '/register',
  authRateLimit,
  asyncHandler(register)
);

router.post(
  '/login',
  loginRateLimit,
  asyncHandler(login)
);

router.post(
  '/refresh',
  authRateLimit,
  asyncHandler(refresh)
);

router.post(
  '/logout',
  asyncHandler(logout)
);

router.post(
  '/logout-all',
  authenticate,
  asyncHandler(logoutAll)
);

export default router;
