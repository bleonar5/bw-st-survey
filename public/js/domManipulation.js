// let urls = require('../bin/urls.js');
// I'm temporarily pasting the arry in here because I can't find a way of using imports and exports with client side JS

// Declare variables to track user
let employed = true;
let timeTaken = 0;

const urls = 
[
    {
        "pageold": 1,
        "page": 1,
        "urlold": "individual-login",
        "url": "/individual-login",
        "hbsview": "1-individual-login",
        "previouspage": "na",
        "nextpage": "/study-consent"
    },
    {
        "pageold": 2,
        "page": 2,
        "urlold": "study-consent",
        "url": "/study-consent",
        "previouspage": "/individual-login",
        "nextpage": "/eligibility-notice"
    },
    {
        "pageold": 3,
        "page": 3,
        "urlold": "eligibility-notice",
        "url": "/eligibility-notice",
        "previouspage": "/study-consent",
        "nextpage": "/welcome"
    },
    {
        "pageold": 4,
        "page": 4,
        "urlold": "welcome",
        "url": "/welcome",
        "previouspage": "/eligibility-notice",
        "nextpage": "/instructions-1"
    },
    {
        "pageold": 5,
        "page": 5,
        "urlold": "instructions-1",
        "url": "/instructions-1",
        "previouspage": "/welcome",
        "nextpage": "/task-1-part-1"
    },
    {
        "pageold": 6,
        "page": 6,
        "urlold": "task-1",
        "url": "/task-1-part-1",
        "pagination": "Page 1 of 2",
        "previouspage": "/instructions-1",
        "nextpage": "/task-1-part-2"
    },
    {
        "pageold": 7,
        "page": 7,
        "urlold": "task-1-pt-2",
        "url": "/task-1-part-2",
        "pagination": "Page 2 of 2",
        "backbutton": true,
        "previouspage": "/task-1-part-1",
        "nextpage": "/instructions-2"
    },
    {
        "pageold": 8,
        "page": 8,
        "urlold": "instructions-2",
        "url": "/instructions-2",
        "previouspage": "/task-1-part-2",
        "nextpage": "/task-2-part-1"
    },
    {
        "pageold": 9,
        "page": 9,
        "urlold": "task-2",
        "url": "/task-2-part-1",
        "pagination": "Page 1 of 4",
        "previouspage": "/instructions-2",
        "nextpage": "/task-2-part-2"
    },
    {
        "pageold": 20,
        "page": 10,
        "urlold": "task22",
        "url": "/task-2-part-2",
        "pagination": "Page 2 of 4",
        "previouspage": "/task-2-part-1",
        "nextpage": "/task-2-part-3",
        "comment": "added on 22-dec"
    },
    {
        "pageold": 10,
        "page": 11,
        "urlold": "task-2-pt-2",
        "url": "/task-2-part-3",
        "pagination": "Page 3 of 4",
        "previouspage": "/task-2-part-2",
        "nextpage": "/task-2-part-4"
    },
    {
        "pageold": 11,
        "page": 12,
        "urlold": "task-2-pt-3",
        "url": "/task-2-part-4",
        "pagination": "Page 4 of 4",
        "previouspage": "/task-2-part-3",
        "nextpage": "/instructions-3"
    },
    {
        "pageold": 12,
        "page": 13,
        "urlold": "instructions-3",
        "url": "/instructions-3",
        "previouspage": "/task-2-part-4",
        "nextpage": "/scenario-1"
    },
    {
        "pageold": 13,
        "page": 14,
        "urlold": "scenario-1",
        "url": "/scenario-1",
        "previouspage": "/instructions-3",
        "nextpage": "/task-3-part-1"
    },
    {
        "pageold": 14,
        "page": 15,
        "urlold": "task-3",
        "url": "/task-3-part-1",
        "backbutton": true,
        "previouspage": "/scenario-1",
        "nextpage": "/scenario-2"
    },
    {
        "pageold": 15,
        "page": 16,
        "urlold": "scenario-2",
        "url": "/scenario-2",
        "previouspage": "/task-3-part-1",
        "nextpage": "/task-3-part-2"
    },
    {
        "pageold": 16,
        "page": 17,
        "urlold": "task-3-pt-2",
        "url": "/task-3-part-2",
        "backbutton": true,
        "previouspage": "/scenario-2",
        "nextpage": "/scenario-3"
    },
    {
        "pageold": 17,
        "page": 18,
        "urlold": "scenario-3",
        "url": "/scenario-3",
        "previouspage": "/task-3-part-2",
        "nextpage": "/task-3-part-3"
    },
    {
        "pageold": 18,
        "page": 19,
        "urlold": "task-3-pt-3",
        "url": "/task-3-part-3",
        "backbutton": true,
        "previouspage": "/scenario-3",
        "nextpage": "/study-conclusion"
    },
    {
        "pageold": 19,
        "page": 20,
        "urlold": "study-conclusion",
        "url": "/study-conclusion",
        "previouspage": "/task-3-part-3",
        "nextpage": "/holding-page"
    },
    {
        "pageold": 21,
        "page": 21,
        "urlold": "holding-page",
        "url": "/holding-page",
        "previouspage": "/study-conclusion",
        "nextpage": "na"
    }
]



