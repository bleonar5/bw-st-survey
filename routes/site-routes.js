const express = require("express");
const router = express.Router();
const Answer = require('../models/answerLowerCase2.js');
const FinalAnsSubmitted = require('../models/finalAnsSubmitted2.js');
const MTurkFeedback = require('../models/mTurkFeedback2.js');
// const Mturk = require('../models/mTurk2.js');
const LegitEmail = require("../models/emaillist.js");
const UserPaymentPref = require('../models/userPaymentPref.js');
const app = express();

// Require User model for resume-survey page
const User = require("../models/user2.js");

const getPageNumber = require('../helpers/getPageNumber.js');
const formatQuestions = require('../helpers/formatQuestions.js');
const extractUrlAndPage = require('../helpers/extractUrlAndPage.js');
const cookieSession = require('cookie-session');
const addUsersExistingsAnswers = require('../helpers/addUsersExistingsAnswers.js');

// Declare variable which hold all data from Google Sheets Import
const allQuestions = require('../bin/sheets-import.js');
const allUrls = require('../bin/urls.js');

// Cookie Session
app.use(cookieSession({
    name: 'sesh',
    // keys: [/* secret keys */],
    keys: ['key1', 'key2'],
  
    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))


/* Comment Out as it is causing bugs
// Write own Middleware to prevent users who are not logged in from accessing secret pages
router.use((req, res, next) => {
    if (req.session.currentUser) { // <== if there's user in the session (user is logged in)
      next(); // ==> go to the next route ---
    } else {       
        res.redirect('/'); 
        //    |
        // res.redirect('/individual-login');         //    |
    }                                 //    |
});
*/

/* --- INTRO ROUTES --- */
// The login page is kept in routes/auth.js
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

/* --- RESUME SURVEY ROUTE (Set up on 11 Feb) --- */

router.get('/resume-survey', (req, res) => {
    res.render('0b-resume-survey-login');
});

// Add post route for resume survey so that req.session currentUser is set to the correct email address
router.post('/resume-survey', (req, res) => {
    const email = req.body.emailResumeSurvey;
    console.log(email);
    const loginTime = req._startTime;

    User.findOne({ "email": email })
      .then(user => {
        if (user === null) {
          res.render('0b-resume-survey-login', {
            errorMessage1: `Sorry, we can't find an account with the email address ${email}. Please try again.`,
          });
          return;
        } else {
            console.log(user);
            User.updateOne( { "email": email }, { $set: { lastLogin: loginTime }})
            .then( updatedUser => {
                    console.log(updatedUser);
                    console.log(req.session.currentUser);
                    console.log(`Scenario 4: Email exists in database & user is resuming a survey. req.session.currentUser for ${email} set`);
                    req.session.currentUser = email;
                    res.redirect("instructions-1");
                    })
            .catch((error) => {
                console.log(error)
            });
        }})
});

/* --- Post route for the index --- */

router.post('/', (req, res) => {

    const firstName = req.body.firstNameOnLogin;
    const familyName = req.body.familyNameOnLogin;
    const email = req.body.emailOnLogin;

    // Check 1: Check email address against the list of emails given for the Superteams study. If the email address cannot be found on the database, then prompt the user to give a different email address
    LegitEmail.findOne({ "emailPopulated": email })
    .then(emailAddress => {
        if (emailAddress === null) {
            console.log(`Scenario 1: Email address ${email} not found in the Superteams database. Re-Render page & display error message`);
            res.render('index.hbs', {
                errorMessage1: "The email address you have entered has not been recognized. Please use the same email you gave when you registered for the Superteams study.",
              });
            return;
        // The email has been found so we can progress to the next check
        } else {
            console.log(`Scenario 2: This email address has been found in the Superteams database: ${emailAddress}`)
    // Check 2: Look up email address. If the user has already registed, then prompt them to use the 'Resume Survey" button
        User.findOne({ "email": email })
        .then(user => {
            // The user has been found in the registed email address
            if (user !== null) {
                res.render('index.hbs', {
                    errorMessage1: "The email address you have entered is already registered.",
                    errorMessage2: "Click Resume Survey if you would like to continue from where you left off."
                });
                return; 
            } else {
                // If the user has not already registed and the email address is on the database of legit email addresses, then you can create a new user with the details from the login form
                User.create({
                    firstName,
                    familyName,
                    email
                })
                .then(() => {
                    console.log(`Scenario 3: Email exists in database & user is logging in for the first time. User with email ${email} created & req.session.currentUser set`);
                    // Set the req.session.currentUser equal to the email address
                    req.session.currentUser = email;
                    res.redirect("study-consent");
                })
                // Catch for creating user
                .catch(error => {
                    console.log(`Error when creating user: ${error}`);
                })
            } // close else in if statement for looking up user
        })
        // Catch for looking up the email in the users already emailed
        .catch(error => {
            next(error);
        })
}})});

/* --- INSTRUCTIONS ROUTES --- */

/* --- QUESTION-Q4E: Can I use a class or a function to avoid repeating lines here --- */
router.get('/instructions-1', (req, res) => { 
    const currentPage = getPageNumber(req.originalUrl, allUrls);
    const instructions = allQuestions.filter(data => data.page === currentPage);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    res.render('3a-instructions', { instructions, urlsAndPages });
});

router.get('/instructions-2', (req, res) => {
    const currentPage = getPageNumber(req.originalUrl, allUrls);
    const instructions = allQuestions.filter(data => data.page === currentPage);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    res.render('3a-instructions', { instructions, urlsAndPages });
});

router.get('/instructions-3', (req, res) => {
    const currentPage = getPageNumber(req.originalUrl, allUrls);
    const instructions = allQuestions.filter(data => data.page === currentPage);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    res.render('3a-instructions', { instructions, urlsAndPages });
});

/* --- INSTRUCTIONS POST ROUTES: Added on 29 Jan to track how long user spends on each question  --- */
/* ----- CODE BELOW NEEDS REFACTORING TO AVOID REPEATING LINES ----- */
router.post('/instructions-1', (req, res) => { 
    const currentPage = getPageNumber(req.originalUrl, allUrls);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    const createdAt = req._startTime;
    const userId = req.cookies.session;
    const userEmail = req.session.currentUser;
    const reqRemoteAddress = req._remoteAddress;
    const reqPath = req.route.path;
    const newQuestionSubmittedByUser = new Answer ( { userId, userEmail, currentPage, reqPath, reqRemoteAddress, createdAt} );

    newQuestionSubmittedByUser.save()
    .then( () => {
        res.redirect(urlsAndPages.nextPage);
    })
    .catch((error) => {
        console.log(error);
    })
});

router.post('/instructions-2', (req, res) => { 
    const currentPage = getPageNumber(req.originalUrl, allUrls);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    const createdAt = req._startTime;
    const userId = req.cookies.session;
    const userEmail = req.session.currentUser;
    const reqRemoteAddress = req._remoteAddress;
    const reqPath = req.route.path;
    const newQuestionSubmittedByUser = new Answer ( { userId, userEmail, currentPage, reqPath, reqRemoteAddress, createdAt} );

    newQuestionSubmittedByUser.save()
    .then( () => {
        res.redirect(urlsAndPages.nextPage);
    })
    .catch((error) => {
        console.log(error);
    })
});

router.post('/instructions-3', (req, res) => { 
    const currentPage = getPageNumber(req.originalUrl, allUrls);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    const createdAt = req._startTime;
    const userId = req.cookies.session;
    const userEmail = req.session.currentUser;
    const reqRemoteAddress = req._remoteAddress;
    const reqPath = req.route.path;
    const newQuestionSubmittedByUser = new Answer ( { userId, userEmail, currentPage, reqPath, reqRemoteAddress, createdAt} );

    newQuestionSubmittedByUser.save()
    .then( () => {
        res.redirect(urlsAndPages.nextPage);
    })
    .catch((error) => {
        console.log(error);
    })
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
/* --- End of Mezzanine Level Get Routes --- */

router.post('/scenario-2-intro', (req, res) => { 
    const currentPage = getPageNumber(req.originalUrl, allUrls);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    const createdAt = req._startTime;
    const userId = req.cookies.session;
    const userEmail = req.session.currentUser;
    const reqRemoteAddress = req._remoteAddress;
    const reqPath = req.route.path;
    const newQuestionSubmittedByUser = new Answer ( { userId, userEmail, currentPage, reqPath, reqRemoteAddress, createdAt} );

    newQuestionSubmittedByUser.save()
    .then( (notCurrentlyUsed) => {
        console.log(notCurrentlyUsed);
        res.redirect(urlsAndPages.nextPage);
    })
    .catch((error) => {
        console.log(error);
    })
});

router.post('/scenario-3-intro', (req, res) => { 
    const currentPage = getPageNumber(req.originalUrl, allUrls);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    const createdAt = req._startTime;
    const userId = req.cookies.session;
    const userEmail = req.session.currentUser;
    const reqRemoteAddress = req._remoteAddress;
    const reqPath = req.route.path;
    const newQuestionSubmittedByUser = new Answer ( { userId, userEmail, currentPage, reqPath, reqRemoteAddress, createdAt} );

    newQuestionSubmittedByUser.save()
    .then( (notCurrentlyUsed) => {
        console.log(notCurrentlyUsed);
        res.redirect(urlsAndPages.nextPage);
    })
    .catch((error) => {
        console.log(error);
    })
});

/* --- Need refactoring along with instructions post routes to avoid repetition --- */

/* --- TASK ONE ROUTES --- */
router.get('/task-1-part-1', (req, res) => {
    const currentPage = getPageNumber(req.originalUrl, allUrls);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    const userEmail = req.session.currentUser;
    const handlebarsPage = urlsAndPages.handlebarsStaticPage;
    const dataForThisSheet = allQuestions.filter( data => data.page === currentPage);
    const heading = dataForThisSheet.filter (data => data.heading);
    console.log(`--- Current page: ${currentPage}. ReqSession data: ${userEmail} --- `);
    // The mistake is here because you are manipulating the wrong data here. You need to make this a const. The browser creates a references to the original array rather than creating a new one
    const perguntas = dataForThisSheet.filter (data => data.radio);

    Answer.findOne({userEmail: userEmail, currentPage: currentPage})
    .then((answer) => {
        console.log(`--- Below is the answer retrieved from db for: ${userEmail}: --- `);
        console.log(answer);
        if (answer !== null) {
            console.log(`---- Answer is not null. userEmail is ${userEmail}. Current page is ${currentPage} ---- `);
            const questionIds = JSON.parse(answer.questionsIdSaved);
            const questionAnswersPartial = JSON.parse(answer.answersSaved);
            // This is an essential step. You need to deep Copy the array of objects so that when you add the user's answers, you do not manipulate the original array.
            // Previously, pergunatas was reassigned. You shouldn't reassign the value of perguntas becuase then other users will receive these results. You are maniuplating the original array here
            const deepCopyOfPerguntas = JSON.parse(JSON.stringify(perguntas));
            const perguntasWithUserAnswers = addUsersExistingsAnswers(deepCopyOfPerguntas, questionIds, questionAnswersPartial);
            // Make another deep copy
            const persistquestions = JSON.parse(JSON.stringify(perguntasWithUserAnswers));
            console.log(`--- Below is the first element of the Deep Copy containing ${userEmail} answers --`)
            console.log(persistquestions[0]);
            res.render(`${handlebarsPage}-persist`, { persistquestions, heading, urlsAndPages });
        } else {
            console.log(`--- No answers saved for ${userEmail} yet so show blank answers: ---`);
            console.log(perguntas[0]);
            res.render(handlebarsPage, { perguntas, heading, urlsAndPages });
        }
    })
    .catch((error) => {
        console.log(error);
    })
});

router.get('/task-1-part-2', (req, res) => {
    const currentPage = getPageNumber(req.originalUrl, allUrls);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    const userId = req.cookies.session;
    const userEmail = req.session.currentUser;
    const handlebarsPage = urlsAndPages.handlebarsStaticPage;
    const dataForThisSheet = allQuestions.filter( data => data.page === currentPage);
    const heading = dataForThisSheet.filter (data => data.heading);
    console.log(`--- Current page: ${currentPage}. ReqSession data: ${userEmail} --- `);
    const perguntas = dataForThisSheet.filter (data => data.radio);
    Answer.findOne({userEmail: userEmail, currentPage: currentPage})
    .then((answer) => {
        console.log(`--- Below is the answer retrieved from db for: ${userEmail}: --- `);
        console.log(answer);
        if (answer !== null) {
            console.log(`---- Answer is not null. userEmail is ${userEmail}. Current page is ${currentPage} ---- `);
            const questionIds = JSON.parse(answer.questionsIdSaved);
            const questionAnswersPartial = JSON.parse(answer.answersSaved);
            const deepCopyOfPerguntas = JSON.parse(JSON.stringify(perguntas));
            const perguntasWithUserAnswers = addUsersExistingsAnswers(deepCopyOfPerguntas, questionIds, questionAnswersPartial);
            const persistquestions = JSON.parse(JSON.stringify(perguntasWithUserAnswers));
            console.log(`--- Below is the first element of the Deep Copy containing ${userEmail} answers --`)
            console.log(persistquestions[0]);
            res.render(`${handlebarsPage}-persist`, { persistquestions, heading, urlsAndPages });
        } else {
            console.log(`--- No answers saved for ${userEmail} yet so show blank answers: ---`);
            console.log(perguntas[0]);
            res.render(handlebarsPage, { perguntas, heading, urlsAndPages });
        }
    })
    .catch((error) => {
        console.log(error);
    })
});

/* --- Post Routes for Task 1 --- */

router.post('/task-1-part-1', (req, res) => {
    const currentPage = getPageNumber(req.originalUrl, allUrls);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    const dataForThisSheet = allQuestions.filter(data => data.page === currentPage);
    const perguntas = dataForThisSheet.filter (data => !data.heading);
    const createdAt = req._startTime;
    const userId = req.cookies.session;
    const userEmail = req.session.currentUser;
    const keysConvertedToNumbers = Object.keys(req.body).map(_element => parseInt(_element, 10));
    const answersObject = JSON.stringify(req.body);
    const questionsIdSaved = JSON.stringify(Object.values(keysConvertedToNumbers)); 
    const answersSaved = JSON.stringify(Object.values(req.body));
    const reqPath = req.route.path;
    const numberOfQuestionsAnswered = Object.keys(req.body).length;

    if (numberOfQuestionsAnswered === perguntas.length) {
        Answer.updateOne( {userEmail: userEmail, currentPage: currentPage}, { $set:{ userId, userEmail, currentPage, reqPath, answersObject, questionsIdSaved, answersSaved, createdAt} }, { upsert: true })
        .then( (mongoUpdateResult) => {
            console.log(mongoUpdateResult);
            console.log(`--- Here is the Answer for ${userEmail} sent to the db ---`);
            console.log(answersObject);
            res.redirect(urlsAndPages.nextPage);
        })
        .catch((error) => {
            console.log(error);
        })
    } else {
        res.redirect(req.originalUrl);
    }
});

router.post('/task-1-part-2', (req, res) => {
    const currentPage = getPageNumber(req.originalUrl, allUrls);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    const dataForThisSheet = allQuestions.filter(data => data.page === currentPage);
    const perguntas = dataForThisSheet.filter (data => !data.heading);
    const createdAt = req._startTime;
    const userId = req.cookies.session;
    const userEmail = req.session.currentUser;
    const keysConvertedToNumbers = Object.keys(req.body).map(_element => parseInt(_element, 10));
    const answersObject = JSON.stringify(req.body);
    const questionsIdSaved = JSON.stringify(Object.values(keysConvertedToNumbers)); 
    const answersSaved = JSON.stringify(Object.values(req.body));
    const reqPath = req.route.path;
    const numberOfQuestionsAnswered = Object.keys(req.body).length;

    if (numberOfQuestionsAnswered === perguntas.length) {
        Answer.updateOne( {userEmail: userEmail, currentPage: currentPage}, { $set:{ userId, userEmail, currentPage, reqPath, answersObject, questionsIdSaved, answersSaved, createdAt} }, { upsert: true })
        .then( (mongoUpdateResult) => {
            console.log(mongoUpdateResult);
            console.log(`--- Here is the Answer for ${userEmail} sent to the db ---`);
            console.log(answersObject);
            res.redirect(urlsAndPages.nextPage);
        })
        .catch((error) => {
            console.log(error);
        })
    } else {
        res.redirect(req.originalUrl);
    }
});


/* --- TASK TWO GET ROUTES --- */
/* --- PROTOTYPE FOR OTHER TASK TWO ROUTES ---*/
router.get('/task-2-part-1a', (req, res) => {
    const currentPage = getPageNumber(req.originalUrl, allUrls);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    const userEmail = req.session.currentUser;
    const handlebarsPage = urlsAndPages.handlebarsStaticPage;
    const perguntasUnconverted = allQuestions.filter( data => data.page === currentPage);
    console.log(`--- Current page: ${currentPage}. ReqSession data: ${userEmail} --- `);
    const perguntas = formatQuestions(perguntasUnconverted);

    Answer.findOne({userEmail: userEmail, currentPage: currentPage})
    .then((answer) => {
        console.log(`--- Below is the answer retrieved from db for: ${userEmail}: --- `);
        console.log(answer);
        if (answer != null) {
            console.log(`---- Answer is not null. userEmail is ${userEmail}. Current page is ${currentPage} ---- `);
            const questionIds = JSON.parse(answer.questionsIdSaved);
            const questionAnswersPartial = JSON.parse(answer.answersSaved);
            // Remember, before you convert these questions you need to make a deep copy of the array. Under no circumstances must the orginal array be mutated.
            const deepCopyOfPerguntas = JSON.parse(JSON.stringify(perguntas));
            const perguntasWithUserAnswers = addUsersExistingsAnswers(deepCopyOfPerguntas, questionIds, questionAnswersPartial);
            // Make another deep copy of the returned array
            const persistquestions = JSON.parse(JSON.stringify(perguntasWithUserAnswers));
            console.log(`--- Below is the first element of the Deep Copy containing ${userEmail} answers --`)
            console.log(persistquestions[0]);
            res.render(`${handlebarsPage}-persist`, { persistquestions, urlsAndPages });
        } else {
            console.log(`--- No answers saved for ${userEmail} yet so show blank answers: ---`);
            console.log(perguntas[0]);
            res.render(handlebarsPage, { perguntas, urlsAndPages });
        }})
        .catch((error) => {
            console.log(error);
    })
});

router.get('/task-2-part-1b', (req, res) => {
    const currentPage = getPageNumber(req.originalUrl, allUrls);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    const userEmail = req.session.currentUser;
    const handlebarsPage = urlsAndPages.handlebarsStaticPage;
    const perguntasUnconverted = allQuestions.filter( data => data.page === currentPage);
    console.log(`--- Current page: ${currentPage}. ReqSession data: ${userEmail} --- `);
    const perguntas = formatQuestions(perguntasUnconverted);

    Answer.findOne({userEmail: userEmail, currentPage: currentPage})
    .then((answer) => {
        console.log(`--- Below is the answer retrieved from db for: ${userEmail}: --- `);
        console.log(answer);
        if (answer != null) {
            console.log(`---- Answer is not null. userEmail is ${userEmail}. Current page is ${currentPage} ---- `);
            const questionIds = JSON.parse(answer.questionsIdSaved);
            const questionAnswersPartial = JSON.parse(answer.answersSaved);
            const deepCopyOfPerguntas = JSON.parse(JSON.stringify(perguntas));
            const perguntasWithUserAnswers = addUsersExistingsAnswers(deepCopyOfPerguntas, questionIds, questionAnswersPartial);
            const persistquestions = JSON.parse(JSON.stringify(perguntasWithUserAnswers));
            console.log(`--- Below is the first element of the Deep Copy containing ${userEmail} answers --`)
            console.log(persistquestions[0]);
            res.render(`${handlebarsPage}-persist`, { persistquestions, urlsAndPages });
        } else {
            console.log(`--- No answers saved for ${userEmail} yet so show blank answers: ---`);
            console.log(perguntas[0]);
            res.render(handlebarsPage, { perguntas, urlsAndPages });
        }})
        .catch((error) => {
            console.log(error);
    })
});

router.get('/task-2-part-2', (req, res) => {
    const currentPage = getPageNumber(req.originalUrl, allUrls);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    const userEmail = req.session.currentUser;
    const handlebarsPage = urlsAndPages.handlebarsStaticPage;
    const perguntasUnconverted = allQuestions.filter( data => data.page === currentPage);
    console.log(`--- Current page: ${currentPage}. ReqSession data: ${userEmail} --- `);
    const perguntas = formatQuestions(perguntasUnconverted);

    Answer.findOne({userEmail: userEmail, currentPage: currentPage})
    .then((answer) => {
        console.log(`--- Below is the answer retrieved from db for: ${userEmail}: --- `);
        console.log(answer);
        if (answer != null) {
            console.log(`---- Answer is not null. userEmail is ${userEmail}. Current page is ${currentPage} ---- `);
            const questionIds = JSON.parse(answer.questionsIdSaved);
            const questionAnswersPartial = JSON.parse(answer.answersSaved);
            const deepCopyOfPerguntas = JSON.parse(JSON.stringify(perguntas));
            const perguntasWithUserAnswers = addUsersExistingsAnswers(deepCopyOfPerguntas, questionIds, questionAnswersPartial);
            const persistquestions = JSON.parse(JSON.stringify(perguntasWithUserAnswers));
            console.log(`--- Below is the first element of the Deep Copy containing ${userEmail} answers --`)
            console.log(persistquestions[0]);
            res.render(`${handlebarsPage}-persist`, { persistquestions, urlsAndPages });
        } else {
            console.log(`--- No answers saved for ${userEmail} yet so show blank answers: ---`);
            console.log(perguntas[0]);
            res.render(handlebarsPage, { perguntas, urlsAndPages });
        }})
        .catch((error) => {
            console.log(error);
    })
});

router.get('/task-2-part-3', (req, res) => {
    const currentPage = getPageNumber(req.originalUrl, allUrls);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    const userEmail = req.session.currentUser;
    const handlebarsPage = urlsAndPages.handlebarsStaticPage;
    const perguntasUnconverted = allQuestions.filter( data => data.page === currentPage);
    console.log(`--- Current page: ${currentPage}. ReqSession data: ${userEmail} --- `);
    const perguntas = formatQuestions(perguntasUnconverted);


    Answer.findOne({userEmail: userEmail, currentPage: currentPage})
    .then((answer) => {
        console.log(`--- Below is the answer retrieved from db for: ${userEmail}: --- `);
        console.log(answer);
        if (answer != null) {
            console.log(`---- Answer is not null. userEmail is ${userEmail}. Current page is ${currentPage} ---- `);
            const questionIds = JSON.parse(answer.questionsIdSaved);
            const questionAnswersPartial = JSON.parse(answer.answersSaved);
            const deepCopyOfPerguntas = JSON.parse(JSON.stringify(perguntas));
            const perguntasWithUserAnswers = addUsersExistingsAnswers(deepCopyOfPerguntas, questionIds, questionAnswersPartial);
            const persistquestions = JSON.parse(JSON.stringify(perguntasWithUserAnswers));
            console.log(`--- Below is the first element of the Deep Copy containing ${userEmail} answers --`)
            console.log(persistquestions[0]);
            res.render(`${handlebarsPage}-persist`, { persistquestions, urlsAndPages });
        } else {
            console.log(`--- No answers saved for ${userEmail} yet so show blank answers: ---`);
            console.log(perguntas[0]);
            res.render(handlebarsPage, { perguntas, urlsAndPages });
        }})
        .catch((error) => {
            console.log(error);
    })
});

/* Added on 8 Feb */
router.get('/task-2-part-4', (req, res) => {
    const currentPage = getPageNumber(req.originalUrl, allUrls);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    const userEmail = req.session.currentUser;
    const handlebarsPage = urlsAndPages.handlebarsStaticPage;
    const perguntasUnconverted = allQuestions.filter( data => data.page === currentPage);
    console.log(`--- Current page: ${currentPage}. ReqSession data: ${userEmail} --- `);
    const perguntas = formatQuestions(perguntasUnconverted);

    Answer.findOne({userEmail: userEmail, currentPage: currentPage})
    .then((answer) => {
        console.log(`--- Below is the answer retrieved from db for: ${userEmail}: --- `);
        console.log(answer);
        if (answer != null) {
            console.log(`---- Answer is not null. userEmail is ${userEmail}. Current page is ${currentPage} ---- `);
            const questionIds = JSON.parse(answer.questionsIdSaved);
            const questionAnswersPartial = JSON.parse(answer.answersSaved);
            const deepCopyOfPerguntas = JSON.parse(JSON.stringify(perguntas));
            const perguntasWithUserAnswers = addUsersExistingsAnswers(deepCopyOfPerguntas, questionIds, questionAnswersPartial);
            const persistquestions = JSON.parse(JSON.stringify(perguntasWithUserAnswers));
            console.log(`--- Below is the first element of the Deep Copy containing ${userEmail} answers --`)
            console.log(persistquestions[0]);
            res.render(`${handlebarsPage}-persist`, { persistquestions, urlsAndPages });
        } else {
            console.log(`--- No answers saved for ${userEmail} yet so show blank answers: ---`);
            console.log(perguntas[0]);
            res.render(handlebarsPage, { perguntas, urlsAndPages });
        }})
        .catch((error) => {
            console.log(error);
    })
});

/* --- Post Routes for Task 2 --- */
router.post('/task-2-part-1a', (req, res) => {
    const currentPage = getPageNumber(req.originalUrl, allUrls);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    const dataForThisSheet = allQuestions.filter(data => data.page === currentPage);
    const perguntas = dataForThisSheet.filter (data => !data.heading);
    const createdAt = req._startTime;
    const userId = req.cookies.session;
    const userEmail = req.session.currentUser;
    const keysConvertedToNumbers = Object.keys(req.body).map(_element => parseInt(_element, 10));
    const answersObject = JSON.stringify(req.body);
    const questionsIdSaved = JSON.stringify(Object.values(keysConvertedToNumbers));
    const answersSaved = JSON.stringify(Object.values(req.body));
    const reqPath = req.route.path;
    // Declare variables for form validation (only applies to task-2-part-1a)
    const valuesAsString = Object.values(req.body).toString(); // Used for checking if student or no
    const includesBlank = answersObject.includes(`":""`);
    const numberOfQuestionsAnswered = Object.keys(req.body).length;

    if ( (numberOfQuestionsAnswered === perguntas.length && !includesBlank) || valuesAsString === 'I am a full time student' || valuesAsString === 'no' ) {
        Answer.updateOne( {userEmail: userEmail, currentPage: currentPage}, { $set:{ userId, userEmail, currentPage, reqPath, answersObject, questionsIdSaved, answersSaved, createdAt} }, { upsert: true })
        .then( (mongoUpdateResult) => {
            console.log(mongoUpdateResult);
            console.log(`--- Below is the Answer for ${userEmail} from page: ${reqPath}:`);
            console.log(answersObject);
            if (numberOfQuestionsAnswered === perguntas.length) {
                console.log(`--- ${userEmail} has been forwarded to ${urlsAndPages.nextPage} page becaue they are employed--- `)
                res.redirect(urlsAndPages.nextPage);
            } else {
                console.log(`--- ${userEmail} has skipped to page task-2-part-2' because they are full time student or unemployed --- `)
                console.log(`update the following question`);
                // As the user has skipped the next question, send a document to the db with answers marked as N/A
                Answer.updateOne( {userEmail: userEmail, currentPage: currentPage + 1}, { $set:{ userId: userId, userEmail: userEmail, currentPage: 10, reqPath: urlsAndPages.nextPage, answersObject: '{"21005":"N/A","21006":"N/A","21007":"N/A","21008":"N/A","21009":"N/A"}', questionsIdSaved: '[21005,21006,21007,21008,21009]', answersSaved: '["N/A","N/A","N/A","N/A","N/A"]', createdAt} }, { upsert: true })
                .then ( ( completingNextPageWithNa ) => {
                    console.log(completingNextPageWithNa);
                    res.redirect('/task-2-part-2'); // Skip the next question if the values are 'I am a full time student' or 'no'
                })
                .catch((error) => {
                    console.log(error);
                })                
            }
        })
        .catch((error) => {
            console.log(error);
        })
    } else {
            // Backend Form Validation failed so refresh page.
            res.redirect(req.originalUrl);
        }
    });

router.post('/task-2-part-1b', (req, res) => {
    const currentPage = getPageNumber(req.originalUrl, allUrls);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    const dataForThisSheet = allQuestions.filter(data => data.page === currentPage);
    const perguntas = dataForThisSheet.filter (data => !data.heading);
    const createdAt = req._startTime;
    const userId = req.cookies.session;
    const userEmail = req.session.currentUser;
    const keysConvertedToNumbers = Object.keys(req.body).map(_element => parseInt(_element, 10));
    const answersObject = JSON.stringify(req.body);
    const questionsIdSaved = JSON.stringify(Object.values(keysConvertedToNumbers));
    const answersSaved = JSON.stringify(Object.values(req.body));
    const reqPath = req.route.path;
    // Declare variable for form validation
    const includesBlank = answersObject.includes(`":""`);
    const numberOfQuestionsAnswered = Object.keys(req.body).length;

    if (numberOfQuestionsAnswered === perguntas.length && !includesBlank) {
        Answer.updateOne( {userEmail: userEmail, currentPage: currentPage}, { $set:{ userId, userEmail, currentPage, reqPath, answersObject, questionsIdSaved, answersSaved, createdAt} }, { upsert: true })
        .then( (mongoUpdateResult) => {
            console.log(mongoUpdateResult);
            console.log(`--- Below is the Answer for ${userEmail} from page: ${reqPath}:`);
            console.log(answersObject);
            res.redirect(urlsAndPages.nextPage);
        })
        .catch((error) => {
            console.log(error);
        })
    } else {
        res.redirect(req.originalUrl);
    }
});

router.post('/task-2-part-2', (req, res) => {
    const currentPage = getPageNumber(req.originalUrl, allUrls);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    const dataForThisSheet = allQuestions.filter(data => data.page === currentPage);
    const perguntas = dataForThisSheet.filter (data => !data.heading);
    const createdAt = req._startTime;
    const userId = req.cookies.session;
    const userEmail = req.session.currentUser;
    const keysConvertedToNumbers = Object.keys(req.body).map(_element => parseInt(_element, 10));
    const answersObject = JSON.stringify(req.body);
    const questionsIdSaved = JSON.stringify(Object.values(keysConvertedToNumbers));
    const answersSaved = JSON.stringify(Object.values(req.body));
    const reqPath = req.route.path;
    // Declare variable for form validation (just for task-2-part-2)
    const includesBlank = answersObject.includes(`":""`);
    const numberOfQuestionsAnswered = Object.keys(req.body).length;

    if (numberOfQuestionsAnswered === perguntas.length && !includesBlank) {
        Answer.updateOne( {userEmail: userEmail, currentPage: currentPage}, { $set:{ userId, userEmail, currentPage, reqPath, answersObject, questionsIdSaved, answersSaved, createdAt} }, { upsert: true })
        .then( (mongoUpdateResult) => {
            console.log(mongoUpdateResult);
            console.log(`--- Below is the Answer for ${userEmail} from page: ${reqPath}:`);
            console.log(answersObject);
            res.redirect(urlsAndPages.nextPage);
        })
        .catch((error) => {
            console.log(error);
        })
    } else {
        res.redirect(req.originalUrl);
    }
});

router.post('/task-2-part-3', (req, res) => {
    const currentPage = getPageNumber(req.originalUrl, allUrls);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    const dataForThisSheet = allQuestions.filter(data => data.page === currentPage);
    const perguntas = dataForThisSheet.filter (data => !data.heading);
    const createdAt = req._startTime;
    const userId = req.cookies.session;
    const userEmail = req.session.currentUser;
    const keysConvertedToNumbers = Object.keys(req.body).map(_element => parseInt(_element, 10));
    const answersObject = JSON.stringify(req.body);
    const questionsIdSaved = JSON.stringify(Object.values(keysConvertedToNumbers));
    const answersSaved = JSON.stringify(Object.values(req.body));
    const reqPath = req.route.path;
    // Declare variables for form validation (only for task-2-part-3). These variables contain user's answers and are part of the form validation in the if statement below
    const numberOfQuestionsAnswered = Object.keys(req.body).length;
    const valuesAsString = Object.values(req.body).toString();
    const includesNo = valuesAsString.includes("0-no");
    console.log(`--- ${userEmail} has answered ${numberOfQuestionsAnswered} questions`);
    console.log(`---  ValuesAsString: ${valuesAsString}. IncludesNo: ${includesNo}.`);

    if (
        (numberOfQuestionsAnswered === perguntas.length) || 
        (numberOfQuestionsAnswered === 2 && valuesAsString === '0-no,0-no') || 
        (numberOfQuestionsAnswered === 3 && includesNo) ) 
        {
        Answer.updateOne( {userEmail: userEmail, currentPage: currentPage}, { $set:{ userId, userEmail, currentPage, reqPath, answersObject, questionsIdSaved, answersSaved, createdAt} }, { upsert: true })
        .then( (mongoUpdateResult) => {
            console.log(mongoUpdateResult);
            console.log(`--- Below is the Answer for ${userEmail} from page: ${reqPath}:`);
            console.log(answersObject);
            res.redirect(urlsAndPages.nextPage);
        })
        .catch((error) => {
            console.log(error);
        })
    } else {
        res.redirect(req.originalUrl);
    }
});

/* Added on 8 Feb */
router.post('/task-2-part-4', (req, res) => {
    const currentPage = getPageNumber(req.originalUrl, allUrls);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    const dataForThisSheet = allQuestions.filter(data => data.page === currentPage);
    const perguntas = dataForThisSheet.filter (data => !data.heading);
    const createdAt = req._startTime;
    const userId = req.cookies.session;
    const userEmail = req.session.currentUser;
    const keysConvertedToNumbers = Object.keys(req.body).map(_element => parseInt(_element, 10));
    const answersObject = JSON.stringify(req.body);
    const questionsIdSaved = JSON.stringify(Object.values(keysConvertedToNumbers));
    const answersSaved = JSON.stringify(Object.values(req.body));
    const reqPath = req.route.path;
    // Declare variable for form validation (just for task-2-part-4)
    const includesBlank = answersObject.includes(`":""`);
    const numberOfQuestionsAnswered = Object.keys(req.body).length;

    if (numberOfQuestionsAnswered === perguntas.length && !includesBlank) {
        Answer.updateOne( {userEmail: userEmail, currentPage: currentPage}, { $set:{ userId, userEmail, currentPage, reqPath, answersObject, questionsIdSaved, answersSaved, createdAt} }, { upsert: true })
        .then( (mongoUpdateResult) => {
            console.log(mongoUpdateResult);
            console.log(`--- Below is the Answer for ${userEmail} from page: ${reqPath}:`);
            console.log(answersObject);
            res.redirect(urlsAndPages.nextPage);
        })
        .catch((error) => {
            console.log(error);
        })
    } else {
        res.redirect(req.originalUrl);
    }
});

/* Task Three Routes Below */
router.get('/task-3-1a', (req, res) => {
    const currentPage = getPageNumber(req.originalUrl, allUrls);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    const userEmail = req.session.currentUser;
    const handlebarsPage = urlsAndPages.handlebarsStaticPage;   
    const dataForThisSheet = allQuestions.filter( data => data.page === currentPage);
    const sheetsSituations = dataForThisSheet.filter (data => data.scenario);
    const heading = dataForThisSheet.filter (data => data.heading);
    console.log(`--- Current page: ${currentPage}. ReqSession data: ${userEmail} --- `);
    const perguntas = dataForThisSheet.filter (data => data.radio);


    Answer.findOne({userEmail: userEmail, currentPage: currentPage})
    .then((answer) => {
        console.log(`--- Below is the answer retrieved from db for: ${userEmail}: --- `);
        console.log(answer);
        if (answer != null) {
        console.log(`---- Answer is not null. userEmail is ${userEmail}. Current page is ${currentPage} ---- `);
        const questionIds = JSON.parse(answer.questionsIdSaved);
        const questionAnswersPartial = JSON.parse(answer.answersSaved);
        const deepCopyOfPerguntas = JSON.parse(JSON.stringify(perguntas));
        const perguntasWithUserAnswers = addUsersExistingsAnswers(deepCopyOfPerguntas, questionIds, questionAnswersPartial);
        const persistquestions = JSON.parse(JSON.stringify(perguntasWithUserAnswers));
        res.render(`${handlebarsPage}-persist`, { heading, sheetsSituations, persistquestions, urlsAndPages });
    } else {
        console.log(`--- No answers saved for ${userEmail} yet so show blank answers: ---`);
        console.log(perguntas[0]);
        res.render(handlebarsPage, { heading, sheetsSituations, perguntas, urlsAndPages });
    }})
    .catch((error) => {
        console.log(error);
})});

router.post('/task-3-1a', (req, res) => {
    const currentPage = getPageNumber(req.originalUrl, allUrls);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    const dataForThisSheet = allQuestions.filter(data => data.page === currentPage);
    const radios = dataForThisSheet.filter (data => data.radio);
    const createdAt = req._startTime;
    const userId = req.cookies.session;
    const userEmail = req.session.currentUser;
    const keysConvertedToNumbers = Object.keys(req.body).map(_element => parseInt(_element, 10));
    const answersObject = JSON.stringify(req.body);
    const questionsIdSaved = JSON.stringify(Object.values(keysConvertedToNumbers)); 
    const answersSaved = JSON.stringify(Object.values(req.body));
    const reqPath = req.route.path;
    const numberOfQuestionsAnswered = Object.keys(req.body).length;

    if (numberOfQuestionsAnswered === radios.length) {
        Answer.updateOne( {userEmail: userEmail, currentPage: currentPage}, { $set:{ userId, userEmail, currentPage, reqPath, answersObject, questionsIdSaved, answersSaved, createdAt} }, { upsert: true })
        .then( (mongoUpdateResult) => {
            console.log(mongoUpdateResult);
            console.log(`--- Below is the Answer for ${userEmail} from page: ${reqPath}:`);
            console.log(answersObject);
            res.redirect(urlsAndPages.nextPage);
        })
        .catch((error) => {
            console.log(error);
        })
    } else {
        res.redirect(req.originalUrl);
    }
});

router.get('/task-3-1b', (req, res) => {
    const currentPage = getPageNumber(req.originalUrl, allUrls);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    const userEmail = req.session.currentUser;
    const handlebarsPage = urlsAndPages.handlebarsStaticPage;   
    const dataForThisSheet = allQuestions.filter( data => data.page === currentPage);
    const sheetsSituations = dataForThisSheet.filter (data => data.scenario);
    const heading = dataForThisSheet.filter (data => data.heading);
    console.log(`--- Current page: ${currentPage}. ReqSession data: ${userEmail} --- `);
    const perguntas = dataForThisSheet.filter (data => data.radio);

    Answer.findOne({userEmail: userEmail, currentPage: currentPage})
    .then((answer) => {
        console.log(`--- Below is the answer retrieved from db for: ${userEmail}: --- `);
        console.log(answer);
        if (answer != null) {
        console.log(`---- Answer is not null. userEmail is ${userEmail}. Current page is ${currentPage} ---- `);
        const questionIds = JSON.parse(answer.questionsIdSaved);
        const questionAnswersPartial = JSON.parse(answer.answersSaved);
        const deepCopyOfPerguntas = JSON.parse(JSON.stringify(perguntas));
        const perguntasWithUserAnswers = addUsersExistingsAnswers(deepCopyOfPerguntas, questionIds, questionAnswersPartial);
        const persistquestions = JSON.parse(JSON.stringify(perguntasWithUserAnswers));
        res.render(`${handlebarsPage}-persist`, { heading, sheetsSituations, persistquestions, urlsAndPages });
    } else {
        console.log(`--- No answers saved for ${userEmail} yet so show blank answers: ---`);
        console.log(perguntas[0]);
        res.render(handlebarsPage, { heading, sheetsSituations, perguntas, urlsAndPages });
    }})
    .catch((error) => {
        console.log(error);
})});

router.post('/task-3-1b', (req, res) => {
    const currentPage = getPageNumber(req.originalUrl, allUrls);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    const dataForThisSheet = allQuestions.filter(data => data.page === currentPage);
    const radios = dataForThisSheet.filter (data => data.radio);
    const createdAt = req._startTime;
    const userId = req.cookies.session;
    const userEmail = req.session.currentUser;
    const keysConvertedToNumbers = Object.keys(req.body).map(_element => parseInt(_element, 10));
    const answersObject = JSON.stringify(req.body);
    const questionsIdSaved = JSON.stringify(Object.values(keysConvertedToNumbers)); 
    const answersSaved = JSON.stringify(Object.values(req.body));
    const reqPath = req.route.path;
    const numberOfQuestionsAnswered = Object.keys(req.body).length;

    if (numberOfQuestionsAnswered === radios.length) {
        Answer.updateOne( {userEmail: userEmail, currentPage: currentPage}, { $set:{ userId, userEmail, currentPage, reqPath, answersObject, questionsIdSaved, answersSaved, createdAt} }, { upsert: true })
        .then( (mongoUpdateResult) => {
            console.log(mongoUpdateResult);
            console.log(`--- Below is the Answer for ${userEmail} from page: ${reqPath}:`);
            console.log(answersObject);
            res.redirect(urlsAndPages.nextPage);
        })
        .catch((error) => {
            console.log(error);
        })
    } else {
        res.redirect(req.originalUrl);
    }
});

router.get('/task-3-2a', (req, res) => {
    const currentPage = getPageNumber(req.originalUrl, allUrls);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    const userEmail = req.session.currentUser;
    const handlebarsPage = urlsAndPages.handlebarsStaticPage;   
    const dataForThisSheet = allQuestions.filter( data => data.page === currentPage);
    const sheetsSituations = dataForThisSheet.filter (data => data.scenario);
    const heading = dataForThisSheet.filter (data => data.heading);
    console.log(`--- Current page: ${currentPage}. ReqSession data: ${userEmail} --- `);
    const perguntas = dataForThisSheet.filter (data => data.radio);


    Answer.findOne({userEmail: userEmail, currentPage: currentPage})
    .then((answer) => {
        console.log(`--- Below is the answer retrieved from db for: ${userEmail}: --- `);
        console.log(answer);
        if (answer != null) {
        console.log(`---- Answer is not null. userEmail is ${userEmail}. Current page is ${currentPage} ---- `);
        const questionIds = JSON.parse(answer.questionsIdSaved);
        const questionAnswersPartial = JSON.parse(answer.answersSaved);
        const deepCopyOfPerguntas = JSON.parse(JSON.stringify(perguntas));
        const perguntasWithUserAnswers = addUsersExistingsAnswers(deepCopyOfPerguntas, questionIds, questionAnswersPartial);
        const persistquestions = JSON.parse(JSON.stringify(perguntasWithUserAnswers));
        res.render(`${handlebarsPage}-persist`, { heading, sheetsSituations, persistquestions, urlsAndPages });
    } else {
        console.log(`--- No answers saved for ${userEmail} yet so show blank answers: ---`);
        console.log(perguntas[0]);
        res.render(handlebarsPage, { heading, sheetsSituations, perguntas, urlsAndPages });
    }})
    .catch((error) => {
        console.log(error);
})});

router.post('/task-3-2a', (req, res) => {
    const currentPage = getPageNumber(req.originalUrl, allUrls);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    const dataForThisSheet = allQuestions.filter(data => data.page === currentPage);
    const radios = dataForThisSheet.filter (data => data.radio);
    const createdAt = req._startTime;
    const userId = req.cookies.session;
    const userEmail = req.session.currentUser;
    const keysConvertedToNumbers = Object.keys(req.body).map(_element => parseInt(_element, 10));
    const answersObject = JSON.stringify(req.body);
    const questionsIdSaved = JSON.stringify(Object.values(keysConvertedToNumbers)); 
    const answersSaved = JSON.stringify(Object.values(req.body));
    const reqPath = req.route.path;
    const numberOfQuestionsAnswered = Object.keys(req.body).length;

    if (numberOfQuestionsAnswered === radios.length) {
        Answer.updateOne( {userEmail: userEmail, currentPage: currentPage}, { $set:{ userId, userEmail, currentPage, reqPath, answersObject, questionsIdSaved, answersSaved, createdAt} }, { upsert: true })
        .then( (mongoUpdateResult) => {
            console.log(mongoUpdateResult);
            console.log(`--- Below is the Answer for ${userEmail} from page: ${reqPath}:`);
            console.log(answersObject);
            res.redirect(urlsAndPages.nextPage);
        })
        .catch((error) => {
            console.log(error);
        })
    } else {
        res.redirect(req.originalUrl);
    }
});

router.get('/task-3-2b', (req, res) => {
    const currentPage = getPageNumber(req.originalUrl, allUrls);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    const userEmail = req.session.currentUser;
    const handlebarsPage = urlsAndPages.handlebarsStaticPage;   
    const dataForThisSheet = allQuestions.filter( data => data.page === currentPage);
    const sheetsSituations = dataForThisSheet.filter (data => data.scenario);
    const heading = dataForThisSheet.filter (data => data.heading);
    console.log(`--- Current page: ${currentPage}. ReqSession data: ${userEmail} --- `);
    const perguntas = dataForThisSheet.filter (data => data.radio);


    Answer.findOne({userEmail: userEmail, currentPage: currentPage})
    .then((answer) => {
        console.log(`--- Below is the answer retrieved from db for: ${userEmail}: --- `);
        console.log(answer);
        if (answer != null) {
        console.log(`---- Answer is not null. userEmail is ${userEmail}. Current page is ${currentPage} ---- `);
        const questionIds = JSON.parse(answer.questionsIdSaved);
        const questionAnswersPartial = JSON.parse(answer.answersSaved);
        const deepCopyOfPerguntas = JSON.parse(JSON.stringify(perguntas));
        const perguntasWithUserAnswers = addUsersExistingsAnswers(deepCopyOfPerguntas, questionIds, questionAnswersPartial);
        const persistquestions = JSON.parse(JSON.stringify(perguntasWithUserAnswers));
        res.render(`${handlebarsPage}-persist`, { heading, sheetsSituations, persistquestions, urlsAndPages });
    } else {
        console.log(`--- No answers saved for ${userEmail} yet so show blank answers: ---`);
        console.log(perguntas[0]);
        res.render(handlebarsPage, { heading, sheetsSituations, perguntas, urlsAndPages });
    }})
    .catch((error) => {
        console.log(error);
})});

router.post('/task-3-2b', (req, res) => {
    const currentPage = getPageNumber(req.originalUrl, allUrls);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    const dataForThisSheet = allQuestions.filter(data => data.page === currentPage);
    const radios = dataForThisSheet.filter (data => data.radio);
    const createdAt = req._startTime;
    const userId = req.cookies.session;
    const userEmail = req.session.currentUser;
    const keysConvertedToNumbers = Object.keys(req.body).map(_element => parseInt(_element, 10));
    const answersObject = JSON.stringify(req.body);
    const questionsIdSaved = JSON.stringify(Object.values(keysConvertedToNumbers)); 
    const answersSaved = JSON.stringify(Object.values(req.body));
    const reqPath = req.route.path;
    const numberOfQuestionsAnswered = Object.keys(req.body).length;

    if (numberOfQuestionsAnswered === radios.length) {
        Answer.updateOne( {userEmail: userEmail, currentPage: currentPage}, { $set:{ userId, userEmail, currentPage, reqPath, answersObject, questionsIdSaved, answersSaved, createdAt} }, { upsert: true })
        .then( (mongoUpdateResult) => {
            console.log(mongoUpdateResult);
            console.log(`--- Below is the Answer for ${userEmail} from page: ${reqPath}:`);
            console.log(answersObject);
            res.redirect(urlsAndPages.nextPage);
        })
        .catch((error) => {
            console.log(error);
        })
    } else {
        res.redirect(req.originalUrl);
    }
});

router.get('/task-3-3a', (req, res) => {
    const currentPage = getPageNumber(req.originalUrl, allUrls);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    const userEmail = req.session.currentUser;
    const handlebarsPage = urlsAndPages.handlebarsStaticPage;   
    const dataForThisSheet = allQuestions.filter( data => data.page === currentPage);
    const sheetsSituations = dataForThisSheet.filter (data => data.scenario);
    const heading = dataForThisSheet.filter (data => data.heading);
    console.log(`--- Current page: ${currentPage}. ReqSession data: ${userEmail} --- `);
    const perguntas = dataForThisSheet.filter (data => data.radio);


    Answer.findOne({userEmail: userEmail, currentPage: currentPage})
    .then((answer) => {
        console.log(`--- Below is the answer retrieved from db for: ${userEmail}: --- `);
        console.log(answer);
        if (answer != null) {
        console.log(`---- Answer is not null. userEmail is ${userEmail}. Current page is ${currentPage} ---- `);
        const questionIds = JSON.parse(answer.questionsIdSaved);
        const questionAnswersPartial = JSON.parse(answer.answersSaved);
        const deepCopyOfPerguntas = JSON.parse(JSON.stringify(perguntas));
        const perguntasWithUserAnswers = addUsersExistingsAnswers(deepCopyOfPerguntas, questionIds, questionAnswersPartial);
        const persistquestions = JSON.parse(JSON.stringify(perguntasWithUserAnswers));
        res.render(`${handlebarsPage}-persist`, { heading, sheetsSituations, persistquestions, urlsAndPages });
    } else {
        console.log(`--- No answers saved for ${userEmail} yet so show blank answers: ---`);
        console.log(perguntas[0]);
        res.render(handlebarsPage, { heading, sheetsSituations, perguntas, urlsAndPages });
    }})
    .catch((error) => {
        console.log(error);
})});

router.post('/task-3-3a', (req, res) => {
    const currentPage = getPageNumber(req.originalUrl, allUrls);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    const dataForThisSheet = allQuestions.filter(data => data.page === currentPage);
    const radios = dataForThisSheet.filter (data => data.radio);
    const createdAt = req._startTime;
    const userId = req.cookies.session;
    const userEmail = req.session.currentUser;
    const keysConvertedToNumbers = Object.keys(req.body).map(_element => parseInt(_element, 10));
    const answersObject = JSON.stringify(req.body);
    const questionsIdSaved = JSON.stringify(Object.values(keysConvertedToNumbers)); 
    const answersSaved = JSON.stringify(Object.values(req.body));
    const reqPath = req.route.path;
    const numberOfQuestionsAnswered = Object.keys(req.body).length;

    if (numberOfQuestionsAnswered === radios.length) {
        Answer.updateOne( {userEmail: userEmail, currentPage: currentPage}, { $set:{ userId, userEmail, currentPage, reqPath, answersObject, questionsIdSaved, answersSaved, createdAt} }, { upsert: true })
        .then( (mongoUpdateResult) => {
            console.log(mongoUpdateResult);
            console.log(`--- Below is the Answer for ${userEmail} from page: ${reqPath}:`);
            console.log(answersObject);
            res.redirect(urlsAndPages.nextPage);
        })
        .catch((error) => {
            console.log(error);
        })
    } else {
        res.redirect(req.originalUrl);
    }
});

router.get('/task-3-3b', (req, res) => {
    const currentPage = getPageNumber(req.originalUrl, allUrls);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    const userEmail = req.session.currentUser;
    const handlebarsPage = urlsAndPages.handlebarsStaticPage;   
    const dataForThisSheet = allQuestions.filter( data => data.page === currentPage);
    const sheetsSituations = dataForThisSheet.filter (data => data.scenario);
    const heading = dataForThisSheet.filter (data => data.heading);
    console.log(`--- Current page: ${currentPage}. ReqSession data: ${userEmail} --- `);
    const perguntas = dataForThisSheet.filter (data => data.radio);


    Answer.findOne({userEmail: userEmail, currentPage: currentPage})
    .then((answer) => {
        console.log(`--- Below is the answer retrieved from db for: ${userEmail}: --- `);
        console.log(answer);
        if (answer != null) {
        console.log(`---- Answer is not null. userEmail is ${userEmail}. Current page is ${currentPage} ---- `);
        const questionIds = JSON.parse(answer.questionsIdSaved);
        const questionAnswersPartial = JSON.parse(answer.answersSaved);
        const deepCopyOfPerguntas = JSON.parse(JSON.stringify(perguntas));
        const perguntasWithUserAnswers = addUsersExistingsAnswers(deepCopyOfPerguntas, questionIds, questionAnswersPartial);
        const persistquestions = JSON.parse(JSON.stringify(perguntasWithUserAnswers));
        res.render(`${handlebarsPage}-persist`, { heading, sheetsSituations, persistquestions, urlsAndPages });
    } else {
        console.log(`--- No answers saved for ${userEmail} yet so show blank answers: ---`);
        console.log(perguntas[0]);
        res.render(handlebarsPage, { heading, sheetsSituations, perguntas, urlsAndPages });
    }})
    .catch((error) => {
        console.log(error);
})});

/* 
This last route differs from the previous route as it is the page where the user will submit the "final answer" 
The post request will retrieve all the saved data under the user's name from the db
It will then create a new object (FinalAnsSubmitted and send that to a different collection in the db) 
*/

router.post('/task-3-3b', (req, res) => {
    const currentPage = getPageNumber(req.originalUrl, allUrls);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    const dataForThisSheet = allQuestions.filter(data => data.page === currentPage);
    const radios = dataForThisSheet.filter (data => data.radio);
    const createdAt = req._startTime;
    const userId = req.cookies.session;
    const userEmail = req.session.currentUser;
    const keysConvertedToNumbers = Object.keys(req.body).map(_element => parseInt(_element, 10));
    const answersObject = JSON.stringify(req.body);
    const questionsIdSaved = JSON.stringify(Object.values(keysConvertedToNumbers)); 
    const answersSaved = JSON.stringify(Object.values(req.body));
    const reqPath = req.route.path;
    const numberOfQuestionsAnswered = Object.keys(req.body).length;

    // (1) Save the answers for this page (task-3-3b)
    if (numberOfQuestionsAnswered === radios.length) {
        Answer.updateOne( {userEmail: userEmail, currentPage: currentPage}, { $set:{ userId, userEmail, currentPage, reqPath, answersObject, questionsIdSaved, answersSaved, createdAt} }, { upsert: true })
        .then( (mongoUpdateResult) => {
            console.log(mongoUpdateResult);
            console.log(`--- Below is the Answer for ${userEmail} from page: ${reqPath}:`);
            console.log(answersObject);
            console.log(`--- ${userEmail} has now completed the survey so we can submit final answers`);
    // (2) Retrieve all the answers for this user
        Answer.find({userEmail: userEmail})
        .then( (allData) => {
            const arrayOfAllAns = allData;
            const length = arrayOfAllAns.length;
            const answersSavedArray = [];
            const times = [];
                for (i = 0; i < length; i++) {
                    // Include if statement to prevent loop from trying to parse the data from pages that did not contain any questions (e.g. the instructions pages) 
                    if (typeof arrayOfAllAns[i].answersObject !== "undefined") {
                            let ansExtracted = JSON.parse(arrayOfAllAns[i].answersObject);
                            answersSavedArray.push(ansExtracted);
                    }
                    const objectForTimings =
                    {
                        pageNumber: arrayOfAllAns[i].currentPage,
                        pageUrl: arrayOfAllAns[i].reqPath, 
                        nextButtonClicked: arrayOfAllAns[i].createdAt,
                    }                        
                    times.push(objectForTimings);
                }
            totalPagesofAnswers = answersSavedArray.length;
            const timesWithDelta = times.map( (data, index) => {
                if (index > 0) {
                    times[index].previousPage = times[index - 1].pageUrl;
                    times[index].previousPageNextButtonClicked = times[index - 1].nextButtonClicked;
                    const startTime = times[index].previousPageNextButtonClicked;
                    const endTime = times[index].nextButtonClicked;
                    times[index].secondsSpentOnThisPage = (Date.parse(endTime) - Date.parse(startTime)) / 1000;
                } 
                return data;
            })
            const timesOfAnswers = JSON.stringify(timesWithDelta);
            const answersSaved = JSON.stringify(answersSavedArray);
                // (3) Submit the final answers for this user
                FinalAnsSubmitted.updateOne( {userEmail: userEmail}, { $set:{ userId, userEmail, answersSaved, timesOfAnswers, totalPagesofAnswers} }, { upsert: true })
                .then ( (finalAnswersMongoMsg) => {
                    console.log(answersSaved);
                    console.log(`--- ^^^ Final answer for ${userEmail} saved as above. Total number of answers was ${totalPagesofAnswers} ^^^`);
                    console.log(finalAnswersMongoMsg);
                    res.redirect(urlsAndPages.nextPage);
                })
                .catch((error) => { // Close then & create catch for (3) Submitting final answer
                    console.log(error);
                })
            }) // Close then & create catch for (2) Retrieving all the answers for this user
            .catch((error) => {
                console.log(error);
            })
        }) // Close then & create catch for (1) Saving answers for this page
        .catch((error) => { 
            console.log(error);
        })
        // Backend form validation will refresh page
        } else {
            console.log(`--- ${userEmail} has not submitted enough questions on this page --- `)
            res.redirect(req.originalUrl);
        }
});
        
router.get('/study-conclusion', (req, res) => {

    const currentPage = getPageNumber(req.originalUrl, allUrls);
    // Create variable which will be sent to Handlebars page after redemCode is fetched from db
    // Note, as of 7 Feb, this page no longer presents the user with the Amazon voucher.
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    const handlebarsPage = urlsAndPages.handlebarsStaticPage;

    res.render(handlebarsPage);

});

router.post('/study-conclusion', (req, res) => {

    const userId = req.cookies.session;
    const userEmail = req.session.currentUser;
    const createdAt = req._startTime;
    const userPaymentPref = req.body.compbutton;

    const paymentPreffo = new UserPaymentPref ( { userId, userEmail, userPaymentPref, createdAt } );

    paymentPreffo.save()
    .then( (answer) => {
        if (userPaymentPref == 'amazon') {
            console.log(answer);

            res.redirect("/compensation-amazon");
        } else {
            console.log(answer);
            res.redirect("/compensation-cash");
        }
    })
    .catch((error) => {
        console.log(error);
    })

});

router.get('/compensation-cash', (req, res) => {
    const currentPage = getPageNumber(req.originalUrl, allUrls);
    const dataForThisSheet = allQuestions.filter( data => data.page === currentPage);
    const infos = dataForThisSheet.filter (data => data.info);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    const handlebarsPage = urlsAndPages.handlebarsStaticPage;

    res.render(handlebarsPage, { infos, urlsAndPages });
});


router.get('/compensation-amazon', (req, res) => {

    // Create variable which will be sent to Handlebars page after redemCode is fetched from db

    const currentPage = getPageNumber(req.originalUrl, allUrls);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    const handlebarsPage = urlsAndPages.handlebarsStaticPage;
    const userEmail = req.session.currentUser

    res.render(handlebarsPage, { userEmail });

    /*
    // Only use for MTurkers test
    // Tell db to update the status of redem code from 'inUse' to 'redemCodeIssued'
    Mturk.updateOne( { uniqueId : req.session.currentUser }, { $set: { status: "4-redemCodeIssued" }})
        .then( () => {
            // Retrieve the updated redem code object from db
            Mturk.findOne( { uniqueId : req.session.currentUser} )
                .then( ( updatedRedemData ) => {
                    // Create variable and assign it to reqsession
                    // req.session.redemptionCode = updatedRedemData.redemCode;
                    // Render page with reqsession variable. reqsession variable contains redem code which will appear on screen
                    
                })
                .catch((error) => {
                    console.log(error)
                });
        })
        .catch((error) => {
            console.log(error);
    });
    */
});

/* --- The feedback page is only required for the MTurk version --- */
router.get('/feedback-page', (req, res) => {
    const currentPage = getPageNumber(req.originalUrl, allUrls);
    const dataForThisSheet = allQuestions.filter( data => data.page === currentPage);
    const infos = dataForThisSheet.filter (data => data.info);
    const perguntas = dataForThisSheet.filter (data => !data.info);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    const handlebarsPage = urlsAndPages.handlebarsStaticPage;

    res.render(handlebarsPage, { infos, perguntas, urlsAndPages });
});

router.post('/feedback-page', (req, res) => {
    const currentPage = getPageNumber(req.originalUrl, allUrls);
    const dataForThisSheet = allQuestions.filter( data => data.page === currentPage);
    const createdAt = req._startTime;
    const answersObject = JSON.stringify(req.body);
    const userId = req.cookies.session;
    const keysConvertedToNumbers = Object.keys(req.body).map(_element => parseInt(_element, 10));
    const questionsIdSaved = JSON.stringify(Object.values(keysConvertedToNumbers));
    const answersSaved = JSON.stringify(Object.values(req.body));
    const userEmail = req.session.currentUser;
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    const perguntas = dataForThisSheet.filter (data => !data.info);
    const feedbackFromMTurker = new MTurkFeedback ( { userId, userEmail, currentPage, answersObject, questionsIdSaved, answersSaved, createdAt} );

    // Temp hack as this is a temp page
    /* This hack performs a flawed validation check to see that the user has answered at least 2 questions. It's flawed because there are more than 2 questions but 2 out of 4 questions could be skipped. It was not worth the time to set up flawless logic as this test was only given to 10 MTurkers */
    if (Object.keys(req.body).length > (perguntas.length - 2)) {
        Answer.deleteMany({userEmail: userEmail, currentPage: currentPage})
        .then((answer) => {
            console.log(answer);
            feedbackFromMTurker.save()
            .then( (answer) => {
                console.log(`Answer saved to database: ${answer}`);
                res.redirect(urlsAndPages.nextPage);
            })
            .catch((error) => {
                console.log(error);
            })
})}});

module.exports = router;