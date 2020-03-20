const express = require("express");
const router = express.Router();

const user_controller = require("../controllers/user.controller");

router.post("/login", user_controller.login);

router.delete("/logout", user_controller.logout);

router.post("/create", user_controller.create);

router.put("/update/:id", user_controller.update);

router.delete("/delete/:id", user_controller.delete);

router.get("/all", user_controller.show_all);

router.get("/:id", user_controller.details);

module.exports = router;
