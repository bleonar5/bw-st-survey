console.log(`Hello, Dom. I'm the front end`);
const width  = window.innerWidth;
const height = window.innerHeight;

console.log(`width: ${width}, height ${height}`);


// This function below will work regardless of what question type (i.e. radios, yesnos, dropdowns etc.) we are dealing with. To make it work you need to add the classname "first-radio-box" to the questions).
function getArrayOfQuestions() {
    // Returns an HTML collection of the first radio boxes for each question (note: this is because the classname first-radio-box is only present on the first radio box of each question)
    let $collectionOfFirstRadios = document.getElementsByClassName("first-radio-box");

    // Convert HTML collection to array
    const arrayFromCollection = Array.from($collectionOfFirstRadios);
    // console.log(arrayFromCollection);

    // Declare empty array into which we will push the question IDs
    let arrayOfQuestionIds = [];

    for (let i = 0; i < arrayFromCollection.length; i++) {
        arrayOfQuestionIds.push(parseInt(arrayFromCollection[i].name));
    }
    // Return the array of question IDs. This array will then be passed into another function
    return arrayOfQuestionIds;
}

function checkRadios(_question) {
    // Create NodeList of the five radio boxes for the question selected
    let radios = document.getElementsByName(_question);
    console.log(radios);

    // Declare checked variable to monitor if user has selected any of the radio buttons for this question
    // QuesMig - is it good practice to assign this variable a value or could you declare it without assigning it a value (let checked;)
    let checked = false;

    for(let i = 0; i < radios.length; i++) 
    {
        // Iterate through the NodeList of five variable buttons
        if (radios[i].checked) 
        {
            // Change value of checked varible to true if one of the radio boxes is ticked
            checked = true;
            break;
        }
    }

    // Return a value (true or false) to signify whether the user has selected any of the radios for this question
    return checked;

};

function checkDropdowns(_quesId) {
    // Declare variable which grabs the element which has the question ID
    let question = document.getElementById(_quesId);
    // Declare boolean variable to check if questions have been marked by the user. 
    let checked = false;
    
    // Declare variable which stores the text of the current selected index of the ques
    if (question.classList.contains("dropdn")) 
    { 
        // Declare variable which stores which of the dropdown options is currently selected by the user
        let selectedIndex = question.options[question.selectedIndex].text;
        // If the selected index is not equal to "-- select an option, the user shouldn't be able to progress"
        if (selectedIndex !== "-- select an option --")
        {
            checked = true;
        }
    }

    // Run check to see if yes-no questions have been completed
    if (question.classList.contains("yesno")) 
    {
        // Write the code to test if the yes-no has been selected
        console.log(question);
        // yesNoHtmlCollection is an html collection
        let yesNoHtmlCollection = question.getElementsByTagName("label");
        var yesNoArray = Array.from(yesNoHtmlCollection);

        // Check if either the yes or no button has been selected by the user
        if (yesNoArray[0].classList.contains("active") || yesNoArray[1].classList.contains("active"))
        {
            checked = true;
        }
    }

    // Run check to see if text boxes have been filled
    if (question.classList.contains("text-area-for-vali")) 
    {
        // Declare variable which stores the text that the user has input in the text area
        let value = question.value;

        // If the value is not equal to nothing, then the question can be marked true
        if (value != "");
        {
            checked = true;
        }
    }

    // The function will return false if any of the questions have not been checked
    return checked;
}

function checkDropQuestions(_arrayOfDrops) {

    let questionIsValid = true;

    for(let i = 0; i < _arrayOfDrops.length; i++) {

        // If !Checkdropdowns returns false, at least one of the questions has not been checked. We can break the loop and turn questionIsValid to false. This will then trigger the warning Message
        if (!checkDropdowns(_arrayOfDrops[i])) {            
            questionIsValid = false;
            break;
        }
    }

    // The other code is: '<div class="row"><div class="col-md-12 text-center"><div id="validation-alert">Please make sure you answer all questions before continuing</div></div></div>'
    if (!questionIsValid) {
        let warningMessage = '<div class="row"><div class="col-md-12 text-center"><div class="alert alert-danger" role="alert">Please make sure you answer all questions before continuing</div></div></div>'; 
        let pageNumberExists = document.getElementById('page-number');
            if (pageNumberExists) {                    
            document.getElementById('page-number').style.display = "none";
            }
        document.getElementById('warning-message').innerHTML = warningMessage;
        
    } else {
        // All questions have a radio box selected, so user can progress
        console.log('success!');

        // Temp commenting this out
        nextPage(window.location.pathname);
    }

}

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
    // The other code is: '<div class="row"><div class="col-md-12 text-center"><div id="validation-alert">Please make sure you answer all questions before continuing</div></div></div>'
    if (!questionIsValid) {
        let warningMessage = '<div class="row"><div class="col-md-12 text-center"><div class="alert alert-danger" role="alert">Please make sure you answer all questions before continuing</div></div></div>'; 
        let pageNumberExists = document.getElementById('page-number');
            if (pageNumberExists) {                    
            document.getElementById('page-number').style.display = "none";
            }
        document.getElementById('warning-message').innerHTML = warningMessage;
        
    } else {
        // All questions have a radio box selected, so user can progress
        console.log('success!');

        nextPage(window.location.pathname);
    }
}



