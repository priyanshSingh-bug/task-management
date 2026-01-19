const router = require("express").Router();
const auth = require("../../../middleware/auth-handler");
const User = require("./users.model");
const mongoose = require("mongoose");

router.use(auth(["admin"]));

// get users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password -refreshToken");

    res.json({
      success: true,
      data: users
    });
  } catch (err) {
    console.error("Get users error:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});


//insert new user
router.put("/users/:id/role", async (req, res) => {
  try {
    const { role } = req.body;
    const { id } = req.params;

    //  Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user id"
      });
    }

    //  Validate role
    if (!["admin", "user"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role"
      });
    }

    //  Check user existence
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    //  Update role
    user.role = role;
    await user.save();

    res.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        // email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error("Update role error:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});


//delete the user
router.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user id"
      });
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      message: "User deleted successfully"
    });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

module.exports = router;
