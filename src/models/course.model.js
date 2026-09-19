import { Schema, model } from "mongoose";

const courseSchema = new Schema({ 
  courseTitle: { 
    type: String,
    required: true,
  },

  courseCode: { 
    type: String,
    required: true,
  },

  hub: { 
    type: Schema.Types.ObjectId,
    ref: "Hub",
    required: true,
  },

  isElective: { 
    type: Boolean,
    default: false,
  },

  audience: [{ 
    field: String,
    dataValue: String
  }],
}, { 
  timestamps: true,
});

export const Course = model("Course", courseSchema); 
