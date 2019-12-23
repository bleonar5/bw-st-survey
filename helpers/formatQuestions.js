const convertDropdownQues = require('../helpers/convertDropdownQues.js');

module.exports =

function formatQuestions(_array) {

    let newArray = [];
  
    for (i = 0; i < _array.length; i++) {
  
        if (_array[i].category === 'dropdown') {
            // convert & add conversion to newArray
            let convertedDropdown = convertDropdownQues(_array[i]);
            newArray.push(convertedDropdown);
        } else {
            newArray.push(_array[i]);
        }
  
    }
  
    return newArray;
  }
  