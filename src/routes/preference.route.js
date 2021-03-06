const express = require("express");
const router = express.Router();

const preference_controller = require("../controllers/preference.controller");

router.put("/update/:uid", preference_controller.update); //tested

router.get("/upcoming/:uid", preference_controller.upcoming_preferences);

router.get("/:id", preference_controller.details); //not tested

//Routes disabled below

//router.post("/create", preference_controller.create);

//router.delete("/delete/:id", preference_controller.delete);

// router.get("/all", preference_controller.show_all); //not tested

// router.get("/user/:uid", preference_controller.show_user); //not tested

// router.get("/chore/:cid", preference_controller.show_chore); //not tested

// router.get("/room/:rid", preference_controller.show_room); //not tested

module.exports = router;
