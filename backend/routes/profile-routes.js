const express=require('express');
const router=express.Router();
const profileController=require('../controllers/profile-controllers');

router.post("/createProfile",profileController.createProfile);
router.get("/showProfile/:id",profileController.getProfile);

module.exports=router;