
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

                // Todo: Tidy this up. Make it into an object
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
















/*
[ 
    { option: 'Manufacturing', selected: false },
    { option: 'Wholesale trade', selected: false },
    { option: 'Retail trade', selected: false },
    { option: 'Other (agriculture, construction, service, government etc)', selected: false } 
],
  */


/*

Write a loop to look through the original array of questions
for each question, you want to check if the id is incluced in the edited questions
if it is, you want to add the answer to the object
if it is not included in the edited question, you want to return the object to the new array
*/

/*
Write a loop to look through an array of objects
new empty array
new variable of id of answer
if the property "id" is equal to the new variable of the answer
then add a new property to that object by returning the answer (positioned n + 50% down the array) 
return the new array
*/

/*
{ id: 20901,
    page: 9,
    text: 'Are you currently employed?',
    category: 'dropdown',
    dropdown: true,
    options:
     [ 'yes – full time',
       'yes – part time',
       'I am a full time student',
       'no' ] },
  { order: 8.1,
    url: '/task-2-part-1a',
    page: 9,
    id: 20902,
    text:
     'For whom do you work? (Name of company, business or employer. If you have multiple jobs, describe the one where you work the most)',
    category: 'textarea',
    textarea: true },
*/

/*
[ 20901, 20902, 20903, 20904, 20905 ]


[ 'yes – full time',
  'Filling in the text',
  'Filling in the text',
  'Retail trade',
  'Filling in the text' ]


  [ { order: 8.1,
    url: '/task-2-part-1a',
    page: 9,
    id: 20900,
    text: 'Employment (Part 1)',
    category: 'heading',
    heading: true },
  { id: 20901,
    page: 9,
    text: 'Are you currently employed?',
    category: 'dropdown',
    dropdown: true,
    options:
     [ 'yes – full time',
       'yes – part time',
       'I am a full time student',
       'no' ] },
  { order: 8.1,
    url: '/task-2-part-1a',
    page: 9,
    id: 20902,
    text:
     'For whom do you work? (Name of company, business or employer. If you have multiple jobs, describe the one where you work the most)',
    category: 'textarea',
    textarea: true },
  { order: 8.1,
    url: '/task-2-part-1a',
    page: 9,
    id: 20903,
    text:
     'What kind of business or industry do you work in? (Please describe the main activity at your workplace. For example: hospital, newspaper publishing, auto repair shop, bank. If you have multiple jobs, describe the one where you work the most)',
    category: 'textarea',
    testanswer: 'Testing Testing',
    textarea: true },
  { id: 20904,
    page: 9,
    text: 'Is your work mainly:',
    category: 'dropdown',
    dropdown: true,
    options:
     [ 'Manufacturing',
       'Wholesale trade',
       'Retail trade',
       'Other (agriculture, construction, service, government etc)' ] },
  { order: 8.1,
    url: '/task-2-part-1a',
    page: 9,
    id: 20905,
    text: 'What is your job title?',
    category: 'textarea',
    testanswer: 'Testing Text',
    textarea: true,
    comments: '[RP-08-jan: added in v9]' } ]

    */