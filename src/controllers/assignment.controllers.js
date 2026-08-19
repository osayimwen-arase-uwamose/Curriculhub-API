import { Assignment } from "../models/assignment.model.js";

const createAssignment = async (_req, _res) => { 
  try { 
    const { 
      courseTitle,
      courseCode,
      questions,
      questionsImageUrl,
    } = _req.body;

    if (
      !courseTitle
      || !courseCode
      || (!questions.length && !questionsImageUrl)
    ) { 
      console.log('[addAssignment] Missing required fields');

      return _res.status(400).json({ 
        success: false,
        message: 'Missing required fields',
      });
    };

    const assignment = await new Assignment({ 
      courseTitle,
      courseCode,
      questions,
      questionsImageUrl,
    });

    await assignment.save();

    console.log(`[addAssignment] New assignment added successfully. Course title: ${courseTitle}`);

    return _res.status(200).json({ 
      success: true,
      message: 'Assignment added successfully',
      body: { 
        assignment,
      },
    });
  } catch (_err) { 
    console.log(`[addAssignment] Internal server error: ${_err.message}`);

    return _res.status(500).json({ 
      success: false,
      message: 'Internal server error',
    });
  };
};

const readAssignments = async (_req, _res) => {
  try {
    const assignments = await Assignment.find();

    if (!assignments) { 
      console.log('[readAssignments] No assignment found');

      return _res.status(404).json({ 
        success: false,
        message: 'No Assignment found',
      });
    };

    console.log('[readAssignments] Assignment(s) read successfully');

    return _res.status(200).json({ 
      success: true,
      body: { 
        assignments,
      },
    });
  } catch (_err) {
    console.log(`[readAssignments] Internal server error: ${_err.message}`);

    return _res.status(500).json({ 
      success: false,
      message: 'Internal server error',
    });
  };
};

const updateAssignment = async (_req, _res) => { 
  try { 
    const { assignmentId } = _req.params;
    const updateData = _req.body;

    if (!assignmentId) { 
      console.log('[updateAssignment] invalid assignment id.');

      return _res.status(401).json({ 
        success: false,
        message: 'invalid assignment id.',
      });
    };

    if (!updateData) { 
      console.log('[updateAssignment] Missing update data in request.');

      return _res.status(400).json({ 
        success: false,
        message: 'empty request body.',
      });
    };

    const isUpdated = await Assignment.findByIdAndUpdate(
      assignmentId,
      updateData,
      { new: true },
    );

    if (!isUpdated) { 
      console.log('[updateAssignment] Assignment not found');

      return _res.status(404).json({ 
        success: false,
        message: 'Assignment not found',
      });
    };

    console.log('[updateAssignment] Assignment updated successfully');

    return _res.status(202).json({ 
      updated,
      success: true,
      message: 'Assignment updated successfully',
    });
  } catch (_err) { 
    console.log(`[updateAssignment] Internal server error: ${_err.message}`);

    return _res.status(500).json({ 
      success: false,
      message: 'Internal server error',
    });   
  };
};

const deleteAssignment = async (_req, _res) => { 
  try { 
    const { assignmentId } = _req.params;

    if (!assignmentId) { 
      console.log('[deleteAssignment] Missing assignment id in request.');

      return _res.status(401).json({ 
        success: false,
        message: 'Invalid assignment id.',
      });
    };

    const isDeleted = await Assignment.findByIdAndDelete(assignmentId);

    if (!isDeleted) { 
      console.log('[deleteAssignment] Assignment not found.');

      return _res.status(404).json({ 
        success: false,
        message: 'Assignment not found.',
      });
    };

    console.log('[deleteAssignment] Assignment deleted successfully.');
 
    return _res.status(202).json({ 
      success: true,
      message: 'Assignment deleted successfully.',
    });
  } catch (_err) { 
    console.log(`[deleteAssignment] Internal server error: ${_err.message}.`);

    return _res.status(500).json({ 
      success: false,
      message: 'Internal server error.',
    });   
  };
};

export { 
  createAssignment,
  readAssignments,
  updateAssignment,
  deleteAssignment,
};
