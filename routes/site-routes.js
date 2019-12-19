/* --- HELPER FUNCTIONS (only temporarily in site-routes --- */
/* --- TODO: Ask Miguel what the best practice is for storing these functions? i.e. what folder do they belong in? --- */
/* -- HELPER FUNCTION FOR CONVERTING DROPDOWN QUESTIONS -- */
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
      "section": _ques.section,
      "page": _ques.page,
      "text": _ques.text,
      "category": _ques.category,
      "dropdown": _ques.dropdown,
      "options": newArray
  }

  return dropdownQuestion;

}

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

/* -- FUNCTION FOR EXTRACTING URLs AND PAGE NUMBERS -- */
/* -
This works but pagination will be undefined if the element in the array is not present
This function will break if you put page 1 in as an argument
- */

function extractUrlAndPage(_page, _urlsArray) {
    
  let urlInfo = 
      {
          currentPage: _urlsArray[_page - 1].url,
          previousPage: _urlsArray[_page - 2].url,
          nextPage: _urlsArray[_page].url,
          pagination: _urlsArray[_page - 1].pagination,
          backbutton: _urlsArray[_page - 1].backbutton
      }

  return urlInfo;
}

/** --- SITE-ROUTES START HERE --- **/

const allUrls = require('../bin/urls');
console.log(`I'm the backend`);

const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.render('index');
});

router.get("/new-layout", (req, res, next) => {
  res.render('0-new-layout');
});

/* --- TEST ROUTE FOR VALIDATION --- */
router.get('/validation-example', (req, res) => {
  res.render('validation-example');
});

// Create post route
// Todo: Check that you can delete this route. It should only be temporary
router.post("/validation-example", (req, res, next) => {

  res.render('1a-informed-consent');
});

// Declare variable which hold all data from Google Sheets Import
const allQuestions = require('../bin/sheets-import');

/* --- INTRO ROUTES --- */
// individual-login is on routes/auth.js
router.get('/study-consent', (req, res) => {
  const allQuestions = require('../bin/sheets-import');
  const stdConsent = allQuestions.filter(data => data.page === 2);
  res.render('1a-informed-consent', { stdConsent });
});

// Post route is required as the user arrives at this page after logging in
router.post("/study-consent", (req, res, next) => {
  const allQuestions = require('../bin/sheets-import');
  const stdConsent = allQuestions.filter(data => data.page === 2);
  res.render('1a-informed-consent', { stdConsent });
});

router.get('/no-study-consent', (req, res) => {
  res.render('1b-no-study-consent');
});

router.get('/eligibility-notice', (req, res) => {
  const allQuestions = require('../bin/sheets-import');
  const eligpg3 = allQuestions.filter(data => data.page === 3);
  res.render('1c-eligibility-notice', { eligpg3 });
});

router.get('/welcome', (req, res) => {
  const allQuestions = require('../bin/sheets-import');
  const welcomepg4 = allQuestions.filter(data => data.page === 4);
  res.render('2a-welcome', { welcomepg4 });
});

/* --- TASK ONE ROUTES --- */
router.get('/instructions-1', (req, res) => { 
  instructions = allQuestions.filter(data => data.page === 5);
  const urlsAndPages = extractUrlAndPage(5, allUrls);
  res.render('3a-instructions-1', { instructions, urlsAndPages });
});


router.get('/task-1', (req, res) => {
  const allQuestions = require('../bin/sheets-import');
  const perguntas = allQuestions.filter(data => data.page === 6);
  const urlsAndPages = extractUrlAndPage(6, allUrls);
  res.render('3b-task-1', { perguntas, urlsAndPages });
});

router.get('/task-1-pt-2', (req, res) => {
  const allQuestions = require('../bin/sheets-import');
  const perguntas = allQuestions.filter( data => data.page === 7);
  const urlsAndPages = extractUrlAndPage(7, allUrls);
  res.render('3b-task-1', { perguntas, urlsAndPages });
  console.log(urlsAndPages);
});

