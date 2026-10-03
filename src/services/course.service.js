import { Course } from "../models/course.model.js";
import { Hub } from "../models/hub.model.js";

import AppError from "../utils/app-error.js";

const findHub = async () => { 

}

const createCourse = async ({ 
  hubId,
  createdBy,
  courseTitle,
  courseCode,
  isElective = false,
  audience = null,
}) => { 
  const slug = slugify(courseTitle);

  const isExistingCourse = await Course.exists({
    slug, 
    hub: hubId,
  });

  if (isExistingCourse) { 
    throw new AppError (
      409,
      "A course with this title already exists in this hub",
      "COURSE_EXISTS",
    );
  };

  const newCourse = await Course.create({ 
    hubId,
    courseTitle,
    courseCode,
    isElective,
    audience,
    createdBy,
  });

  return newCourse;
};

const getCoursesByUser = async ({ 

}) => { 

};

const getCourseBySlug = async (hubId, slug) => { 
  const course = await Course.findOne({ hubId, slug, });

  const isExistingCourse = !!course;

  if (!isExistingCourse) { 
    throw new AppError(
      404,
      "Course not found",
      "COURSE_NOT_FOUND",
    );
  }

  return course;
};

const updateCourse = async (
  hubId,
  slug,
  updates,
) => { 
  const hub = await Hub.findById(hubId);

  const isExistingHub = !!hub;

  if (!isExistingHub) { 
    throw new AppError(
      404,
      "Hub not found",
      "HUB_NOT_FOUND",
    );
  };

  if (updates.title !== undefined) { 
    throw new AppError(
      400,
      "Course titles cannot be changed after creation because Hub slugs are permanent.",
      "COURSE_TITLE_IMMUTABLE",
    );
  };

  const allowedUpdates = {};

  if (updates.isElective !== undefined) { 
    allowedUpdates.isElective = updates.isElective;
  };

  if (updates.audience !== undefined) { 
    allowedUpdates.audience = updates.audience;
  };

  const updatedCourse = await Course.findOneAndUpdate(
    slug,
    allowedUpdates,
    { 
      new: true,
      runValidators: true,
    },
  );

  return updatedCourse;
};

export { 
  createCourse,
  getCourseBySlug,
  updateCourse,
};
