/* --- TODO: What is  the best practice is for storing these functions? i.e. what folder do they belong in? --- */
/* -- TODO: Create a class */

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
const cookieSession = require('cookie-session');
const addUsersExistingsAnswers = require('../helpers/addUsersExistingsAnswers.js');

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


// Write own Middleware to prevent users who are not logged in from accessing secret pages
router.use((req, res, next) => {
    if (req.session.currentUser) { // <== if there's user in the session (user is logged in)
      next(); // ==> go to the next route ---
    } else {                          //    |
      res.redirect('/individual-login');         //    |
    }                                 //    |
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

/* --- MEZZANINE LEVEL ROUTES - ADDED on 9th January --- */
router.get('/scenario-2-intro', (req, res) => {
    currentPage = getPageNumber(req.originalUrl, allUrls);
    const instructions = allQuestions.filter(data => data.page === currentPage);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    res.render('5d-scenarios-mezzanine', { instructions, urlsAndPages });
});

router.get('/scenario-3-intro', (req, res) => {
    currentPage = getPageNumber(req.originalUrl, allUrls);
    const instructions = allQuestions.filter(data => data.page === currentPage);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    res.render('5d-scenarios-mezzanine', { instructions, urlsAndPages });
});

/* --- TASK ONE ROUTES --- */
router.get('/task-1-part-1', (req, res) => {
    let currentPage = getPageNumber(req.originalUrl, allUrls);
    let perguntas = allQuestions.filter(data => data.page === currentPage);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    const userEmail = req.session.currentUser;
    const handlebarsPage = urlsAndPages.handlebarsStaticPage;

    Answer.findOne({userEmail: userEmail, currentPage: currentPage})
    .then((answer) => {
        if (answer !== null) {
            const questionIds = JSON.parse(answer.questionsIdSaved);
            const questionAnswersPartial = JSON.parse(answer.answersSaved);
            perguntasWithUserAnswers = addUsersExistingsAnswers(perguntas, questionIds, questionAnswersPartial);
            perguntas = perguntasWithUserAnswers;
            res.render(handlebarsPage, { perguntas, urlsAndPages });
        } else {
            console.log(`no answers saved for ${userEmail} yet`);
            res.render(handlebarsPage, { perguntas, urlsAndPages });
        }
    })
    .catch((error) => {
        console.log(error);
    })
});

router.post('/task-1-part-1', (req, res) => {
    const keysConvertedToNumbers = Object.keys(req.body).map(_element => parseInt(_element, 10));
    const answersObject = JSON.stringify(req.body);
    const questionsIdSaved = JSON.stringify(Object.values(keysConvertedToNumbers)); // Convert to string, otherwise MongoDB will not store the data
    const answersSaved = JSON.stringify(Object.values(req.body));
    const createdAt = req._startTime;
    const userId = req.cookies.session;
    const userEmail = req.session.currentUser;
    const currentPage = getPageNumber(req.originalUrl, allUrls);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    const dataForThisSheet = allQuestions.filter( data => data.page === currentPage);
    const perguntas = dataForThisSheet.filter (data => !data.heading);
    const newQuestionSubmittedByUser = new Answer ( { userId, userEmail, currentPage, answersObject, questionsIdSaved, answersSaved, createdAt} );

    if (Object.keys(req.body).length === perguntas.length) {
        Answer.deleteMany({userEmail: userEmail, currentPage: currentPage})
        .then(() => {
            newQuestionSubmittedByUser.save()
            .then( (answer) => {
                // console.log(`Answer saved to database: ${answer}`);
                res.redirect(urlsAndPages.nextPage);
            })
            .catch((error) => {
                console.log(error);
            })
})}});

router.get('/task-1-part-2', (req, res) => {
    let currentPage = getPageNumber(req.originalUrl, allUrls);
    let perguntas = allQuestions.filter(data => data.page === currentPage);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    const userEmail = req.session.currentUser;
    const handlebarsPage = urlsAndPages.handlebarsStaticPage;
    
    Answer.findOne({userEmail: userEmail, currentPage: currentPage})
    .then((answer) => {
        if (answer !== null) {
            const questionIds = JSON.parse(answer.questionsIdSaved);
            const questionAnswersPartial = JSON.parse(answer.answersSaved);
            perguntasWithUserAnswers = addUsersExistingsAnswers(perguntas, questionIds, questionAnswersPartial);
            perguntas = perguntasWithUserAnswers;
            res.render(handlebarsPage, { perguntas, urlsAndPages });
        } else {
            console.log(`no answers saved for ${userEmail} yet`);
            res.render(handlebarsPage, { perguntas, urlsAndPages });
        }
    })
    .catch((error) => {
        console.log(error);
    })
});

router.post('/task-1-part-2', (req, res) => {
    const keysConvertedToNumbers = Object.keys(req.body).map(_element => parseInt(_element, 10));
    const answersObject = JSON.stringify(req.body);
    const questionsIdSaved = JSON.stringify(Object.values(keysConvertedToNumbers)); // Convert to string, otherwise MongoDB will not store the data
    const answersSaved = JSON.stringify(Object.values(req.body));
    const createdAt = req._startTime;
    const userId = req.cookies.session;
    const userEmail = req.session.currentUser;
    const currentPage = getPageNumber(req.originalUrl, allUrls);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    const dataForThisSheet = allQuestions.filter( data => data.page === currentPage);
    const perguntas = dataForThisSheet.filter (data => !data.heading);
    const newQuestionSubmittedByUser = new Answer ( { userId, userEmail, currentPage, answersObject, questionsIdSaved, answersSaved, createdAt} );

    if (Object.keys(req.body).length === perguntas.length) {
        Answer.deleteMany({userEmail: userEmail, currentPage: currentPage})
        .then(() => {
            newQuestionSubmittedByUser.save()
            .then( (answer) => {
                console.log(`Answer saved to database: ${answer}`);
                res.redirect(urlsAndPages.nextPage);
            })
            .catch((error) => {
                console.log(error);
            })
})}});


/* --- TASK TWO ROUTES --- */
/* --- PROTOTYPE FOR OTHER ROUTES ---*/
router.get('/task-2-part-1a', (req, res) => {
    const userEmail = req.session.currentUser;
    const currentPage = getPageNumber(req.originalUrl, allUrls);
    const perguntasUnconverted = allQuestions.filter( data => data.page === currentPage);
    let perguntas = formatQuestions(perguntasUnconverted);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    const handlebarsPage = urlsAndPages.handlebarsStaticPage;
    Answer.findOne({userEmail: userEmail, currentPage: currentPage})
    .then((answer) => {
        if (answer != null) {
            const questionIds = JSON.parse(answer.questionsIdSaved);
            const questionAnswersPartial = JSON.parse(answer.answersSaved);
            perguntasWithUserAnswers = addUsersExistingsAnswers(perguntas, questionIds, questionAnswersPartial);
            perguntas =  perguntasWithUserAnswers;
            res.render(handlebarsPage, { perguntas, urlsAndPages });
        } else {
            console.log(`no answers saved for ${userEmail} yet`);
            res.render(handlebarsPage, { perguntas, urlsAndPages });
        }})
        .catch((error) => {
            console.log(error);
    })
});

router.get('/task-2-part-1b', (req, res) => {
    const userEmail = req.session.currentUser;
    const currentPage = getPageNumber(req.originalUrl, allUrls);
    const perguntasUnconverted = allQuestions.filter( data => data.page === currentPage);
    let perguntas = formatQuestions(perguntasUnconverted);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    const handlebarsPage = urlsAndPages.handlebarsStaticPage;
    Answer.findOne({userEmail: userEmail, currentPage: currentPage})
    .then((answer) => {
        if (answer != null) {
            const questionIds = JSON.parse(answer.questionsIdSaved);
            const questionAnswersPartial = JSON.parse(answer.answersSaved);
            perguntasWithUserAnswers = addUsersExistingsAnswers(perguntas, questionIds, questionAnswersPartial);
            perguntas =  perguntasWithUserAnswers;
            res.render(handlebarsPage, { perguntas, urlsAndPages });
        } else {
            console.log(`no answers saved for ${userEmail} yet`);
            res.render(handlebarsPage, { perguntas, urlsAndPages });
        }})
        .catch((error) => {
            console.log(error);
    })
});

router.get('/task-2-part-2', (req, res) => {
    const userEmail = req.session.currentUser;
    const currentPage = getPageNumber(req.originalUrl, allUrls);
    const perguntasUnconverted = allQuestions.filter( data => data.page === currentPage);
    let perguntas = formatQuestions(perguntasUnconverted);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    const handlebarsPage = urlsAndPages.handlebarsStaticPage;
    
    Answer.findOne({userEmail: userEmail, currentPage: currentPage})
    .then((answer) => {
        if (answer != null) {
            const questionIds = JSON.parse(answer.questionsIdSaved);
            const questionAnswersPartial = JSON.parse(answer.answersSaved);
            perguntasWithUserAnswers = addUsersExistingsAnswers(perguntas, questionIds, questionAnswersPartial);
            perguntas =  perguntasWithUserAnswers;
            res.render(handlebarsPage, { perguntas, urlsAndPages });
        } else {
            console.log(`no answers saved for ${userEmail} yet`);
            res.render(handlebarsPage, { perguntas, urlsAndPages });
        }})
        .catch((error) => {
            console.log(error);
    })
});

router.get('/task-2-part-3', (req, res) => {
    const userEmail = req.session.currentUser;
    const currentPage = getPageNumber(req.originalUrl, allUrls);
    const perguntasUnconverted = allQuestions.filter( data => data.page === currentPage);
    let perguntas = formatQuestions(perguntasUnconverted);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    const handlebarsPage = urlsAndPages.handlebarsStaticPage;
    Answer.findOne({userEmail: userEmail, currentPage: currentPage})
    .then((answer) => {
        if (answer != null) {
            const questionIds = JSON.parse(answer.questionsIdSaved);
            const questionAnswersPartial = JSON.parse(answer.answersSaved);
            perguntasWithUserAnswers = addUsersExistingsAnswers(perguntas, questionIds, questionAnswersPartial);
            perguntas =  perguntasWithUserAnswers;
            res.render(handlebarsPage, { perguntas, urlsAndPages });
        } else {
            console.log(`no answers saved for ${userEmail} yet`);
            res.render(handlebarsPage, { perguntas, urlsAndPages });
        }})
        .catch((error) => {
            console.log(error);
    })
});

router.post('/task-2-part-1a', (req, res) => {
    const reqBody = req.body;
    const keysConvertedToNumbers = Object.keys(reqBody).map(_element => parseInt(_element, 10));
    const answersObject = JSON.stringify(reqBody);
    const questionsIdSaved = JSON.stringify(Object.values(keysConvertedToNumbers)); // Convert to string, otherwise MongoDB will not store the data
    const answersSaved = JSON.stringify(Object.values(reqBody));
    const createdAt = req._startTime;
    const userId = req.cookies.session;
    const userEmail = req.session.currentUser;
    const length = Object.keys(req.body).length;
    const valuesAsString = Object.values(req.body).toString(); // Used for checking if student or no
    let includesBlank = answersObject.includes(`":""`);
    const currentPage = getPageNumber(req.originalUrl, allUrls);
    const dataForThisSheet = allQuestions.filter( data => data.page === currentPage);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    // Declare variable which will be used to calculate how many questions are on this page (it excludes headings)
    const perguntas = dataForThisSheet.filter (data => !data.heading);
    const newQuestionSubmittedByUser = new Answer ( { userId, userEmail, currentPage, answersObject, questionsIdSaved, answersSaved, createdAt} )

    if ( (length === perguntas.length && !includesBlank) || valuesAsString === 'I am a full time student' || valuesAsString === 'no' ) {
        // Overwrite by first deleting all the entrances for this userEmail and currentPage combination
        Answer.deleteMany({userEmail: userEmail, currentPage: currentPage})
        .then(() => {
            console.log('Deleted All');
          })
          .catch((error) => {
            console.log(error);
          })
        newQuestionSubmittedByUser.save()
        .then( (answer) => {
            console.log(`Answer saved to database: ${answer}`);
            if (length === perguntas.length) {
                res.redirect(urlsAndPages.nextPage);
            } else {
                res.redirect('/task-2-part-2'); // Skip the next question if the values are 'I am a full time student' or 'no'
            }
        })
        .catch((error) => {
            console.log(error);
})}});

router.post('/task-2-part-1b', (req, res) => {
    const reqBody = req.body;
    const keysConvertedToNumbers = Object.keys(reqBody).map(_element => parseInt(_element, 10));
    const answersObject = JSON.stringify(reqBody);
    const questionsIdSaved = JSON.stringify(Object.values(keysConvertedToNumbers)); // Convert to string, otherwise MongoDB will not store the data
    const answersSaved = JSON.stringify(Object.values(reqBody));
    const createdAt = req._startTime;
    const userId = req.cookies.session;
    const userEmail = req.session.currentUser;
    const length = Object.keys(req.body).length;
    const currentPage = getPageNumber(req.originalUrl, allUrls);
    const dataForThisSheet = allQuestions.filter( data => data.page === currentPage);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    const perguntas = dataForThisSheet.filter (data => !data.heading);
    const newQuestionSubmittedByUser = new Answer ( { userId, userEmail, currentPage, answersObject, questionsIdSaved, answersSaved, createdAt} );
    let includesBlank = answersObject.includes(`":""`);

    if (length === perguntas.length && !includesBlank) {
        Answer.deleteMany({userEmail: userEmail, currentPage: currentPage})
        .then(() => {console.log('Deleted All');
          })
          .catch((error) => {
            console.log(error);
          })
        newQuestionSubmittedByUser.save()
        .then( (answer) => {
            console.log(`Answer saved to database: ${answer}`);
            res.redirect(urlsAndPages.nextPage);
        })
        .catch((error) => {
            console.log(error);
})}});

router.post('/task-2-part-2', (req, res) => {
    const reqBody = req.body;
    const keysConvertedToNumbers = Object.keys(reqBody).map(_element => parseInt(_element, 10));
    const answersObject = JSON.stringify(reqBody);
    const questionsIdSaved = JSON.stringify(Object.values(keysConvertedToNumbers)); // Convert to string, otherwise MongoDB will not store the data
    const answersSaved = JSON.stringify(Object.values(reqBody));
    const createdAt = req._startTime;
    const userId = req.cookies.session;
    const userEmail = req.session.currentUser;
    const length = Object.keys(req.body).length;
    const currentPage = getPageNumber(req.originalUrl, allUrls);
    const dataForThisSheet = allQuestions.filter( data => data.page === currentPage);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    const perguntas = dataForThisSheet.filter (data => !data.heading);
    const newQuestionSubmittedByUser = new Answer ( { userId, userEmail, currentPage, answersObject, questionsIdSaved, answersSaved, createdAt} );
    let includesBlank = answersObject.includes(`":""`);

    if (length === perguntas.length && !includesBlank) {
        Answer.deleteMany({userEmail: userEmail, currentPage: currentPage})
        .then(() => {console.log('Deleted All');
          })
          .catch((error) => {
            console.log(error);
          })
        newQuestionSubmittedByUser.save()
        .then( (answer) => {
            console.log(`Answer saved to database: ${answer}`);
            res.redirect(urlsAndPages.nextPage);
        })
        .catch((error) => {
            console.log(error);
})}});


router.post('/task-2-part-3', (req, res) => {
    const reqBody = req.body;
    const keysConvertedToNumbers = Object.keys(reqBody).map(_element => parseInt(_element, 10));
    const answersObject = JSON.stringify(reqBody);
    const questionsIdSaved = JSON.stringify(Object.values(keysConvertedToNumbers)); // Convert to string, otherwise MongoDB will not store the data
    const answersSaved = JSON.stringify(Object.values(reqBody));
    const createdAt = req._startTime;
    const userId = req.cookies.session;
    const userEmail = req.session.currentUser;
    const length = Object.keys(req.body).length;
    const currentPage = getPageNumber(req.originalUrl, allUrls);
    const dataForThisSheet = allQuestions.filter( data => data.page === currentPage);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    const perguntas = dataForThisSheet.filter (data => !data.heading);
    const newQuestionSubmittedByUser = new Answer ( { userId, userEmail, currentPage, answersObject, questionsIdSaved, answersSaved, createdAt} );
    const valuesAsString = Object.values(req.body).toString();
    let includesNo = valuesAsString.includes("0-no");

    if ((length === perguntas.length) || (length === 2 && valuesAsString === '0-no,0-no') || ( (length === 3 && includesNo) ) ) {
        Answer.deleteMany({userEmail: userEmail, currentPage: currentPage})
        .then(() => {console.log('Deleted All');
          })
          .catch((error) => {
            console.log(error);
          })
        newQuestionSubmittedByUser.save()
        .then( (answer) => {
            res.redirect(urlsAndPages.nextPage);
        })
        .catch((error) => {
            console.log(error);
        })
    }
});

/* Task Three Routes Below */

router.get('/scenario-1-split-1', (req, res) => {
    const currentPage = getPageNumber(req.originalUrl, allUrls);
    console.log(currentPage);
    const dataForThisSheet = allQuestions.filter( data => data.page === currentPage);
    const sheetsSituations = dataForThisSheet.filter (data => data.scenario);
    const heading = dataForThisSheet.filter (data => data.heading);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    const userEmail = req.session.currentUser;
    const handlebarsPage = urlsAndPages.handlebarsStaticPage;
    let perguntas = dataForThisSheet.filter (data => data.radio);

    Answer.findOne({userEmail: userEmail, currentPage: currentPage})
    .then((answer) => {
        if (answer != null) {
        const questionIds = JSON.parse(answer.questionsIdSaved);
        const questionAnswersPartial = JSON.parse(answer.answersSaved);
        let perguntasWithUserAnswers = addUsersExistingsAnswers(perguntas, questionIds, questionAnswersPartial);
        perguntas = perguntasWithUserAnswers;
        res.render(handlebarsPage, { heading, sheetsSituations, perguntas, urlsAndPages });
    } else {
        console.log(`no answers saved for ${userEmail} yet`);
        res.render(handlebarsPage, { heading, sheetsSituations, perguntas, urlsAndPages });
    }})
    .catch((error) => {
        console.log(error);
})});




router.post('/scenario-1-split-1', (req, res) => {
    let currentPage = getPageNumber(req.originalUrl, allUrls);
    const dataForThisSheet = allQuestions.filter( data => data.page === currentPage);
    const createdAt = req._startTime;
    const answersObject = JSON.stringify(req.body);
    const userId = req.cookies.session;
    const keysConvertedToNumbers = Object.keys(req.body).map(_element => parseInt(_element, 10));
    const questionsIdSaved = JSON.stringify(Object.values(keysConvertedToNumbers));
    const answersSaved = JSON.stringify(Object.values(req.body));
    const userEmail = req.session.currentUser;
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    const perguntas = dataForThisSheet.filter (data => data.radio);
    const newQuestionSubmittedByUser = new Answer ( { userId, userEmail, currentPage, answersObject, questionsIdSaved, answersSaved, createdAt} );

    if (Object.keys(req.body).length === perguntas.length) {
        Answer.deleteMany({userEmail: userEmail, currentPage: currentPage})
        .then((answer) => {
            console.log(answer);
            newQuestionSubmittedByUser.save()
            .then( (answer) => {
                console.log(`Answer saved to database: ${answer}`);
                res.redirect(urlsAndPages.nextPage);
            })
            .catch((error) => {
                console.log(error);
            })
})}});



router.get('/scenario-1-split-2', (req, res) => {
    const currentPage = getPageNumber(req.originalUrl, allUrls);
    const dataForThisSheet = allQuestions.filter( data => data.page === currentPage);
    const sheetsSituations = dataForThisSheet.filter (data => data.scenario);
    const heading = dataForThisSheet.filter (data => data.heading);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    const userEmail = req.session.currentUser;
    const handlebarsPage = urlsAndPages.handlebarsStaticPage;
    let perguntas = dataForThisSheet.filter (data => data.radio);

    Answer.findOne({userEmail: userEmail, currentPage: currentPage})
    .then((answer) => {
        if (answer != null) {
        const questionIds = JSON.parse(answer.questionsIdSaved);
        const questionAnswersPartial = JSON.parse(answer.answersSaved);
        let perguntasWithUserAnswers = addUsersExistingsAnswers(perguntas, questionIds, questionAnswersPartial);
        perguntas = perguntasWithUserAnswers;
        res.render(handlebarsPage, { heading, sheetsSituations, perguntas, urlsAndPages });
    } else {
        console.log(`no answers saved for ${userEmail} yet`);
        res.render(handlebarsPage, { heading, sheetsSituations, perguntas, urlsAndPages });
    }})
    .catch((error) => {
        console.log(error);
})});

router.post('/scenario-1-split-2', (req, res) => {
    let currentPage = getPageNumber(req.originalUrl, allUrls);
    const dataForThisSheet = allQuestions.filter( data => data.page === currentPage);
    const createdAt = req._startTime;
    const answersObject = JSON.stringify(req.body);
    const userId = req.cookies.session;
    const keysConvertedToNumbers = Object.keys(req.body).map(_element => parseInt(_element, 10));
    const questionsIdSaved = JSON.stringify(Object.values(keysConvertedToNumbers));
    const answersSaved = JSON.stringify(Object.values(req.body));
    const userEmail = req.session.currentUser;
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    const perguntas = dataForThisSheet.filter (data => data.radio);
    const newQuestionSubmittedByUser = new Answer ( { userId, userEmail, currentPage, answersObject, questionsIdSaved, answersSaved, createdAt} );

    if (Object.keys(req.body).length === perguntas.length) {
        Answer.deleteMany({userEmail: userEmail, currentPage: currentPage})
        .then((answer) => {
            console.log(answer);
            newQuestionSubmittedByUser.save()
            .then( (answer) => {
                console.log(`Answer saved to database: ${answer}`);
                res.redirect(urlsAndPages.nextPage);
            })
            .catch((error) => {
                console.log(error);
            })
})}});

router.get('/scenario-2-split-1', (req, res) => {
    const currentPage = getPageNumber(req.originalUrl, allUrls);
    const dataForThisSheet = allQuestions.filter( data => data.page === currentPage);
    const sheetsSituations = dataForThisSheet.filter (data => data.scenario);
    const heading = dataForThisSheet.filter (data => data.heading);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    const userEmail = req.session.currentUser;
    const handlebarsPage = urlsAndPages.handlebarsStaticPage;
    let perguntas = dataForThisSheet.filter (data => data.radio);

    Answer.findOne({userEmail: userEmail, currentPage: currentPage})
    .then((answer) => {
        if (answer != null) {
        const questionIds = JSON.parse(answer.questionsIdSaved);
        const questionAnswersPartial = JSON.parse(answer.answersSaved);
        let perguntasWithUserAnswers = addUsersExistingsAnswers(perguntas, questionIds, questionAnswersPartial);
        perguntas = perguntasWithUserAnswers;
        res.render(handlebarsPage, { heading, sheetsSituations, perguntas, urlsAndPages });
    } else {
        console.log(`no answers saved for ${userEmail} yet`);
        res.render(handlebarsPage, { heading, sheetsSituations, perguntas, urlsAndPages });
    }})
    .catch((error) => {
        console.log(error);
})});

router.post('/scenario-2-split-1', (req, res) => {
    let currentPage = getPageNumber(req.originalUrl, allUrls);
    const dataForThisSheet = allQuestions.filter( data => data.page === currentPage);
    const createdAt = req._startTime;
    const answersObject = JSON.stringify(req.body);
    const userId = req.cookies.session;
    const keysConvertedToNumbers = Object.keys(req.body).map(_element => parseInt(_element, 10));
    const questionsIdSaved = JSON.stringify(Object.values(keysConvertedToNumbers));
    const answersSaved = JSON.stringify(Object.values(req.body));
    const userEmail = req.session.currentUser;
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    const perguntas = dataForThisSheet.filter (data => data.radio);
    const newQuestionSubmittedByUser = new Answer ( { userId, userEmail, currentPage, answersObject, questionsIdSaved, answersSaved, createdAt} );

    if (Object.keys(req.body).length === perguntas.length) {
        Answer.deleteMany({userEmail: userEmail, currentPage: currentPage})
        .then((answer) => {
            console.log(answer);
            newQuestionSubmittedByUser.save()
            .then( (answer) => {
                console.log(`Answer saved to database: ${answer}`);
                res.redirect(urlsAndPages.nextPage);
            })
            .catch((error) => {
                console.log(error);
            })
})}});

router.get('/scenario-2-split-2', (req, res) => {
    const currentPage = getPageNumber(req.originalUrl, allUrls);
    const dataForThisSheet = allQuestions.filter( data => data.page === currentPage);
    const sheetsSituations = dataForThisSheet.filter (data => data.scenario);
    const heading = dataForThisSheet.filter (data => data.heading);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    const userEmail = req.session.currentUser;
    const handlebarsPage = urlsAndPages.handlebarsStaticPage;
    let perguntas = dataForThisSheet.filter (data => data.radio);

    Answer.findOne({userEmail: userEmail, currentPage: currentPage})
    .then((answer) => {
        if (answer != null) {
        const questionIds = JSON.parse(answer.questionsIdSaved);
        const questionAnswersPartial = JSON.parse(answer.answersSaved);
        let perguntasWithUserAnswers = addUsersExistingsAnswers(perguntas, questionIds, questionAnswersPartial);
        perguntas = perguntasWithUserAnswers;
        res.render(handlebarsPage, { heading, sheetsSituations, perguntas, urlsAndPages });
    } else {
        console.log(`no answers saved for ${userEmail} yet`);
        res.render(handlebarsPage, { heading, sheetsSituations, perguntas, urlsAndPages });
    }})
    .catch((error) => {
        console.log(error);
})});

router.post('/scenario-2-split-2', (req, res) => {
    let currentPage = getPageNumber(req.originalUrl, allUrls);
    const dataForThisSheet = allQuestions.filter( data => data.page === currentPage);
    const createdAt = req._startTime;
    const answersObject = JSON.stringify(req.body);
    const userId = req.cookies.session;
    const keysConvertedToNumbers = Object.keys(req.body).map(_element => parseInt(_element, 10));
    const questionsIdSaved = JSON.stringify(Object.values(keysConvertedToNumbers));
    const answersSaved = JSON.stringify(Object.values(req.body));
    const userEmail = req.session.currentUser;
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    const perguntas = dataForThisSheet.filter (data => data.radio);
    const newQuestionSubmittedByUser = new Answer ( { userId, userEmail, currentPage, answersObject, questionsIdSaved, answersSaved, createdAt} );

    if (Object.keys(req.body).length === perguntas.length) {
        Answer.deleteMany({userEmail: userEmail, currentPage: currentPage})
        .then((answer) => {
            console.log(answer);
            newQuestionSubmittedByUser.save()
            .then( (answer) => {
                console.log(`Answer saved to database: ${answer}`);
                res.redirect(urlsAndPages.nextPage);
            })
            .catch((error) => {
                console.log(error);
            })
})}});

router.get('/scenario-3-split-1', (req, res) => {
    const currentPage = getPageNumber(req.originalUrl, allUrls);
    const dataForThisSheet = allQuestions.filter( data => data.page === currentPage);
    const sheetsSituations = dataForThisSheet.filter (data => data.scenario);
    const heading = dataForThisSheet.filter (data => data.heading);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    const userEmail = req.session.currentUser;
    const handlebarsPage = urlsAndPages.handlebarsStaticPage;
    let perguntas = dataForThisSheet.filter (data => data.radio);

    Answer.findOne({userEmail: userEmail, currentPage: currentPage})
    .then((answer) => {
        if (answer != null) {
        const questionIds = JSON.parse(answer.questionsIdSaved);
        const questionAnswersPartial = JSON.parse(answer.answersSaved);
        let perguntasWithUserAnswers = addUsersExistingsAnswers(perguntas, questionIds, questionAnswersPartial);
        perguntas = perguntasWithUserAnswers;
        res.render(handlebarsPage, { heading, sheetsSituations, perguntas, urlsAndPages });
    } else {
        console.log(`no answers saved for ${userEmail} yet`);
        res.render(handlebarsPage, { heading, sheetsSituations, perguntas, urlsAndPages });
    }})
    .catch((error) => {
        console.log(error);
})});

router.post('/scenario-3-split-1', (req, res) => {
    let currentPage = getPageNumber(req.originalUrl, allUrls);
    const dataForThisSheet = allQuestions.filter( data => data.page === currentPage);
    const createdAt = req._startTime;
    const answersObject = JSON.stringify(req.body);
    const userId = req.cookies.session;
    const keysConvertedToNumbers = Object.keys(req.body).map(_element => parseInt(_element, 10));
    const questionsIdSaved = JSON.stringify(Object.values(keysConvertedToNumbers));
    const answersSaved = JSON.stringify(Object.values(req.body));
    const userEmail = req.session.currentUser;
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    const perguntas = dataForThisSheet.filter (data => data.radio);
    const newQuestionSubmittedByUser = new Answer ( { userId, userEmail, currentPage, answersObject, questionsIdSaved, answersSaved, createdAt} );

    if (Object.keys(req.body).length === perguntas.length) {
        Answer.deleteMany({userEmail: userEmail, currentPage: currentPage})
        .then((answer) => {
            console.log(answer);
            newQuestionSubmittedByUser.save()
            .then( (answer) => {
                console.log(`Answer saved to database: ${answer}`);
                res.redirect(urlsAndPages.nextPage);
            })
            .catch((error) => {
                console.log(error);
            })
})}});

router.get('/scenario-3-split-2', (req, res) => {
    const currentPage = getPageNumber(req.originalUrl, allUrls);
    const dataForThisSheet = allQuestions.filter( data => data.page === currentPage);
    const sheetsSituations = dataForThisSheet.filter (data => data.scenario);
    const heading = dataForThisSheet.filter (data => data.heading);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    const userEmail = req.session.currentUser;
    const handlebarsPage = urlsAndPages.handlebarsStaticPage;
    let perguntas = dataForThisSheet.filter (data => data.radio);

    Answer.findOne({userEmail: userEmail, currentPage: currentPage})
    .then((answer) => {
        if (answer != null) {
        const questionIds = JSON.parse(answer.questionsIdSaved);
        const questionAnswersPartial = JSON.parse(answer.answersSaved);
        let perguntasWithUserAnswers = addUsersExistingsAnswers(perguntas, questionIds, questionAnswersPartial);
        perguntas = perguntasWithUserAnswers;
        res.render(handlebarsPage, { heading, sheetsSituations, perguntas, urlsAndPages });
    } else {
        console.log(`no answers saved for ${userEmail} yet`);
        res.render(handlebarsPage, { heading, sheetsSituations, perguntas, urlsAndPages });
    }})
    .catch((error) => {
        console.log(error);
})});

router.post('/scenario-3-split-2', (req, res) => {
    let currentPage = getPageNumber(req.originalUrl, allUrls);
    const dataForThisSheet = allQuestions.filter( data => data.page === currentPage);
    const createdAt = req._startTime;
    const answersObject = JSON.stringify(req.body);
    const userId = req.cookies.session;
    const keysConvertedToNumbers = Object.keys(req.body).map(_element => parseInt(_element, 10));
    const questionsIdSaved = JSON.stringify(Object.values(keysConvertedToNumbers));
    const answersSaved = JSON.stringify(Object.values(req.body));
    const userEmail = req.session.currentUser;
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    const perguntas = dataForThisSheet.filter (data => data.radio);
    const newQuestionSubmittedByUser = new Answer ( { userId, userEmail, currentPage, answersObject, questionsIdSaved, answersSaved, createdAt} );

    if (Object.keys(req.body).length === perguntas.length) {
        Answer.deleteMany({userEmail: userEmail, currentPage: currentPage})
        .then((answer) => {
            console.log(answer);
            newQuestionSubmittedByUser.save()
            .then( (answer) => {
                console.log(`Answer saved to database: ${answer}`);
                res.redirect(urlsAndPages.nextPage);
            })
            .catch((error) => {
                console.log(error);
            })
})}});

router.get('/study-conclusion', (req, res) => {
  res.render('6a-study-conclusion');
});


// Temp Pages for DEMO PURPOSES
router.get('/scenarios-layout-a', (req, res) => {
    const currentPage = 14;
    const dataForThisSheet = allQuestions.filter( data => data.page === currentPage);
    const sheetsSituations = dataForThisSheet.filter (data => data.scenario);
    const heading = dataForThisSheet.filter (data => data.heading);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    const userEmail = req.session.currentUser;
    const handlebarsPage = '5a-scenarios-split';
    let perguntas = dataForThisSheet.filter (data => data.radio);

    Answer.findOne({userEmail: userEmail, currentPage: currentPage})
    .then((answer) => {
        if (answer != null) {
        const questionIds = JSON.parse(answer.questionsIdSaved);
        const questionAnswersPartial = JSON.parse(answer.answersSaved);
        let perguntasWithUserAnswers = addUsersExistingsAnswers(perguntas, questionIds, questionAnswersPartial);
        perguntas = perguntasWithUserAnswers;
        res.render(handlebarsPage, { heading, sheetsSituations, perguntas, urlsAndPages });
    } else {
        console.log(`no answers saved for ${userEmail} yet`);
        res.render(handlebarsPage, { heading, sheetsSituations, perguntas, urlsAndPages });
    }})
    .catch((error) => {
        console.log(error);
})});

router.get('/scenarios-layout-b', (req, res) => {
    const currentPage = 14;
    const dataForThisSheet = allQuestions.filter( data => data.page === currentPage);
    const sheetsSituations = dataForThisSheet.filter (data => data.scenario);
    const heading = dataForThisSheet.filter (data => data.heading);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    const userEmail = req.session.currentUser;
    const handlebarsPage = '5a-scenarios-split-b';
    let perguntas = dataForThisSheet.filter (data => data.radio);

    Answer.findOne({userEmail: userEmail, currentPage: currentPage})
    .then((answer) => {
        if (answer != null) {
        const questionIds = JSON.parse(answer.questionsIdSaved);
        const questionAnswersPartial = JSON.parse(answer.answersSaved);
        let perguntasWithUserAnswers = addUsersExistingsAnswers(perguntas, questionIds, questionAnswersPartial);
        perguntas = perguntasWithUserAnswers;
        res.render(handlebarsPage, { heading, sheetsSituations, perguntas, urlsAndPages });
    } else {
        console.log(`no answers saved for ${userEmail} yet`);
        res.render(handlebarsPage, { heading, sheetsSituations, perguntas, urlsAndPages });
    }})
    .catch((error) => {
        console.log(error);
})});

router.get('/scenarios-layout-c', (req, res) => {
    const currentPage = 14;
    const dataForThisSheet = allQuestions.filter( data => data.page === currentPage);
    const sheetsSituations = dataForThisSheet.filter (data => data.scenario);
    const heading = dataForThisSheet.filter (data => data.heading);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    const userEmail = req.session.currentUser;
    const handlebarsPage = '5a-scenarios-split-c';
    let perguntas = dataForThisSheet.filter (data => data.radio);

    Answer.findOne({userEmail: userEmail, currentPage: currentPage})
    .then((answer) => {
        if (answer != null) {
        const questionIds = JSON.parse(answer.questionsIdSaved);
        const questionAnswersPartial = JSON.parse(answer.answersSaved);
        let perguntasWithUserAnswers = addUsersExistingsAnswers(perguntas, questionIds, questionAnswersPartial);
        perguntas = perguntasWithUserAnswers;
        res.render(handlebarsPage, { heading, sheetsSituations, perguntas, urlsAndPages });
    } else {
        console.log(`no answers saved for ${userEmail} yet`);
        res.render(handlebarsPage, { heading, sheetsSituations, perguntas, urlsAndPages });
    }})
    .catch((error) => {
        console.log(error);
})});


module.exports = router;