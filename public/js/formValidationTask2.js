
function checkQuestionsTask2(_questionsArrayOnThisPage) {

    let questionIsValid = true;

    for(let i = 0; i < _questionsArrayOnThisPage.length; i++) {
        // If this statement returns false, at least one of the questions on the page has not been checked. We can break the loop and turn questionIsValid to false. This will then trigger the warning Message
        if (!checkDropdownsAndYesNosAndTextAreas(_questionsArrayOnThisPage[i])) {            
            questionIsValid = false;
            break;
    }}
    // If the loop above is broken because one of the questions is not valid, a warning box will appear
    if (!questionIsValid) {
        let warningMessageBig = '<div class="row"><div class="col-md-12 text-center"><div class="alert alert-danger" role="alert">Please make sure you answer all questions before continuing</div></div></div>'; 
        let warningMessageSmall = '<div class="row"><div class="col-md-12 text-center"><div class="alert-small" role="alert">Please make sure you answer all questions before continuing</div></div></div>';
        let pageNumberExists = document.getElementById('page-number');
            if (pageNumberExists) {                    
            document.getElementById('page-number').style.display = "none";
            }
        document.getElementById('warning-message-small').innerHTML = warningMessageSmall;
    } else {
        // All questions have a radio box selected, so user can progress
        console.log('Front End Check Complete');
        // Comment out nextPage as the backend is doing validation to send to next page
        // nextPage(window.location.pathname);
}}


function checkDropdownsAndYesNosAndTextAreas(_quesId) {
    // Declare variable which grabs the element which has the question ID
    let question = document.getElementById(_quesId);
    // Declare boolean variable to check if questions have been marked by the user. 
    let checked = false;
    
    // Declare variable which stores the text of the current selected index of the ques
    if (question.classList.contains("dropdn-form-validation")) 
    { 
        // Declare variable which stores which of the dropdown options is currently selected by the user
        let selectedOption = question.options[question.selectedIndex];
        // If the selected index is not equal to "-- select an option, the user has changed the option so the question has been checked
        // If the selected Option or the parent of the select Option is disabled, this question has been skipped, so the question has also been "checked"
        if ( (selectedOption.text !== "-- select an option --") || selectedOption.classList.contains("skipped") || selectedOption.parentNode.classList.contains("skipped") ) {
            checked = true;
    }}

    // Run check to see if yes-no questions have been completed
    if (question.classList.contains("yesno")) {
        // yesNoHtmlCollection is an html collection
        let yesNoHtmlCollection = question.getElementsByTagName("label");
        let yesNoArray = Array.from(yesNoHtmlCollection);

        // Check if either the yes or no button has been selected by the user
        if (yesNoArray[0].classList.contains("active") || yesNoArray[1].classList.contains("active")) {
            checked = true;
            console.log('yes, no has been selected');
    }}

    // Run check to see if text boxes have been filled
    if (question.classList.contains("text-area-for-vali")) {
        // Declare variable which stores the text that the user has input in the text area
        let value = question.value;
        // If the value is not equal to nothing, then the question can be marked true
        if (value.length === 0 && !question.classList.contains("skipped") ) {
            checked = false;
        } else {
            checked = true;
    }}

    // The function will return false if any of the questions have not been checked
    return checked;
}

