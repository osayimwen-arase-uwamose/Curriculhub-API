import { Router } from "express";
import { 
  createAssignment,
  readAssignments,
  updateAssignment,
  deleteAssignment,
} from "../controllers/assignment.controllers.js";

const router = Router();

router.post('/create', createAssignment);
router.get('/read', readAssignments);
router.patch('/update/:assignmentId', updateAssignment);
router.delete('/delete/:assignmentId', deleteAssignment);

export default router;