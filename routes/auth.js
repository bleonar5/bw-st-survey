// Add the auth.js route 
const express = require("express");
const router = express.Router();

// Add code to handle the request from the the 01-individual-login.hbs page

const User           = require("../models/user");
// Code below is only required if we are going to use passwords
// Add BCrypt to encrypt passwords (remember we are using bcryptjs)
const bcrypt         = require("bcryptjs");
const bcryptSalt     = 10;

// Create route for login
router.get('/individual-login', (req, res) => {
  res.render('0a-individual-login');
});

// Create post route
router.post("/individual-login", (req, res, next) => {
  const firstName = req.body.firstNameOnLogin;
  const familyName = req.body.familyNameOnLogin;
  const email = req.body.emailOnLogin;
  
// Create validations Part 1: Validate that all fields are correctly filled up
  if (firstName === "" || familyName === "" || email === "") {
    // This is the error message that appears if either of the fields has not been filled out
  res.render("1a-informed-consent", {
    // Temporarily replacing this code below with the line above to allow for site demo
  // res.render("0a-individual-login", {
    errorMessage: "Please complete all fields"
  });
  return;
}
// Validation Part 2:
  User.findOne({
      "email": email
    })
    .then(user => {
      if (user !== null) {
        res.render("1a-informed-consent", {
          // Temporarily replacing this code below with the line above to allow for site demo
        // res.render("0a-individual-login", {
          errorMessage: "The email has already been used!"
        });
        return;
      }
      /* 
      --- Code for Passwords ---
      Only need the code below if we are going to use passwords
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);
      */
     console.log(`User has registered with the following email address ${email}`);
      User.create({
          firstName,
          familyName,
          email
        })
        .then(() => {
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