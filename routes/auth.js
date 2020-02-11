// Add the auth.js route 
const express = require("express");
const router = express.Router();

// Add helpers
const getPageNumber = require('../helpers/getPageNumber.js');
const extractUrlAndPage = require('../helpers/extractUrlAndPage.js');

// Add code to handle the request from the the 01-individual-login.hbs page
const User = require("../models/user2.js");
// Commenting out as this is only required for Mturkers test
// const Mturk = require('../models/mTurk2.js');

router.post('/', (req, res) => {
    const firstName = req.body.firstNameOnLogin;
    const familyName = req.body.familyNameOnLogin;
    const email = req.body.emailOnLogin;

    User.findOne({ "email": email })
      .then(user => {
        if (user !== null) {
          res.render('index.hbs', {
            errorMessage1: "The email address you have entered is already registered.",
            errorMessage2: "Click Resume Survey if you would like to continue from where you left off."
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

/* --- Legacy Code --- */

/* Code below is to delete all codes (for dev purposes to be used in router.post("/") */

// Mturk.deleteMany()
// .then(() => {
//     console.log('All M-turk codes deleted');
//     })
//     .catch((error) => {
//     console.log(error);
// })

/* ---- End of Delete Codes ---- */