const express = require("express");
const router = express.Router();

const chore_controller = require("../controllers/chore.controller");

router.post("/create", chore_controller.create);

router.get("/all", chore_controller.show_all);

router.get("/:id", chore_controller.details);

router.get("/room/:rid", chore_controller.show_room);

router.put("/:id/update", chore_controller.update);

router.delete("/:id/delete", chore_controller.delete);

module.exports = router;
