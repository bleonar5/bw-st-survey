// This is a temporary array. It should be stored somewhere else and kept in middleware instead
const dependenciesArray =

[
    {
        "id": 20901,
        "text": "Are you currently employed?",
        "trigger": "no",
        "action": "disable",
        "dependencies": "20902; 20903; 20904; 21005; 21006; 21007; 21008"
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

    // console.log(dependenciesArray[1]);
    let dependencies = checkDependencies(_id, dependenciesArray);
    // console.log(`these are the dependencies of this question: ${dependencies}`);
    
    // Todo: resolve error (domManipulation.js:54 Uncaught TypeError: Cannot read property 'split' of undefined) by breaking statement if there are no dependencides
    let element = document.getElementById(_id);
    // console.log(element);

    // This is the code for yesno questions


    // This works for dropdowns
    let valueSelected = document.getElementById(_id).value;
    // console.log(`dropdown value selected: ${valueSelected}`);

    let triggerWord = getTrigger(_id, dependenciesArray);
    
    if (dependencies !== false) {
        let arrayOfDependencies = convertSemiColonsToArray(dependencies);
    

    if (dependencies === undefined) {
        console.log('no dependencies');
        return false;
    } if (triggerWord !== valueSelected) { 
        for (i = 0; i < arrayOfDependencies.length; i++) {

            let element =  document.getElementById(parseInt(arrayOfDependencies[i]));
            if (typeof(element) != 'undefined' && element != null)
            {
                // Convert string to number with parseInt
                document.getElementById(parseInt(arrayOfDependencies[i])).disabled = false;
                document.getElementById(parseInt(arrayOfDependencies[i])).classList.remove("skipped");
                document.getElementById(parseInt(arrayOfDependencies[i])).parentNode.classList.add("skipped");
            }

        }
    } else {
        // Convert the database input from a string with semicolons to an array so that we can loop through the new array and disable the questions
        for (i = 0; i < arrayOfDependencies.length; i++) {
            // Convert string to number with parseInt
            // if element exists perform action

            let element = document.getElementById(parseInt(arrayOfDependencies[i]));
                if (typeof(element) != 'undefined' && element != null)
                {
                    element.disabled = true;
                    element.classList.add("skipped");
                    element.parentNode.classList.add("skipped");
                }

            
        }
    }}
}



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