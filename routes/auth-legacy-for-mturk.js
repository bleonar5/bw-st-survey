/*
Below is legacy code for the testing with mturkers (completed end of Jan 2020)
Code generates new redem codes by pulling them from db
MTurkers are then given code at end of survey


router.post("/", (req, res, next) => {

    const redemCodes = require('../bin/redem-codes.js');
    const numberOfCodesInDb = redemCodes.length; 
    
    // Find all the codes
    Mturk.find()
    .then((arrayOfCodes) => {

        // Set up Redem Codes for M-Turkers
        if (arrayOfCodes.length === 0) {
                 
            // Code below is to set up codes in the first place (If the redemCodes are empty, you need to set it up with all the new redemCodes). This code will send redem codes to the database. 
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
        // End of Setting Up Redem Codes

        // Filter the answer to get the codes that are available
        const availableIdsAndCodes = arrayOfCodes.filter(data => data.status === "1-available");
        const totalCodesAvailable = availableIdsAndCodes.length;
        console.log(`There are ${totalCodesAvailable} codes available`);

        // Get a random code from the list
        const randomNumber = Math.floor(Math.random() * totalCodesAvailable + 1);
        // Pull that code from the array (minus 1 from it)
        const uniqueIdForTurker = arrayOfCodes[randomNumber - 1];

        // Mark the code as "2-inUse" by updating the status on the db
        // Update the object by adding a new property to the object saying status = "inUse"
        Mturk.updateOne( { uniqueId : uniqueIdForTurker.uniqueId }, { $set: { status: "2-inUse" }})
         .then( () => {
            console.log(`${uniqueIdForTurker.uniqueId} updated`);
            // Assign the unique ID as the user's email address
            // Note, do not retrieve the redem code until the end of the survey. You do not want the redem code in the reqSession while user is still completing survey
            req.session.redemptionCode = null;
            req.session.currentUser = uniqueIdForTurker.uniqueId;
            console.log(req.session);

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
})});

*/