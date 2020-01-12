// Post-select an item by the value of the value attribute
// Commenting out 


// Declare the array of questions that are on this page
const arrayOfQuestionsOnThisPage = getArrayOfQuestions();
// console.log(arrayOfQuestionsOnThisPage);

function setSelectedValues(_array) {

    arrayLength = _array.length;

    for (i = 0; i < arrayLength; i++) {

        let id = _array[i];
        let question = document.getElementById(id);

        // If ID doesn't exist, break the loop
        if (question == null) {
            break;
        }

        // Separate the dropdown questions
        if (question.classList.contains('dropdn-form-validation')) {

            // Declare variable which counts the number of options in the dropdown
            let numberOfDropdowns = question.options.length;
            for (j = 0; j < numberOfDropdowns; j++) {
                // Declare variable which states each option's value
                let dropdownValue = question.options[j].value;
                // If the value if the same as the value fetched from the backend, then the frontend should mark that value as selected
                // Note: "yes – full time" is a temporary value;
                if (dropdownValue === "yes – full time" || dropdownValue === "option 2 [BW to provide]" || dropdownValue === "Retail trade" || dropdownValue === "90-120k" || dropdownValue === "testing an option" ) {
                    question.options[j].selected = true;
                    break;
                }
            }
        // Check if it is a textarea question
        } else if (question.classList.contains('text-area-for-vali')) {
            question.value = "Filling in the text";
        // Check if it is a yes-no question
        } else if (question.classList.contains('yesno')) {

            // Change the label classname to active
            let yesNoLabels = question.getElementsByTagName("label");
            yesNoLabels[1].classList.add('active');
            // Change the checked value of the input
            let yesNoHtmlInput = question.getElementsByTagName("input");
            yesNoHtmlInput[1].checked = true;
            // Disable Dependencies if no is selected
            disableDependencies(id);
        } else {
            console.log('Question is not a dropdown, a yes-no or a textarea');
        }
    }
}


setSelectedValues(arrayOfQuestionsOnThisPage);


/*
function setSelectedIndex(s, valsearch) {

// Loop through all the items in drop down list
    for (i = 0; i < s.options.length; i++) {
        if (s.options[i].value == valsearch) {
    
    // Item is found. Set its property and exit
        s.options[i].selected = true;
        break;
        }
    }
    return;
}

setSelectedIndex(document.getElementById("ddl_example5"),"BB");


    */