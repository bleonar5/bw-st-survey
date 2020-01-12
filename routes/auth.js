// Add the auth.js route 
const express = require("express");
const router = express.Router();

// Add code to handle the request from the the 01-individual-login.hbs page
const User           = require("../models/user");
// Code below is only required if we are going to use passwords
// Add BCrypt to encrypt passwords (remember we are using bcryptjs)
const bcrypt         = require("bcryptjs");
const bcryptSalt     = 10;

// First Page
router.get("/", (req, res, next) => {
    res.render('index');
  });


// Create route for login
router.get('/individual-login', (req, res) => {
  res.render('0a-individual-login');
});

router.post('/individual-login', (req, res) => {
    const firstName = req.body.firstNameOnLogin;
    const familyName = req.body.familyNameOnLogin;
    const email = req.body.emailOnLogin;

    User.findOne({ "email": email })
      .then(user => {
        if (user !== null) {
          res.render('0a-individual-login', {
            errorMessage: "The email address you have entered is already registered"
          });
          return;
        }

        User.create({
            firstName,
            familyName,
            email
          })
          .then(() => {
            console.log(`user with email ${email} created`);
            req.session.currentUser = email;
            res.redirect("study-consent");
          })
          .catch(error => {
            console.log(error);
          })
      })
      .catch(error => {
        next(error);
      })
});


 
  module.exports = router;