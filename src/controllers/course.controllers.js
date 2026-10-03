import { 
  getCourseBySlug,
  createCourse,
  updateCourse,
} from "../services/course.service.js";

const getBySlug = async (req, res) => { 
  const course = await getCourseBySlug(req.params.slug);

  return res.status(200).json({ 
    data: course,
  });
};

const create = async (req, res) => {
  const data = req.validated;

  const course = await createCourse({
    ...data,
    createdBy: req.user.id,
  });

  return res.status(201).json({
    data: course,
  });
};

const update = async (req, res) => {
  const course = await updateCourse(
    req.params.hubId,
    req.validated,
  );

  return res.status(200).json({
    data: course,
  });
};

export { 
  getBySlug,
  create,
  update,
};
