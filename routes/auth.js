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

router.get('/home', (req, res) => {
    res.render('0d-home-page');
  });

router.get('/register', (req, res) => {
    res.render('0b-register');
});

router.post('/register', (req, res, next) => {
    // const firstName = firstNameOnRegister;
    // const familyName = familyNameOnRegister;
    const email = req.body.emailOnRegister;
    const password = req.body.passwordOnRegister;

    // Validation Part 1: Backend validation if email and password are empty
    if (email === "" || password === "") {
        // This is the error message that appears if either of the fields has not been filled out
      res.render("0b-register", {
        errorMessage: "Indicate a username and a password to sign up"
      });
      return;
    }

    User.findOne({ "email": email })
      .then(user => {
        if (user !== null) {
          res.render("0b-register", {
            errorMessage: "The email address you have entered is already registered"
          });
          return;
        }
        const salt = bcrypt.genSaltSync(bcryptSalt);
        const hashPass = bcrypt.hashSync(password, salt);
        User.create({
            // firstName,
            // familyName,
            email,
            password: hashPass
          })
          .then(() => {
            console.log(`user with email ${email} created`);
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

router.get('/login', (req, res) => {
    res.render('0c-login');
});

 // Add a POST method to handle form reqeust
 router.post("/login", (req, res, next) => {
 
    const theUsername = req.body.emailOnLogin;
    const thePassword = req.body.passwordOnLogin;
  
    if (theUsername === "" || thePassword === "") {
      res.render("0c-login", {
        errorMessage: "Please enter both, username and password to login."
      });
      return;
    }
  
    User.findOne({ "username": theUsername })
    .then(user => {
        if (!user) {
          res.render("0c-login", {
            errorMessage: "The username doesn't exist."
          });
          return;
        }
    // Use method from bcrypt called compareSync. This will compare the password with the saved password
    // You have to use the function compareSync because bcrypt compares the hashes that the 
        if (bcrypt.compareSync(thePassword, user.password)) {
          // Note how we create the user session (req.session.currentUser = user); the request object has a property called session where we can add the values we want to store on it. In this case, we are setting it up with the user’s information.
          req.session.currentUser = user;
          res.redirect("study-consent");
        } else {
          res.render("auth/login", {
            errorMessage: "Incorrect password"
          });
        }
    })
    .catch(error => {
      next(error);
    })
  });


// LEGACY CODE ---- TO BE DELETED ---- Create post route 
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