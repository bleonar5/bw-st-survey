
module.exports = 

function addUsersExistingsAnswers(_arrayOfBlankQuestions, _arrayOfQuestionIds, _questionAnswersPartial) {

    // Declare new array of partially completed questions
    let newArrayOfPartiallyCompletedQuestions = [];

    for (i = 0; i < _arrayOfBlankQuestions.length; i++) {

        _ques = _arrayOfBlankQuestions[i];
        idOfQuestion = _arrayOfBlankQuestions[i].id;

        // If id of Question is in the array of answers already given, then return the position of the array that the thing is found
        // Now return the answer in the same position of the array

        // Look for the index position of the ID
        indexOfId = _arrayOfQuestionIds.indexOf(idOfQuestion);
        // Return the answer of the id
        answerOfId = _questionAnswersPartial[indexOfId];

        // If the index is not equal to -1 this means that the user has edited the answer
        if (indexOfId != -1) {
            _ques.userAnswer = answerOfId;
            _ques.editedByUser = true;

            // if it's a dropdown you want to do a loop through that dropdown and then return selected on the correct option
            if(_ques.dropdown) {
                for (let j = 0; j < _ques.options.length; j++) {
                    if (_ques.options[j].option === _ques.userAnswer) {
                        _ques.options[j].selected = true;
                        break;
                    } else {
                        _ques.options[j].selected = false;
                    }
                }
            }

            if(_ques.yesno) {

                _ques.options = convertYesNoQues();

                if (_ques.userAnswer === '0-no') {
                    _ques.options[0].selected = true;
                } else if (_ques.userAnswer === '1-yes') {
                    _ques.options[1].selected = true;
                }
            }

            if(_ques.radio) {

                // Todo (Low Priority): Tidy this up. Make it into an object
                if (_ques.userAnswer.includes('1')) {
                    _ques.option1Selected = true;
                    _ques.option2Selected = false;
                    _ques.option3Selected = false;
                    _ques.option4Selected = false;
                    _ques.option5Selected = false;
                } else if (_ques.userAnswer.includes('2')) {
                    _ques.option1Selected = false;
                    _ques.option2Selected = true;
                    _ques.option3Selected = false;
                    _ques.option4Selected = false;
                    _ques.option5Selected = false;
                } else if (_ques.userAnswer.includes('3')) {
                    _ques.option1Selected = false;
                    _ques.option2Selected = false;
                    _ques.option3Selected = true;
                    _ques.option4Selected = false;
                    _ques.option5Selected = false;
                } else if (_ques.userAnswer.includes('4')) {
                    _ques.option1Selected = false;
                    _ques.option2Selected = false;
                    _ques.option3Selected = false
                    _ques.option4Selected = true;
                    _ques.option5Selected = false;
                } else if (_ques.userAnswer.includes('5')) {
                    _ques.option1Selected = false;
                    _ques.option2Selected = false;
                    _ques.option3Selected = false
                    _ques.option4Selected = false;
                    _ques.option5Selected = true;
                }
            }

        } else {
            _ques.editedByUser = false;
        }

        newArrayOfPartiallyCompletedQuestions.push(_ques);

    }

    return newArrayOfPartiallyCompletedQuestions;
}



// Helper Function to convert yesno questions
function convertYesNoQues() {
    console.log('2222');

    // Create array of size 2 to hold the options for the yes-no question
    let yesNoArray = [];

    let objectNo = { 
        option: '0-no',
        selected: false
    }

    let objectYes = {
        option: '1-yes',
        selected: false
    }

    // Push two objects into the array
    yesNoArray.push(objectNo, objectYes);

    return yesNoArray;
}