const width  = window.innerWidth;
const height = window.innerHeight;
console.log(`Hello, Dom. I'm the front end`);
console.log(`width: ${width}, height ${height}`);


// This is a temporary array. It should be stored somewhere else and kept in middleware instead
const dependenciesArray =

[
    {
        "id": 201,
        "trigger": "no",
        "action": "disable",
        "dependencies": "202; 203"
    },
    {
        "id": 202,
        "trigger": "no",
        "action": "disable",
        "dependencies": "203; 204"
    }
]

// Function which returns the dependencies of a question
function checkDependencies(_id, _dependenciesArray) {
    for (let i = 0; i < _dependenciesArray.length; i++) {
        if (_dependenciesArray[i].id === _id) {
            return dependenciesArray[i].dependencies;
        } else {
            return false;
        }
    }
}

// Function which returns the word required to trigger the dependencies
function getTrigger(_id, _dependenciesArray) {
    for (let i = 0; i < _dependenciesArray.length; i++) {
        if (_dependenciesArray[i].id === _id) {
            return dependenciesArray[i].trigger;
        }
    }
}

function convertSemiColonsToArray(_ques) {
    // If string contains a semi colon
    let optionsString = _ques;
    console.log(optionsString);
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



    console.log(dependenciesArray);
    let dependencies = checkDependencies(_id, dependenciesArray);
    console.log(dependencies);
    
    // Todo: resolve error (domManipulation.js:54 Uncaught TypeError: Cannot read property 'split' of undefined) by breaking statement if there are no dependencides
    let valueSelected = document.getElementById(_id).value;
    let triggerWord = getTrigger(_id, dependenciesArray);
    if (dependencies !== false) {
        let arrayOfDependencies = convertSemiColonsToArray(dependencies);
    

    if (dependencies === undefined) {
        console.log('no dependencies');
        return false;
    } if (triggerWord !== valueSelected) { 
        console.log ('has depedencies but wrong word selected');
        for (i = 0; i < arrayOfDependencies.length; i++) {
            // Convert string to number with parseInt
            document.getElementById(parseInt(arrayOfDependencies[i])).disabled = false;
        }
    } else {
        // Convert the database input from a string with semicolons to an array so that we can loop through the new array and disable the questions
        for (i = 0; i < arrayOfDependencies.length; i++) {
            // Convert string to number with parseInt
            document.getElementById(parseInt(arrayOfDependencies[i])).disabled = true;
        }
    }}
}

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

function nextPage(_currentPathname) {

    console.log(_currentPathname);
    console.log(urls);
    for (i = 0; i < urls.length; i++) {
        if (urls[i].url === _currentPathname) {
            console.log(`below is the current url`);
            console.log(urls[i].url);
            console.log('below is the nextpage');
            console.log(urls[i].nextpage);
            console.log(`below is info about this url`);
            console.log(urls[i]);
            window.location.pathname = urls[i].nextpage;
            break;
        }
    }

}


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