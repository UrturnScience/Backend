const express = require("express");
const router = express.Router();

const chore_controller = require("../controllers/chore.controller");

router.get("/all", chore_controller.show_all); //no test

router.get("/:id", chore_controller.details); //no test

router.get("/room/:rid", chore_controller.show_room); //no test

router.get("/upcoming/:rid", chore_controller.upcoming_chores);

router.get("/active/:rid", chore_controller.active_chores);

router.post("/create", chore_controller.create); //tested

//Can only update time value
router.put("/update/:id", chore_controller.update); //tested

router.delete("/delete/:id", chore_controller.delete); //tested

module.exports = router;
