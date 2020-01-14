/*   
The script below will disable questions according to which answer the user gives on other questions
The data is extracted from the variables below. Currently it does not work dynamically so if you change the IDs of the questions, you also need to change the numbers that the variables are assigned to below.
*/

// Declare variable employementStatus which will be used to determine whether one of the pages will be skipped or not
let skipNextQuestion = false;

// Declare varibles that are the IDs of the yes-no questions that have dependencies. When the user selects 'no' on these questions (n), the following question (n + 1) will be disabled. If the user then clicks 'yes' on question n, the following question (n + 1) will be enabled again. 
const hardCodedYesNo1 = 21201;
const hardCodedYesNo2 = 21203;
const hardCodedEmploymentQuestion = 20901;

// This is a temporary array. It should be stored somewhere else and kept in middleware instead. It is currently used by the checkDependencies function.
const dependenciesArray =

[
    {
        "id": 20901,
        "text": "Are you currently employed?",
        "trigger": "no",
        "action": "disable",
        "dependencies": "20902; 20903; 20904; 20905; 21005; 21006; 21007; 21008"
    },
    {
        "id": 21201,
        "text": "In the last year, have you been part of any recreational clubs or groups that involves working in groups?",
        "trigger": "no",
        "action": "disable",
        "dependencies": 21202
    },
    {
        "id": 21203,
        "text": "In the last year, have you worked with others as a volunteer, for example for a charity or for a local church?",
        "trigger": "no",
        "action": "disable",
        "dependencies": 21204
    }
]

const questionsWithDependencies = extractQuestionsWithDependencies(dependenciesArray);

// Todo (Low Priority): Move this function to another js file
function convertSemiColonsToArray(_ques) {
    // If string contains a semi colon
    let optionsString = _ques;
    // Split the string into an array
    let result = optionsString.split(';').map(e => e.split(';'));
    let newArray = [];

    // Loop through array, remove square brackets, \ and ""
    for (let i = 0; i < result.length; i++) {
        // Todo: this could be more concise
        let jsonstringify = JSON.stringify(result[i]);
        let withoutOpeningBrackets = jsonstringify.replace("[","");
        let withoutBothBrackets = withoutOpeningBrackets.replace("]", "");
        let withoutOpeningQuotes = withoutBothBrackets.replace("\"", "");
        let withoutBothQuotes = withoutOpeningQuotes.replace("\"", "");
        let trimmedString = withoutBothQuotes.trim();
        newArray.push(trimmedString); 
    }
    return newArray;
}

function disableDependencies(_id) {

    if (questionsWithDependencies.includes(_id)) {

    let dependencies = checkDependencies(_id, dependenciesArray);
    // Temporarily hardcoding Ids (checking if the hardcoded IDs are the YesNo questions in task-2-part-3
    if ( _id === hardCodedYesNo1 || _id === hardCodedYesNo2) {

        // Convert NodeList to array
        let yesNoArray = Array.from(document.getElementsByName(_id));
        // Dependency is the next question (i.e. ID plus 1)
        let dependency = document.getElementById(parseInt(_id) + 1);
        // Check which of the yes no questions is active (yesNoArray[0] is 'yes')
        if (yesNoArray[0].checked) {
            dependency.disabled = false;
            dependency.classList.remove("skipped");
            dependency.parentNode.classList.remove("skipped");
        // Check which of the yes no questions is active (yesNoArray[1] is 'no')
        } else if (yesNoArray[1].checked) {
            dependency.disabled = true;
            // Choose --select an option-- on dropdown
            dependency.options[0].selected = true;
            // Todo: Deselect all options
            dependency.classList.add("skipped");
            dependency.parentNode.classList.add("skipped");
        } 
    // Code below is for the "Are you currently employed?" (task-2-part-1a) question 
    } else if (_id === hardCodedEmploymentQuestion) {
    // Declare variable which retrieves value for the selected question
    let valueSelected = document.getElementById(_id).value;
    let arrayOfDependencies = convertSemiColonsToArray(dependencies);
    // Trigger word is not the same as the value selected, so function removes "skipped" classes and remove "disabled" class 
        if (valueSelected === 'no' || valueSelected === 'I am a full time student') { 
            skipNextQuestion = true;
            for (i = 0; i < arrayOfDependencies.length; i++) {
                // Convert string to number with parseInt. If element exists perform action
                let element = document.getElementById(parseInt(arrayOfDependencies[i]));
                    if (typeof(element) != 'undefined' && element != null) {
                        element.value = "";
                        element.disabled = true;
                        element.classList.add("skipped");
                        element.parentNode.classList.add("skipped");
            }}
        // Trigger word is the same as the value selected, so you select the disabled 
        } else {
            // Convert the database input from a string with semicolons to an array so that we can loop through the new array and disable the questions
            skipNextQuestion = false;
            for (i = 0; i < arrayOfDependencies.length; i++) {

                let element =  document.getElementById(parseInt(arrayOfDependencies[i]));
                if (typeof(element) != 'undefined' && element != null) {
                    // Convert string to number with parseInt
                    document.getElementById(parseInt(arrayOfDependencies[i])).disabled = false;
                    document.getElementById(parseInt(arrayOfDependencies[i])).classList.remove("skipped");
                    document.getElementById(parseInt(arrayOfDependencies[i])).parentNode.classList.remove("skipped");
}}}}} else {
        return false
    }
}


// Function which returns the dependencies of a question
function checkDependencies(_id, _dependenciesArray) {

    let hasDependencies = false;

    for (let i = 0; i < _dependenciesArray.length; i++) {
        if (_dependenciesArray[i].id === _id) {
            hasDependencies = true;
            return dependenciesArray[i].dependencies;
        } 
    }

    if (!hasDependencies) {
        return false;
    }
}


function extractQuestionsWithDependencies(_dependenciesArray) {
    
    let array = [];
    let length = _dependenciesArray.length

    for (let i = 0; i < length; i++) {
        let id = _dependenciesArray[i].id;
        array.push(id);
    }

    return array;
}
