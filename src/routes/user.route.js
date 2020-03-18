const express = require("express");
const router = express.Router();

const user_controller = require("../controllers/user.controller");

router.get("/all", user_controller.show_all);

router.post("/create", user_controller.create);

router.post("/login", user_controller.login);

router.delete("/logout", user_controller.logout);

router.get("/:id", user_controller.details);

router.put("/update/:id", user_controller.update);

router.delete("/delete/:id", user_controller.delete);

module.exports = router;
