const express = require("express");
const router = express.Router();
const UserController=require("../controllers/user-controllers");

router.post("/signup",UserController.signUp);
router.post("/login",UserController.logIn);
router.post("/logout",UserController.logout);

module.exports=router;
