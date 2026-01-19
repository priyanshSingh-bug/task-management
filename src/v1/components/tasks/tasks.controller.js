const Task = require("./tasks.model");

/**
 * CREATE TASK
 */
exports.create = async (req, res, next) => {
  try {
    const taskData = {
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      priority: req.body.priority,
      dueDate: req.body.dueDate,
      createdBy: req.user.id,
      assignee: req.body.assignee
    };

    // Only admin can assign task during creation
    if (req.user.role === "admin" && req.body.assignee) {
      taskData.assignee = req.body.assignee;
    }

    const task = await Task.create(taskData);

    res.status(201).json({
      success: true,
      data: task
    });
  } catch (err) {
    next(err);
  }
};

 /**
 * GET TASK
 */
exports.getAll = async (req, res, next) => {
  try {
    let q = {};

    if (req.user.role !== "admin") {
      q.$or = [
        { createdBy: req.user.id },
        { assignee: req.user.id }
      ];
    }

    if (req.query.status) q.status = req.query.status;
    if (req.query.priority) q.priority = req.query.priority;

    if (req.query.search) {
      q.$or = q.$or || [];
      q.$or.push(
        { title: { $regex: req.query.search, $options: "i" } },
        { description: { $regex: req.query.search, $options: "i" } }
      );
    }

    const tasks = await Task.find(q)
      .populate("createdBy", "name email role")
      .populate("assignee", "name email role");

    res.json({ success: true, data: tasks });
  } catch (err) {
    next(err);
  }
};
 
/**
 * GET ONE TASK
 */

exports.getOne = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("createdBy", "name email role")
      .populate("assignee", "name email role");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const isAdmin = req.user.role === "admin";
    const isCreator = task.createdBy._id.toString() === req.user.id;
    const isAssignee =
      task.assignee && task.assignee._id.toString() === req.user.id;

    if (!isAdmin && !isCreator && !isAssignee) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};


/**
 * UPDATE TASK
 */
exports.update = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const isAdmin = req.user.role === "admin";
    const isCreator = task.createdBy.toString() === req.user.id.toString();

    // Check if assignee exists and compare IDs
    const isAssignee = task.assignee && task.assignee.toString() === req.user.id.toString();
    if (isAdmin || isCreator) {
      Object.assign(task, req.body);
    }
    else if (isAssignee) {
      if (req.body.status) {
        task.status = req.body.status;
      } else {
        return res.status(401).json({
          message: "As an assignee, you can only update the status field."
        });
      }
    }
    else {
      return res.status(403).json({ message: "Forbidden: You are not authorized to update this task" });
    }

    await task.save();
    res.json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};


/**
 * DELETE TASK
 */
exports.delete = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (
      req.user.role !== "admin" &&
      task.createdBy.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await task.deleteOne();
    res.json({ success: true, message: "Task deleted" });
  } catch (err) {
    next(err);
  }
};

/**
 * STATS TASK
 */
exports.stats = async (req, res, next) => {
  try {
    const match =
      req.user.role === "admin"
        ? {}
        : { createdBy: req.user.id };

    const total = await Task.countDocuments(match);
    const completed = await Task.countDocuments({
      ...match,
      status: "completed"
    });

    const byPriority = await Task.aggregate([
      { $match: match },
      { $group: { _id: "$priority", count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        total,
        completed,
        pending: total - completed,
        byPriority
      }
    });
  } catch (err) {
    next(err);
  }
};
