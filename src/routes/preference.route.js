const express = require("express");
const router = express.Router();

const preference_controller = require("../controllers/preference.controller");

router.put("/update/:id", preference_controller.update);

router.get("/all", preference_controller.show_all);

router.get("/user/:uid", preference_controller.show_user);

router.get("/chore/:cid", preference_controller.show_chore);

router.get("/room/:rid", preference_controller.show_room);

router.get("/:id", preference_controller.details);

//Routes disabled below

//router.post("/create", preference_controller.create);

//router.delete("/delete/:id", preference_controller.delete);

module.exports = router;
