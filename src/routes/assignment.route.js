const express = require("express");
const router = express.Router();

const assignment_controller = require("../controllers/assignment.controller");

router.post("/createAssignments", assignment_controller.create_assignments); //tested

router.put("/retireAssignments", assignment_controller.retire_assignments); //tested

router.put("/successful/:id", assignment_controller.toggle_successful); //Toggle assignment's successful attribute true/false, tested

router.get("/:id", assignment_controller.details); //no test

router.get("/active/:uid", assignment_controller.active_user);

router.get("/inactive/:uid", assignment_controller.inactive_user);

// router.post("/create", assignment_controller.create);

// router.get("/all", assignment_controller.show_all);

// router.delete("/delete/:id", assignment_controller.delete);

module.exports = router;
