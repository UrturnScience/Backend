const express = require("express");
const router = express.Router();

const user_controller = require("../controllers/user.controller");

router.post("/login", user_controller.login); //tested

router.delete("/logout", user_controller.logout); //tested

router.get("/all", user_controller.show_all); //not tested

router.get("/:id", user_controller.details); //not tested

// router.post("/create", user_controller.create);

// router.put("/update/:id", user_controller.update);

// router.delete("/delete/:id", user_controller.delete);

module.exports = router;
