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
// Require the email list so that a check can be performed against the participants who first registered for Superteams
const LegitEmail = require("../models/emaillist.js");

// This code is commented out as it only needs to be run once to ensure that the email address array is populated
/*
router.post('/', (req, res) => {

    // --- This step will only run once so that the db is populated with email addresses --- //
    // Require the list of emails addresses which will be valid
    const legitEmails = require('../bin/legitemails.js');
    const totalLegitEmails = legitEmails.length


    // Look for the array of Emails
    LegitEmail.find()
    .then( (arrayOfEmails) => {
        console.log('lengthOfEmails');
        console.log(arrayOfEmails.length);
        // If it's equal to zero then we need to set up the database. This will only need to be run once
        if (arrayOfEmails.length === 0 ) {
            for (i = 0; i < totalLegitEmails; i++) {
                // Assign and email after pulling from the bin
                const uniqueId = legitEmails[i].id;
                const emailPopulated = legitEmails[i].email;
                console.log('inside for loop');
                console.log(i);

                const newEmailGenerated = new LegitEmail ( { uniqueId, emailPopulated } );

                newEmailGenerated.save()
                .then( (email) => {
                    console.log(`Email loaded to the db:: ${email}`);
                })
                .catch((error) => {
                    console.log(error);
                })
        }

        // Then look up and check that the list has been populated
        LegitEmail.find()
        .then((arrayOfEmails) => {
            const totalEmails = arrayOfEmails.length;
            console.log(`db currently has ${totalEmails} emails in the database. These emails will be used to check against`);
        })
        .catch((error) => {
            console.log(error);
        })
    }

    // --- End of email address population ---

    const firstName = req.body.firstNameOnLogin;
    const familyName = req.body.familyNameOnLogin;
    const email = req.body.emailOnLogin;

    LegitEmail.findOne({ "emailPopulated": email })
    .then(emailAddress => {
        console.log('here is the result')
        console.log(emailAddress);
        if (emailAddress === null) {
            res.render('index.hbs', {
                errorMessage1: "The email address you have entered has not been recognized. Please use the same email you gave when you registered for the Superteams study.",
              });
            return;
        }
            User.findOne({ "email": email })
            .then(user => {
                if (user !== null) {
                res.render('index.hbs', {
                    errorMessage1: "The email address you have entered is already registered. Click Resume Survey if you would like to continue from where you left off.",
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
        console.log(error);
      })
})
})
});
*/
 
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