/* --- TASK TWO ROUTES --- */
router.get('/instructions-2', (req, res) => {
  instructions = allQuestions.filter(data => data.page === 8);
  const urlsAndPages = extractUrlAndPage(8, allUrls);
  res.render('3a-instructions-1', { instructions, urlsAndPages });
});

router.get('/task-2', (req, res) => {
  const allQuestions = require('../bin/sheets-import');
  const perguntasUnconverted = allQuestions.filter( data => data.page === 9);
  const perguntas = formatQuestions(perguntasUnconverted);
  const urlsAndPages = extractUrlAndPage(9, allUrls);
  res.render('4b-task-2', { perguntas, urlsAndPages });
});

router.get('/task-2-pt-2', (req, res) => {
  const allQuestions = require('../bin/sheets-import');
  const perguntasUnconverted = allQuestions.filter( data => data.page === 10);
  const perguntas = formatQuestions(perguntasUnconverted);
  const urlsAndPages = extractUrlAndPage(10, allUrls);
  res.render('4b-task-2', { perguntas, urlsAndPages });
});

router.get('/task-2-pt-3', (req, res) => {
  const allQuestions = require('../bin/sheets-import');
  const perguntasUnconverted = allQuestions.filter( data => data.page === 11);
  const perguntas = formatQuestions(perguntasUnconverted);
  const urlsAndPages = extractUrlAndPage(11, allUrls);
  res.render('4b-task-2', { perguntas, urlsAndPages });
});

/* --- TASK THREE ROUTES --- */
router.get('/instructions-3', (req, res) => {
  instructions = allQuestions.filter(data => data.page === 12);
  const urlsAndPages = extractUrlAndPage(12, allUrls);
  res.render('3a-instructions-1', { instructions, urlsAndPages });
});

router.get('/task-3', (req, res) => {
  const allQuestions = require('../bin/sheets-import');
  const perguntas = allQuestions.filter( data => data.page === 14);
  const urlsAndPages = extractUrlAndPage(14, allUrls);
  res.render('5c-task-3', { perguntas, urlsAndPages });
});

router.get('/task-3-pt-2', (req, res) => {
  const allQuestions = require('../bin/sheets-import');
  const perguntas = allQuestions.filter( data => data.page === 16);
  const urlsAndPages = extractUrlAndPage(16, allUrls);
  res.render('5c-task-3', { perguntas, urlsAndPages });

});

router.get('/task-3-pt-3', (req, res) => {
  const allQuestions = require('../bin/sheets-import');
  const perguntas = allQuestions.filter( data => data.page === 18);
  const urlsAndPages = extractUrlAndPage(18, allUrls);
  res.render('5c-task-3', { perguntas, urlsAndPages });
});

router.get('/scenario-1', (req, res) => {
  const allQuestions = require('../bin/sheets-import');
  const sheetsSituations = allQuestions.filter( data => data.page === 13);
  const urlsAndPages = extractUrlAndPage(13, allUrls);
  res.render('5b-scenario-1', { sheetsSituations, urlsAndPages });
});

router.get('/scenario-2', (req, res) => {
  const allQuestions = require('../bin/sheets-import');
  const sheetsSituations = allQuestions.filter( data => data.page === 15);
  const urlsAndPages = extractUrlAndPage(15, allUrls);
  res.render('5b-scenario-1', { sheetsSituations, urlsAndPages });
});

router.get('/scenario-3', (req, res) => {
  const allQuestions = require('../bin/sheets-import');
  const sheetsSituations = allQuestions.filter( data => data.page === 17);
  const urlsAndPages = extractUrlAndPage(17, allUrls);
  res.render('5b-scenario-1', { sheetsSituations, urlsAndPages });
});

router.get('/study-conclusion', (req, res) => {
  res.render('6a-study-conclusion');
});

module.exports = router;