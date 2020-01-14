// Declare function which checks all questions on page and disables dependencies if user has selected the trigger word
function disableDependOnPageLoad() {
    // Get array of questions on the page
    const arrayOfQuestions = getArrayOfQuestions();
    // Loop through each question ID and disable Dependices
    for (let i = 0; i < arrayOfQuestions.length; i++) {
        disableDependencies(arrayOfQuestions[i]);
    }
}

// Call Function
disableDependOnPageLoad()
