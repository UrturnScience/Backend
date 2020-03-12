const express = require("express");
const router = express.Router();

const room_controller = require("../controllers/room.controller");

router.get("/all", room_controller.show_all);

router.post("/create", room_controller.create);

router.get("/:id", room_controller.details);

router.put("/update/:id", room_controller.update);

router.delete("/delete/:id", room_controller.delete);


module.exports = router;
