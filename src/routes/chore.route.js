const express = require("express");
const router = express.Router();

const chore_controller = require("../controllers/chore.controller");

router.get("/all", chore_controller.show_all); //no test

router.get("/:id", chore_controller.details); //no test

router.get("/room/:rid", chore_controller.show_room); //no test

router.post("/create", chore_controller.create); //

//Can only update time value
router.put("/update/:id", chore_controller.update); 

router.delete("/delete/:id", chore_controller.delete); //

module.exports = router;
