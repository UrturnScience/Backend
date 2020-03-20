const express = require("express");
const router = express.Router();

const assignment_controller = require("../controllers/assignment.controller");

router.post("/create", assignment_controller.create);

router.put("/update/:id", assignment_controller.update);

router.get("/all", assignment_controller.show_all);

router.get("/:id", assignment_controller.details);

router.delete("/delete/:id", assignment_controller.delete);

//router.get("/room/:rid", assignment_controller.show_room); to be configured later

//router.get('/room/:rid/user/:uid', assignment_controller.show_room_user); to be configured later

router.post("/createAssignments", assignment_controller.create_assignments);

router.put("/retireAssignments", assignment_controller.retire_assignments);

module.exports = router;