// Function which removes the form validation warning when user clicks on any radio button
function removeWarning() {
    document.getElementById('warning-message').innerHTML = '';

    let pageNumberExists = document.getElementById('page-number');
    
    if (pageNumberExists) {                    
        document.getElementById('page-number').style.display = "inherit";
    }
}

/* This is a temporary function. The actual logic will be Ajax speaking to the backend to pull the flow from the database
Remember, when you create the logic on the backend, you will want to create a list from which you can pull two arrays: Array1 = a list of the urls (in order). Array 2 = the same list but each element has been pushed by one index. Alternatively (and probably a better idea) would be to create a function like so:
(1) Next button inputs the current pathname (e.g. instructions-2) into the function getNextPage(currentPathname)
(2) getNextPage takes instructions-2 as the argument/parameter and performs a check on the pagesURL array
(3) The log in the getNextPage function is as follows: Look for x's index. Take x's index and add one. Return the element that is in x+1's position (e.g. instructions-2 is in position 7. the function will return the url that is in position 8 (in this case task-2)
(4) Return url in position x + 1. The next button then redirects the user to this new path
*/

pagesURL = [
  { pgNo: 1, url: 'individual-login' },
  { pgNo: 2, url: 'study-consent' },
  { pgNo: 3, url: 'eligibility-notice' },
  { pgNo: 4, url: 'welcome' },
  { pgNo: 5, url: 'instructions-1' },
  { pgNo: 6, url: 'task-1' },
  { pgNo: 7, url: 'task-1-pt-2' },
  { pgNo: 8, url: 'instructions-2' },
  { pgNo: 9, url: 'task-2' },
  { pgNo: 10, url: 'task-2-pt-2' },
  { pgNo: 11, url: 'task-2-pt-3' },
  { pgNo: 12, url: 'instructions-3' },
  { pgNo: 13, url: 'scenario-1' },
  { pgNo: 14, url: 'task-3' },
  { pgNo: 15, url: 'scenario-2' },
  { pgNo: 16, url: 'task-3-pt-2' },
  { pgNo: 17, url: 'scenario-3' },
  { pgNo: 18, url: 'task-3-pt-3' },
  { pgNo: 19, url: 'study-conclusion' } 
]

function nextPage(_currentPathname) {
    switch(_currentPathname){
        case "/task-1":
            window.location.pathname = '/task-1-pt-2'
            break;
        case "/task-1-pt-2":
            window.location.pathname = '/instructions-2'
            break;
        case "/task-3":
            window.location.pathname = '/scenario-2';
            break;
        case "/task-3-pt-2":
            window.location.pathname = '/scenario-3';
            break;
        case "/task-3-pt-3":
            window.location.pathname = '/study-conclusion';
            break;
        case "/task-2":
            window.location.pathname = '/task-2-pt-2';
            break;
        case "/task-2-pt-2":
            window.location.pathname = '/task-2-pt-3';
            break;
        case "/task-2-pt-3":
            window.location.pathname = '/instructions-3';
            break;
      default:
        console.log("The Pathname you have entered is not in the switch statement") 
}}


// Temporary Function which ticks all radio boxes (for speeding up testing)
// Legacy function. Delete this along with all references to it.
function completeAllRadios() {
    // Returns an HTML collection of the first radio boxes for each question (note: this is because the classname first-radio-box is only present on the first radio box of each question)
    let $collectionOfFirstRadios = document.getElementsByClassName("first-radio-box");

    for (i = 0; i < $collectionOfFirstRadios.length; i ++) {
        $collectionOfFirstRadios[i].checked = true;
    }
}

// I think this is a legacy function. Double check though
function _removeClasses() {
    for (var i = 0; i < els.length; i++) {
      els[i].classList.remove('active')
    }
  }

// Legacy function. Delete this along with all references to it.
function toggleNavbar() {
    let $nav = document.getElementById('navbar-bw');

    if($nav.classList.contains('hidden-navbar')) {
        $nav.classList.remove('hidden-navbar');
    } else {
        $nav.classList.add('hidden-navbar');
    }
}