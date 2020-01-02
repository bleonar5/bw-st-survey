/* 
This function will run a loop that:
(0) Uses the getQuestions function to get the IDs of each question
(1) Checks each of the radio questions and then marks each one as complete (Checking first-radio-box)
(2) If the page has non-radio questions, it will mark the questions 'no' so that user/tester can proceed
*/

// Function completes all radios
function completeQuestions() {

    // Returns IDs of the questions on the page
    let arrayOfQuesToComplete = getArrayOfQuestions();
    
    // Todo: add conditional that checks if page has radio buttons
    for (i = 0; i < arrayOfQuesToComplete.length; i++) {

        // Returns true or false depending on whether the question has been checked
        // If it's a radio

        // Returns Node List of 5 radios
        let nodeListOfQues = document.getElementsByName(arrayOfQuesToComplete[i]);
        // Array of Questions is an array of the five radio buttons
        let arrayOfQuestions = Array.from(nodeListOfQues);

        if (arrayOfQuestions[0].type === "radio") {
            if (!checkRadios(arrayOfQuesToComplete[i])) {
                // Generate a random number which can be used to mark random element in an array of 5 as true
                let elementInArray = (Math.floor(Math.random() * 5));
                // console.log(elementInArray);
                // Mark a random radio box as true
                arrayOfQuestions[elementInArray].checked = true;
            }
        } else {
            return false;
        }
    }
}

