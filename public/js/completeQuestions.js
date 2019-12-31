console.log('I am Complete Questions');

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

    console.log(arrayOfQuesToComplete);
    
    // Todo: add conditional that checks if page has radio buttons
    for (i = 0; i < arrayOfQuesToComplete.length; i++) {

        // Returns true or false depending on whether the question has been checked
        // If it's a radio

        // Returns Node List of 5 radios
        let nodeListOfQues = document.getElementsByName(arrayOfQuesToComplete[i]);
        let arrayOfQuestions = Array.from(nodeListOfQues);
        console.log(arrayOfQuestions);
        // console.log(arrayOfQuestions);
        
        if (true) {
            if (!checkRadios(arrayOfQuesToComplete[i])) {
                // Generate a random number which can be used to mark random element in an array of 5 as true
                let elementInArray = (Math.floor(Math.random() * 5));
                // console.log(elementInArray);
                // Mark a random radio box as true
                arrayOfQuestions[1].checked = true;
            }
        }

        if (arrayOfQuestions[i].type === "something") {
            let geeze = arrayOfQuesToComplete[i];
            let classList = geeze.classList;
            console.log(classList);
            // classList.contains("dropdn-form-validation");

        }
    }

    



    // If page doesn't have radio buttons, add the code that will select "no" on the yes/no questions and also adds lorum ipsim text on the text area

}

