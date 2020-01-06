/* --- TODO: What is  the best practice is for storing these functions? i.e. what folder do they belong in? --- */

const express = require("express");
const router = express.Router();
const Answer = require('../models/answers');
const app = express();

const getPageNumber = require('../helpers/getPageNumber.js');
const convertDropdownQues = require('../helpers/convertDropdownQues.js');
const formatQuestions = require('../helpers/formatQuestions.js');
const extractUrlAndPage = require('../helpers/extractUrlAndPage.js');
const checkQuestionsBackEnd = require('../helpers/checkQuestionsBackEnd.js');
const getArrayOfQuestions = require('../helpers/getArrayOfQuestionsBackEnd.js');
const cookieSession = require('cookie-session')

// Declare variable which hold all data from Google Sheets Import
const allQuestions = require('../bin/sheets-import');
const allUrls = require('../bin/urls');

// Cookie Session
app.use(cookieSession({
    name: 'sesh',
    // keys: [/* secret keys */],
    keys: ['key1', 'key2'],
  
    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

/** --- SITE-ROUTES START HERE --- **/
router.get("/", (req, res, next) => {
  res.render('index');
});


/* --- INTRO ROUTES --- */
// individual-login is on routes/auth.js
router.get('/study-consent', (req, res) => {
  const allQuestions = require('../bin/sheets-import');
  const stdConsent = allQuestions.filter(data => data.page === getPageNumber('/study-consent', allUrls));;
  res.render('1a-informed-consent', { stdConsent });
});

// Post route is required as the user arrives at this page after logging in
router.post("/study-consent", (req, res, next) => {
  const allQuestions = require('../bin/sheets-import');
  const stdConsent = allQuestions.filter(data => data.page === getPageNumber('/study-consent', allUrls));
  res.render('1a-informed-consent', { stdConsent });
});

router.get('/no-study-consent', (req, res) => {
  res.render('1b-no-study-consent');
});

router.get('/eligibility-notice', (req, res) => {
  const allQuestions = require('../bin/sheets-import');
  const eligpg3 = allQuestions.filter(data => data.page === getPageNumber('/eligibility-notice', allUrls));
  res.render('1c-eligibility-notice', { eligpg3 });
});

router.get('/welcome', (req, res) => {
  const allQuestions = require('../bin/sheets-import');
  const welcomepg4 = allQuestions.filter(data => data.page === getPageNumber('/welcome', allUrls));
  res.render('2a-welcome', { welcomepg4 });
});

/* --- INSTRUCTIONS ROUTES --- */
router.get('/instructions-1', (req, res) => { 
    currentPage = getPageNumber(req.originalUrl, allUrls);
    const instructions = allQuestions.filter(data => data.page === currentPage);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    res.render('3a-instructions', { instructions, urlsAndPages });
});

router.get('/instructions-2', (req, res) => {
    currentPage = getPageNumber(req.originalUrl, allUrls);
    const instructions = allQuestions.filter(data => data.page === currentPage);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    res.render('3a-instructions', { instructions, urlsAndPages });
});

router.get('/instructions-3', (req, res) => {
    currentPage = getPageNumber(req.originalUrl, allUrls);
    const instructions = allQuestions.filter(data => data.page === currentPage);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    res.render('3a-instructions', { instructions, urlsAndPages });
  });


/* --- TASK ONE ROUTES --- */
router.get('/task-1-part-1', (req, res) => {

    req.session.views = (req.session.views || 0) + 1

    // Write response
    console.log(`user has had ${req.session.views} views`);
    console.log(req.session);
    console.log(req.cookies);

    currentPage = getPageNumber(req.originalUrl, allUrls);
    const perguntas = allQuestions.filter(data => data.page === currentPage);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    res.render('3b-task-1', { perguntas, urlsAndPages });
});


// Temporarily commenting out the POST part
router.post('/task-1-part-1', (req, res) => {

    const reqBody = req.body;
    const createdAt = req._startTime;
    const answersObject = JSON.stringify(reqBody);
    const userId = req.cookies.session;
    const length = Object.keys(req.body).length;
    const newQuestionSubmittedByUser = new Answer ( { userId, answersObject, createdAt} )

    if (length === 8) {
        newQuestionSubmittedByUser.save()
        .then( () => {
            console.log('Answer saved to database:');
            console.log(newQuestionSubmittedByUser);    
            res.redirect('/task-1-part-2');
        })
        .catch((error) => {
            console.log(error);
        })
    }
});

router.get('/task-1-part-2', (req, res) => {
    currentPage = getPageNumber(req.originalUrl, allUrls);
    const perguntas = allQuestions.filter(data => data.page === currentPage);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    res.render('3b-task-1', { perguntas, urlsAndPages });
});

router.post('/task-1-part-2', (req, res) => {

    const reqBody = req.body;
    const createdAt = req._startTime;
    const answersObject = JSON.stringify(reqBody);
    const userId = req.cookies.session;
    const length = Object.keys(req.body).length;
    const newQuestionSubmittedByUser = new Answer ( { userId, answersObject, createdAt} )

    if (length === 7) {
        newQuestionSubmittedByUser.save()
        .then( () => {
            console.log('Answer saved to database:');
            console.log(newQuestionSubmittedByUser);    
            res.redirect('/instructions-2');
        })
        .catch((error) => {
            console.log(error);
        })
    }
});

/* --- TASK TWO ROUTES --- */
router.get('/task-2-part-1a', (req, res) => {

    req.session.views = (req.session.views || 0) + 1

    // Write response
    console.log(`user has had ${req.session.views} views`);
    console.log(req.session);
    console.log(req.cookies);

    currentPage = getPageNumber(req.originalUrl, allUrls);
    const perguntasUnconverted = allQuestions.filter( data => data.page === currentPage );
    const perguntas = formatQuestions(perguntasUnconverted);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    res.render('4c-task-2', { perguntas, urlsAndPages });
});

router.post('/task-2-part-1a', (req, res) => {

    const reqBody = req.body;
    const createdAt = req._startTime;
    const answersObject = JSON.stringify(reqBody);
    const userId = req.cookies.session;
    const length = Object.keys(req.body).length;
    const newQuestionSubmittedByUser = new Answer ( { userId, answersObject, createdAt} )
    const values = Object.values(req.body);
    const valuesAsString = values.toString();
    console.log(length);

    if (length === 4 || valuesAsString === 'I am a full time student' ) {
        newQuestionSubmittedByUser.save()
        .then( () => {
            console.log('Answer saved to database:');
            console.log(newQuestionSubmittedByUser);
            if (length === 4) {
                res.redirect('/task-2-part-1b');
            // Skip the next question if the length is not equal to 4
            } else {
                res.redirect('/task-2-part-2');
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }
    
});

router.get('/task-2-part-1b', (req, res) => {
    currentPage = getPageNumber(req.originalUrl, allUrls);
    const perguntasUnconverted = allQuestions.filter( data => data.page === currentPage );
    const perguntas = formatQuestions(perguntasUnconverted);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    res.render('4c-task-2', { perguntas, urlsAndPages });
});

router.post('/task-2-part-1b', (req, res) => {

    const reqBody = req.body;
    const createdAt = req._startTime;
    const answersObject = JSON.stringify(reqBody);
    const userId = req.cookies.session;
    const length = Object.keys(req.body).length;
    const newQuestionSubmittedByUser = new Answer ( { userId, answersObject, createdAt} )

    if (length === 4) {
        newQuestionSubmittedByUser.save()
        .then( () => {
            console.log('Answer saved to database:');
            console.log(newQuestionSubmittedByUser);    
            res.redirect('/task-2-part-2');
        })
        .catch((error) => {
            console.log(error);
        })
    }

});

router.get('/task-2-part-2', (req, res) => {
    currentPage = getPageNumber(req.originalUrl, allUrls);
    const perguntasUnconverted = allQuestions.filter( data => data.page === currentPage );
    const perguntas = formatQuestions(perguntasUnconverted);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    res.render('4c-task-2', { perguntas, urlsAndPages });
});

router.post('/task-2-part-2', (req, res) => {

    const reqBody = req.body;
    const createdAt = req._startTime;
    const answersObject = JSON.stringify(reqBody);
    const userId = req.cookies.session;
    const length = Object.keys(req.body).length;
    const newQuestionSubmittedByUser = new Answer ( { userId, answersObject, createdAt} )

    if (length === 5) {
        newQuestionSubmittedByUser.save()
        .then( () => {
            console.log('Answer saved to database:');
            console.log(newQuestionSubmittedByUser);    
            res.redirect('/task-2-part-3');
        })
        .catch((error) => {
            console.log(error);
        })
    }

});

router.get('/task-2-part-3', (req, res) => {
    currentPage = getPageNumber(req.originalUrl, allUrls);
    const perguntasUnconverted = allQuestions.filter( data => data.page === currentPage );
    const perguntas = formatQuestions(perguntasUnconverted);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    res.render('4c-task-2', { perguntas, urlsAndPages });
});

router.post('/task-2-part-3', (req, res) => {

    const reqBody = req.body;
    const createdAt = req._startTime;
    const answersObject = JSON.stringify(reqBody);
    const userId = req.cookies.session;
    const length = Object.keys(req.body).length;
    const newQuestionSubmittedByUser = new Answer ( { userId, answersObject, createdAt} )
    const values = Object.values(req.body);
    const valuesAsString = values.toString();
    console.log(valuesAsString);
    console.log(length);

    // Temporary Fix. You should add more logic to prevent user from 
    if (length > 2 || valuesAsString === '0-no,0-no') /* contains two nos*/  /* contains 1 no and 2 commas */ {
        newQuestionSubmittedByUser.save()
        .then( () => {
            console.log('Answer saved to database:');
            console.log(newQuestionSubmittedByUser);    
            res.redirect('/scenario-1');
        })
        .catch((error) => {
            console.log(error);
        })
    }
});


/* --- TASK THREE ROUTES --- */
router.get('/task-3-part-1', (req, res) => {
    
    currentPage = getPageNumber(req.originalUrl, allUrls);
    const perguntas = allQuestions.filter(data => data.page === currentPage);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    res.render('5c-task-3', { perguntas, urlsAndPages });
});


router.post('/task-3-part-1', (req, res) => {
    const reqBody = req.body;
    const createdAt = req._startTime;
    const answersObject = JSON.stringify(reqBody);
    const userId = req.cookies.session;
    const length = Object.keys(req.body).length;
    const newQuestionSubmittedByUser = new Answer ( { userId, answersObject, createdAt} )

    if (length === 10) {
        newQuestionSubmittedByUser.save()
        .then( () => {
            console.log('Answer saved to database:');
            console.log(newQuestionSubmittedByUser);    
            res.redirect('/scenario-2');
        })
        .catch((error) => {
            console.log(error);
        })
    }
});

router.get('/task-3-part-2', (req, res) => {
    currentPage = getPageNumber(req.originalUrl, allUrls);
    const perguntas = allQuestions.filter(data => data.page === currentPage);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    res.render('5c-task-3', { perguntas, urlsAndPages });
});

router.post('/task-3-part-2', (req, res) => {

    const reqBody = req.body;
    const createdAt = req._startTime;
    const answersObject = JSON.stringify(reqBody);
    const userId = req.cookies.session;
    const length = Object.keys(req.body).length;
    const newQuestionSubmittedByUser = new Answer ( { userId, answersObject, createdAt} )

    if (length === 10) {
        newQuestionSubmittedByUser.save()
        .then( () => {
            console.log('Answer saved to database:');
            console.log(newQuestionSubmittedByUser);    
            res.redirect('/scenario-3');
        })
        .catch((error) => {
            console.log(error);
        })
    }
});

router.get('/task-3-part-3', (req, res) => {
    currentPage = getPageNumber(req.originalUrl, allUrls);
    const perguntas = allQuestions.filter(data => data.page === currentPage);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    res.render('5c-task-3', { perguntas, urlsAndPages });
});

router.post('/task-3-part-3', (req, res) => {

    const reqBody = req.body;
    const createdAt = req._startTime;
    const answersObject = JSON.stringify(reqBody);
    const userId = req.cookies.session;
    const length = Object.keys(req.body).length;
    const newQuestionSubmittedByUser = new Answer ( { userId, answersObject, createdAt} )

    if (length === 10) {
        newQuestionSubmittedByUser.save()
        .then( () => {
            console.log('Answer saved to database:');
            console.log(newQuestionSubmittedByUser);    
            res.redirect('/study-conclusion');
        })
        .catch((error) => {
            console.log(error);
        })
    }
});

router.get('/scenario-1', (req, res) => {
    currentPage = getPageNumber(req.originalUrl, allUrls);
    const sheetsSituations = allQuestions.filter( data => data.page === currentPage);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    res.render('5b-scenarios', { sheetsSituations, urlsAndPages });
});

router.get('/scenario-2', (req, res) => {
    currentPage = getPageNumber(req.originalUrl, allUrls);
    const sheetsSituations = allQuestions.filter( data => data.page === currentPage);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    res.render('5b-scenarios', { sheetsSituations, urlsAndPages });
});

router.get('/scenario-3', (req, res) => {
    currentPage = getPageNumber(req.originalUrl, allUrls);
    const sheetsSituations = allQuestions.filter( data => data.page === currentPage);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    res.render('5b-scenarios', { sheetsSituations, urlsAndPages });
});

router.get('/study-conclusion', (req, res) => {
  res.render('6a-study-conclusion');
});

module.exports = router;