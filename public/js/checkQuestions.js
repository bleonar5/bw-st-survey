

// This function is for checking the radios on Task 1 and Task 3
function checkQuestionsRadios(_arrayOfQuestions) {

    // Declare a varible to monitor whether the user has ticked a radio box for one of the questions
    let questionIsValid = true;

    // If numberOfRadios is equal to 0, then the form validation will all be done on the backend
    let numberOfRadios = document.getElementsByName('radioques').length;

    if (numberOfRadios === 0) {
        return true;
    } else {
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

            if (document.getElementById('back-button') !== null) {
                document.getElementById('back-button').style.display = "none";
            }
            
        } else {
            // All questions have a radio box selected, so user can progress
            return true;
        }
    }
}


function checkQuestionsTaskTwo(_arrayOfQuestions) {


    // Loop through each question

    // If the div with the ID has a class with skipped then that's fine

    

    console.log(_arrayOfQuestions);
    // Declare a varible to monitor whether the user has ticked a radio box for one of the questions
    let questionIsValid = true;

    for(let i = 0; i < _arrayOfQuestions.length; i++) {
        if (!checkRadios(_arrayOfQuestions[i])) {
            questionIsValid = false;
            console.log(`question is not valid as question ${i} has not been answered`);
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
            console.log(`display warning message`);
        } else if (document.getElementById('warning-message') !== null) {
            document.getElementById('warning-message').innerHTML = warningMessageBig;
        } else {
            console.log('there is no warning message div on this page');
        }

        if (document.getElementById('back-button') !== null) {
            document.getElementById('back-button').style.display = "none";
        }
        
    } else {
        // All questions have a radio box selected, so user can progress
        currentPath = window.location.pathname;
       //  console.log(currentPath);
        // nextPage(currentPath);
    }
}