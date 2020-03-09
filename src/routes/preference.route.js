const express = require("express");
const router = express.Router();

const preference_controller = require("../controllers/preference.controller");

router.get("/all", preference_controller.show_all);

router.post("/add/:cid/:uid", preference_controller.create);

router.delete("/delete/:cid/:uid", preference_controller.remove_user_chore);

router.get("/user/:uid", preference_controller.show_user);

router.get("/:cid", preference_controller.show_chore);

router.get("/:rid", preference_controller.show_room);

module.exports = router;
