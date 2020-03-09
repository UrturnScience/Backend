const express = require("express");
const router = express.Router();

const room_controller = require("../controllers/room.controller");

router.get("/all", room_controller.show_all);

router.post("/create", room_controller.create);

router.get("/:id", room_controller.details);

router.put("/:id/update", room_controller.update);

router.delete("/:id/delete", room_controller.delete);


module.exports = router;
