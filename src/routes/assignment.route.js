const express = require("express");
const router = express.Router();

const assignment_controller = require("../controllers/assignment.controller");

router.post("/create", assignment_controller.create);

router.get("/all", assignment_controller.show_all);

router.get("/:id", assignment_controller.details);

router.get("/room/:rid", assignment_controller.show_room);

router.get('/room/:rid/user/:uid', assignment_controller.show_room_user);

router.put("/:id/update", assignment_controller.update);

router.delete("/:id/delete", assignment_controller.delete);

module.exports = router;