const express = require("express");
const router = express.Router();

const preference_controller = require("../controllers/preference.controller");

router.post("/create", preference_controller.create);

// router.put("/:uid/:cid/update", preference_controller.update);

// router.delete("/delete/:cid/:uid", preference_controller.remove_user_chore);

// router.get("/all", preference_controller.show_all);

// router.get("/user/:uid", preference_controller.show_user);

// router.get("/chore/:cid", preference_controller.show_chore);

// router.get("/room/:rid", preference_controller.show_room);

// router.get("/:pid", preference_controller.show_preference);

module.exports = router;
