const convertDropdownQues = require('../helpers/convertDropdownQues.js');

module.exports =

function formatQuestions(_array) {

    let newArray = [];
  
    for (i = 0; i < _array.length; i++) {
  
        if (_array[i].category === 'dropdown') {
            // If it is a string, it needs converting to an array
            if (typeof _array[i].options === "string") {
                let convertedDropdown = convertDropdownQues(_array[i]);
                newArray.push(convertedDropdown);
            } else {
                newArray.push(_array[i]);
            }

        } else if (_array[i].category === 'yesno') {

            let convertedYesNo = convertYesNoQues(_array[i]);

            // Push yesNoArray into the newArray
            newArray.push(convertedYesNo);
        } else if (_array[i].category === 'textarea' && _array[i].editedByUser === null) {
            
            _array[i].editedByUser = false;
            newArray.push(_array[i]);
                 

        } else {
            newArray.push(_array[i]);
        }
  
    }
  
    return newArray;
  }
  


  function convertYesNoQues(_ques) {
    
    let yesNoArray = [];

    let objectNo = { 
        option: '0-no',
        selected: false
    }
  
    let objectYes = {
        option: '1-yes',
        selected: false
    }

    yesNoArray.push(objectNo, objectYes);

    // Add a new property
    _ques.options = yesNoArray;
    
    if (_ques.editedByUser === null){
        _ques.editedByUser = false;
    }

    return _ques;
  }

  
