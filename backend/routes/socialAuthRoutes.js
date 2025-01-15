 // backend/routes/socialAuthRoute.js
 const express = require("express");
 const { socialLoginController } = require("../controllers/socialLoginController");
 
 const router = express.Router();
 console.log("in socialAuthRoutess")
 /**
  * @route POST /api/social-Auth/social-login
  * @desc Handle social login with Google
  * @access Public
  */
 router.post("/social-login", socialLoginController);
 
 module.exports = router;
 
