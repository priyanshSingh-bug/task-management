const router = require("express").Router();
const auth = require("../../../middleware/auth-handler");
const controller = require("./tasks.controller");

router.use(auth());
router.post("/", controller.create);
router.get("/", controller.getAll);
router.get("/stats", controller.stats);
router.get("/:id", controller.getOne);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

module.exports = router;
