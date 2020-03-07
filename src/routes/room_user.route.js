const express = require("express");
const router = express.Router();

const room_user_controller = require("../controllers/room_user.controller");

router.get("/all", room_user_controller.show_all);

router.post("/add/:rid/:uid", room_user_controller.add_user);

router.delete("/delete/:rid/:uid", room_user_controller.remove_user);

router.get("/user/:uid", room_user_controller.show_user);

router.get("/:rid", room_user_controller.show_room);




module.exports = router;