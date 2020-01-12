module.exports = 

function convertDropdownQues(_ques) {

    // Create variable (which will be a string) and assign the options (separated by semi colons) to that variable.
    let optionsString = _ques.options;
    // If the optionsString contains a semi-colon, then it needs to be converted to an array
    // console.log(optionsString);
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

        let object = { 
            option: trimmedString,
            selected: false
        }
        
        newArray.push(object); 
    }

    // Add a new property
    _ques.options = newArray;
    _ques.editedByUser = false;

    // Return an object
    return _ques;

    
  }




