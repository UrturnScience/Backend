const express = require("express");
const router = express.Router();

const preference_controller = require("../controllers/preference.controller");

//router.post("/create", preference_controller.create);

router.put("/update/:id", preference_controller.update);

//router.delete("/delete/:id", preference_controller.delete);

router.get("/all", preference_controller.show_all);

router.get("/user/:uid", preference_controller.show_user);

router.get("/chore/:cid", preference_controller.show_chore);

router.get("/room/:rid", preference_controller.show_room);

router.get("/:id", preference_controller.details);

module.exports = router;
