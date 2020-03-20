const express = require("express");
const router = express.Router();

const room_user_controller = require("../controllers/room_user.controller");

router.post("/add/:rid/:uid", room_user_controller.add_user);

router.delete("/delete/:uid", room_user_controller.remove_user);

router.get("/user/:uid", room_user_controller.show_user); //not tested

router.get("/:rid", room_user_controller.show_room); //not tested

router.get("/all", room_user_controller.show_all); //not tested

module.exports = router;
