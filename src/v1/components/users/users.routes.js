const router = require("express").Router();
const auth = require("../../../middleware/auth-handler");
const controller = require("./users.controller");
// console.log(controller)
// console.log("USER ROUTES FILE LOADED");

router.post("/register", controller.register);
router.post("/login", controller.login);
router.post("/refresh", controller.refresh);
router.post("/logout", auth(), controller.logout);
router.get("/me", auth(), controller.profile);
module.exports = router;
