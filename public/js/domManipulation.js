// let urls = require('../bin/urls.js');
// I'm temporarily pasting the arry in here because I can't find a way of using imports and exports with client side JS

// Declare variables to track user's progress
let employed = true;
let student = undefined;
let timeTaken = 0;

const width  = window.innerWidth;
const height = window.innerHeight;
console.log(`width: ${width}, height ${height}`);



// This function is for checking the radios on Task 1 and Task 3
function checkQuestions(_arrayOfQuestions) {

    // Declare a varible to monitor whether the user has ticked a radio box for one of the questions
    let questionIsValid = true;

    for(let i = 0; i < _arrayOfQuestions.length; i++) {
        if (!checkRadios(_arrayOfQuestions[i])) {
            questionIsValid = false;
            break;
        }
    }
    
    // If statement which checks if the questionIsValid variable is false. If it is false, the warning box will appear
    if (!questionIsValid) {
        let warningMessageBig = '<div class="row"><div class="col-md-12 text-center"><div class="alert alert-danger" role="alert">Please make sure you answer all questions before continuing</div></div></div>'; 
        let warningMessageSmall = '<div class="row"><div class="col-md-12 text-center"><div class="alert-small" role="alert">Please make sure you answer all questions before continuing</div></div></div>';
        let pageNumberExists = document.getElementById('page-number');
            if (pageNumberExists) {                    
            document.getElementById('page-number').style.display = "none";
            }

        if (document.getElementById('warning-message-small') !== null) {
        document.getElementById('warning-message-small').innerHTML = warningMessageSmall;
        } else if (document.getElementById('warning-message') !== null) {
            document.getElementById('warning-message').innerHTML = warningMessageBig;
        } else {
            console.log('there is no warning message div on this page');
        }
        
    } else {
        // All questions have a radio box selected, so user can progress
        nextPage(window.location.pathname);
    }
}

// Function which removes the form validation warning when user clicks on any radio button
function removeWarning() {

    if (document.getElementById('warning-message-small') !== null) {
            document.getElementById('warning-message-small').innerHTML = '';
        } else if (document.getElementById('warning-message') !== null) {
            document.getElementById('warning-message').innerHTML = '';
        } else {
            console.log('there is no warning message div on this page');
        }
 
    let pageNumberExists = document.getElementById('page-number');
    
    if (pageNumberExists) {                    
        document.getElementById('page-number').style.display = "inherit";
    }
}


