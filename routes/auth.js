// Add the auth.js route 
const express = require("express");
const router = express.Router();

// Add helpers
const getPageNumber = require('../helpers/getPageNumber.js');
const extractUrlAndPage = require('../helpers/extractUrlAndPage.js');

// Add code to handle the request from the the 01-individual-login.hbs page
const User = require("../models/user");
const Mturk = require('../models/mturk.js');

// Code below is only required if we are going to use passwords
// Add BCrypt to encrypt passwords (remember we are using bcryptjs)
// const bcrypt         = require("bcryptjs");
// For a production ready code, do not settle for saltRounds less than 12.
// const bcryptSalt     = 12;

/* --- Declare locally stored variables (before storing them on a db) --- *//*
const redemCodes = require('../bin/redem-codes.js');
const allUrls = require('../bin/urls.js');
*/

// First Page
router.get("/", (req, res, next) => {
    res.render('index');
});

router.post("/", (req, res, next) => {

    const redemCodes = require('../bin/redem-codes.js');
    const numberOfCodesInDb = redemCodes.length;

    /* Code below is to delete all codes */
    
    // Mturk.deleteMany()
    // .then(() => {
    //     console.log('All M-turk codes deleted - Note: You need to comment this out when in prod');
    //     })
    //     .catch((error) => {
    //     console.log(error);
    // })

    /* ---- End of Delete Codes ---- */
 
    // Find all the codes
    Mturk.find()
    .then((arrayOfCodes) => {

        if (arrayOfCodes.length === 0) {
                /*  
                Code below is to set up codes in the first place (If the redemCodes are empty, you need to set it up with all the new redemCodes) 
                This code will send redem codes to the database.
                */ 
            for (i = 0; i < numberOfCodesInDb; i++) {
                const uniqueId = redemCodes[i].id;
                const redemCode = redemCodes[i].redemcode;
                const status = '1-available';
                const newRedemGenerated = new Mturk ( { uniqueId, redemCode, status } );
        
                newRedemGenerated.save()
                    .then( (answer) => {
                        console.log(`Mturk Redem loaded to the db:: ${answer}`);
                    })
                    .catch((error) => {
                        console.log(error);
                    })
            }

            Mturk.find()
            .then((arrayOfCodes) => {
                const totalCodes = arrayOfCodes.length;
                console.log(`db now has ${totalCodes} codes`);
            })
            .catch((error) => {
                console.log(error);
            })
        }
        // Filter the answer to get the codes that are available
        const availableIdsAndCodes = arrayOfCodes.filter(data => data.status === "1-available");
        const totalCodesAvailable = availableIdsAndCodes.length;
        console.log(`We have ${totalCodesAvailable} codes available`);

        // Get a random code from the list
        const randomNumber = Math.floor(Math.random() * totalCodesAvailable + 1);
        // Pull that code from the array (minus 1 from it)
        const uniqueIdForTurker = arrayOfCodes[randomNumber - 1];

        // Mark the code as now inUse by updating the status on the db
        // Update the object by adding a new property to the object saying status = "inUse"
        Mturk.updateOne( { uniqueId : uniqueIdForTurker.uniqueId }, { $set: { status: "2-inUse" }})
         .then( () => {
            console.log(`${uniqueIdForTurker.uniqueId} updated`);
            // Assign the unique ID as the user's email address

            req.session.currentUser = uniqueIdForTurker.uniqueId;
            req.session.redem = uniqueIdForTurker.redemCode;
            console.log(req.session);
            console.log('all done');

            /* ---- Code below is to delete all codes ---- */
            
            // Mturk.deleteMany()
            // .then(() => {
            //     console.log('All M-turk codes deleted');
            //     })
            //     .catch((error) => {
            //     console.log(error);
            // })

            /* ---- End of Delete Codes ---- */

         })
         .then ( () => {
            res.redirect('/study-consent')
         })
         .catch((error) => {
            console.log(error);
         })
    })
    .catch((error) => {
        console.log(error);
}) // catch
}) // find


// On the finalpage 
// Delete the user object from the array of availabe or inuse usernames
// Add the user object to a new database called used usernames or something like that


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