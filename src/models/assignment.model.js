import { Schema, model } from "mongoose";

const assignmentSchema = new Schema({ 
  courseTitle: { 
    type: String,
  },

  courseCode: { 
    type: String,
  },

  questions: [{ 
    type: String,
  }],

  questionsImageUrl: { 
    type: String,
  },
}, { 
  timestamps: true,
});

export const Assignment = model("Assignment", assignmentSchema); 