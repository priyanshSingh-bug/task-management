const router = require("express").Router();
// console.log("ROUTES.JS LOADED");

router.use("/auth", require("../../v1/components/users/users.routes"));
router.use("/tasks", require("../../v1/components/tasks/tasks.routes"));
router.use("/admin", require("../../v1/components/users/admin.routes"));
module.exports = router;
