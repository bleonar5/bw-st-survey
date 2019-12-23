module.exports = 

function convertDropdownQues(_ques) {

    // Create variable (which will be a string) and assign the options (separated by semi colons) to that variable.
    let optionsString = _ques.options;
    // Create an object of arrays by splitting the string using the semi colon as the separator
    let result = optionsString.split(';').map(e => e.split(';'));
    // Declare new array which will hold the list of options for the dropdown
    let newArray = [];
  
    // Create a loop which goes through each array and converts it to a string and then pushes the new string to the new array
    for (let i = 0; i < result.length; i++) {
        // Within loop, remove square brackets and quotation marks and leading spaces (trim)
        // Note (todo), this should be more concise
        let jsonstringify = JSON.stringify(result[i]);
        let withoutOpeningBrackets = jsonstringify.replace("[","");
        let withoutBothBrackets = withoutOpeningBrackets.replace("]", "");
        let withoutOpeningQuotes = withoutBothBrackets.replace("\"", "");
        let withoutBothQuotes = withoutOpeningQuotes.replace("\"", "");
        let trimmedString = withoutBothQuotes.trim();
        newArray.push(trimmedString); 
    }
  
    // Create new, formatted, dropdown question
    // Note (todo), this should use ES6 destructuring (?) syntax
    let dropdownQuestion = {
        "id": _ques.id,
        "section": 54,
        "page": _ques.page,
        "text": _ques.text,
        "category": _ques.category,
        "dropdown": _ques.dropdown,
        "options": newArray
    }
  
    return dropdownQuestion;
  
  }