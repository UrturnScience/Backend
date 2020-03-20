const express = require("express");
const router = express.Router();

const room_controller = require("../controllers/room.controller");

router.get("/all", room_controller.show_all); //not tested

router.get("/:id", room_controller.details); //not tested

router.post("/create", room_controller.create); //not tested

router.delete("/delete/:id", room_controller.delete);

module.exports = router;
