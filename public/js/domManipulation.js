// Temporary Function which ticks all radio boxes (for speeding up testing)
function completeAllRadios() {
        // Returns an HTML collection of the first radio boxes for each question (note: this is because the classname first-radio-box is only present on the first radio box of each question)
        let $collectionOfFirstRadios = document.getElementsByClassName("first-radio-box");

        for (i = 0; i < $collectionOfFirstRadios.length; i ++) {
            $collectionOfFirstRadios[i].checked = true;
        }
}

// Function which removes classname container from the overarching div
function removeContainer() {
    let $mainContainer = document.getElementById('main-container');
    if ($mainContainer.classList.contains("container") === true) {
    $mainContainer.classList.remove("container");
    $mainContainer.classList.add("container-fluid");
    $mainContainer.classList.add("maxWidth");
    } else {
        $mainContainer.classList.remove("container-fluid");
        $mainContainer.classList.remove("maxWidth");
        $mainContainer.classList.add("container");
    }
}

function toggleTextSizeOld() {
    let $questionsText = document.getElementsByClassName('question-text');
    if ($questionsText.classList.contains("smaller-text") === true ) {
        $questionsText.classList.remove("smaller-text");
    } else {
        $questionsText.classList.add("smaller-text");
    }
}

function toggleTextSize() {
    let $questionsText = document.getElementsByClassName('question-text');

    if ($questionsText[0].classList.contains('smaller-text') === true) {
    for (let i = 0; i < $questionsText.length; i++) {
        $questionsText[i].classList.remove('smaller-text');
        console.log('removed');
    }
    } else {
    for (let i = 0; i < $questionsText.length; i++) {
        $questionsText[i].classList.add('smaller-text');
        console.log('added');
    }}
}

function _removeClasses() {
    for (var i = 0; i < els.length; i++) {
      els[i].classList.remove('active')
    }
  }

function toggleNavbar() {
    let $nav = document.getElementById('navbar-bw');

    if($nav.classList.contains('hidden-navbar') === true) {
        $nav.classList.remove('hidden-navbar');
    } else {
        $nav.classList.add('hidden-navbar');
    }
}

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

    // Declare checked variable to monitor if user has selected any of the radio buttons for this question
    // QuesMig - is it good practice to assign this variable a value or could you declare it without assigning it a value (let checked;)
    let checked = false;

    for(let i = 0; i < radios.length; i++) {
        // Iterate through the NodeList of five variable buttons
        if (radios[i].checked) {
            // Change value of checked varible to true if one of the radio boxes is ticked
            checked = true;
            break;
        }
    }

    // Return a value (true or false) to signify whether the user has selected any of the radios for this question
    return checked;

};

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
        let warningMessage = '<div class="row"><div class="col-md-12 text-center"><div class="alert alert-danger" role="alert">Please make sure you answer all questions before continuing.</div></div></div>';                       
        document.getElementById('page-number').style.display = "none";
        document.getElementById('warning-message').innerHTML = warningMessage;
        
    } else {
        // All questions have a radio box selected, so user can progress
        console.log('success!');

        nextPage(window.location.pathname);
        // window.location = "/scenario-3";
    }
}

// Function which removes the form validation warning when user clicks on any radio button
function removeWarning() {
    document.getElementById('warning-message').innerHTML = '';
    document.getElementById('page-number').style.display = "inherit";
}

// This is a temporary function. The actual logic will be Ajax speaking to the backend to pull the flow from the database
function nextPage(_currentPathname) {
    switch(_currentPathname){
        case "/task-1":
            window.location.pathname = '/task-1-pt-2'
            break;
        case "/task-1-pt-2":
            window.location.pathname = 'instructions-2'
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
      default:
        console.log("Hello!") 
}}
