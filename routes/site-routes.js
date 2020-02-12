const express = require("express");
const router = express.Router();
const Answer = require('../models/answerLowerCase2.js');
const FinalAnsSubmitted = require('../models/finalAnsSubmitted2.js');
const MTurkFeedback = require('../models/mTurkFeedback2.js');
const Mturk = require('../models/mTurk2.js');
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
                    req.session.currentUser = email;
                    res.redirect("instructions-1");
                    })
            .catch((error) => {
                console.log(error)
            });
        }})
});

/* --- Example Below --- */
router.post('/', (req, res) => {
    const firstName = req.body.firstNameOnLogin;
    const familyName = req.body.familyNameOnLogin;
    const email = req.body.emailOnLogin;

    User.findOne({ "email": email })
      .then(user => {
        if (user !== null) {
          res.render('index.hbs', {
            errorMessage1: "The email address you have entered is already registered.",
            errorMessage2: "Click Resume Survey if you would like to continue from where you left off."
          });
          return;
        }

        User.create({
            firstName,
            familyName,
            email
          })
          .then(() => {
            console.log(`user with email ${email} created`);
            req.session.currentUser = email;
            res.redirect("study-consent");
          })
          .catch(error => {
            console.log(error);
          })
      })
      .catch(error => {
        next(error);
      })
});

/* --- End of Example --- */

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


/* --- Mezzanine Post Routes - Added on 29 Jan --- */
/* --- Need refactoring along with instructions post routes to avoid repetition --- */

/* --- TASK ONE ROUTES --- */
router.get('/task-1-part-1', (req, res) => {
    const currentPage = getPageNumber(req.originalUrl, allUrls);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    const userEmail = req.session.currentUser;
    const handlebarsPage = urlsAndPages.handlebarsStaticPage;
    const dataForThisSheet = allQuestions.filter( data => data.page === currentPage);
    const heading = dataForThisSheet.filter (data => data.heading);
    let perguntas = dataForThisSheet.filter (data => data.radio);

    Answer.findOne({userEmail: userEmail, currentPage: currentPage})
    .then((answer) => {
        if (answer !== null) {
            console.log(`---- userEmail is ${userEmail}. Current page is ${currentPage} ---- `);
            console.log(answer);
            console.log(`-- text above is answer retrieved from db for: ${userEmail} ---`);
            const questionIds = JSON.parse(answer.questionsIdSaved);
            const questionAnswersPartial = JSON.parse(answer.answersSaved);
            const perguntasWithUserAnswers = addUsersExistingsAnswers(perguntas, questionIds, questionAnswersPartial);
            perguntas = perguntasWithUserAnswers;
            res.render(handlebarsPage, { perguntas, heading, urlsAndPages });
        } else {
            console.log(`no answers saved for ${userEmail} yet`);
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
    const userEmail = req.session.currentUser;
    const handlebarsPage = urlsAndPages.handlebarsStaticPage;
    const dataForThisSheet = allQuestions.filter( data => data.page === currentPage);
    const heading = dataForThisSheet.filter (data => data.heading);
    let perguntas = dataForThisSheet.filter (data => data.radio);
    Answer.findOne({userEmail: userEmail, currentPage: currentPage})
    .then((answer) => {
        if (answer !== null) {
            console.log(`---- userEmail is ${userEmail}. Current page is ${currentPage} ---- `);
            console.log(answer);
            console.log(`-- text above is answer retrieved from db for: ${userEmail} ---`);
            const questionIds = JSON.parse(answer.questionsIdSaved);
            const questionAnswersPartial = JSON.parse(answer.answersSaved);
            perguntasWithUserAnswers = addUsersExistingsAnswers(perguntas, questionIds, questionAnswersPartial);
            perguntas = perguntasWithUserAnswers;
            res.render(handlebarsPage, { perguntas, heading, urlsAndPages });
        } else {
            console.log(`no answers saved for ${userEmail} yet`);
            res.render(handlebarsPage, { perguntas, heading, urlsAndPages });
        }
    })
    .catch((error) => {
        console.log(error);
    })
});

router.post('/task-1-part-1', (req, res) => {
    // Declare variables to store currentPage, which will be used to to retrieve questions from db
    const currentPage = getPageNumber(req.originalUrl, allUrls);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);

    const createdAt = req._startTime;
    const userId = req.cookies.session;
    const userEmail = req.session.currentUser;

    const keysConvertedToNumbers = Object.keys(req.body).map(_element => parseInt(_element, 10));
    const answersObject = JSON.stringify(req.body);
    const questionsIdSaved = JSON.stringify(Object.values(keysConvertedToNumbers)); // Convert to string, otherwise MongoDB will not store the data
    const answersSaved = JSON.stringify(Object.values(req.body));
    const dataForThisSheet = allQuestions.filter(data => data.page === currentPage);
    const perguntas = dataForThisSheet.filter (data => !data.heading);

    const reqRemoteAddress = req._remoteAddress;
    const reqPath = req.route.path;
    const newQuestionSubmittedByUser = new Answer ( { userId, userEmail, currentPage, reqPath, reqRemoteAddress, answersObject, questionsIdSaved, answersSaved, createdAt} );

    if (Object.keys(req.body).length === perguntas.length) {
        Answer.deleteMany({userEmail: userEmail, currentPage: currentPage})
        .then(() => {
            newQuestionSubmittedByUser.save()
            .then( (notCurrentlyUsed) => {
                res.redirect(urlsAndPages.nextPage);
            })
            .catch((error) => {
                console.log(error);
            })
})}});


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

    /* Next three lines are new as of Jan 29. They provide more information to help calculate how long a user spends on each question */
    const reqRemoteAddress = req._remoteAddress;
    const reqPath = req.route.path;
    const newQuestionSubmittedByUser = new Answer ( { userId, userEmail, currentPage, reqPath, reqRemoteAddress, answersObject, questionsIdSaved, answersSaved, createdAt} );

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
            perguntas = perguntasWithUserAnswers;
            console.log(perguntas);
            res.render(handlebarsPage, { perguntas, urlsAndPages });
        } else {
            console.log(`no answers saved for ${userEmail} yet`);
            console.log(perguntas);
            res.render(handlebarsPage, { perguntas, urlsAndPages });
        }})
        .catch((error) => {
            console.log(error);
    })
});

/* Added on 8 Feb */
router.get('/task-2-part-4', (req, res) => {
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
            console.log(perguntas);
            res.render(handlebarsPage, { perguntas, urlsAndPages });
        } else {
            console.log(`no answers saved for ${userEmail} yet`);
            console.log(perguntas);
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

    /* Next three lines are new as of Jan 29. They provide more information to help calculate how long a user spends on each question */
    const reqRemoteAddress = req._remoteAddress;
    const reqPath = req.route.path;
    const newQuestionSubmittedByUser = new Answer ( { userId, userEmail, currentPage, reqPath, reqRemoteAddress, answersObject, questionsIdSaved, answersSaved, createdAt} );

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
    let includesBlank = answersObject.includes(`":""`);

    /* Next three lines are new as of Jan 29. They provide more information to help calculate how long a user spends on each question */
    const reqRemoteAddress = req._remoteAddress;
    const reqPath = req.route.path;
    const newQuestionSubmittedByUser = new Answer ( { userId, userEmail, currentPage, reqPath, reqRemoteAddress, answersObject, questionsIdSaved, answersSaved, createdAt} );

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
    let includesBlank = answersObject.includes(`":""`);

    /* Next three lines are new as of Jan 29. They provide more information to help calculate how long a user spends on each question */
    const reqRemoteAddress = req._remoteAddress;
    const reqPath = req.route.path;
    const newQuestionSubmittedByUser = new Answer ( { userId, userEmail, currentPage, reqPath, reqRemoteAddress, answersObject, questionsIdSaved, answersSaved, createdAt} );

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
    const valuesAsString = Object.values(req.body).toString();
    let includesNo = valuesAsString.includes("0-no");

    /* Next three lines are new as of Jan 29. They provide more information to help calculate how long a user spends on each question */
    const reqRemoteAddress = req._remoteAddress;
    const reqPath = req.route.path;
    const newQuestionSubmittedByUser = new Answer ( { userId, userEmail, currentPage, reqPath, reqRemoteAddress, answersObject, questionsIdSaved, answersSaved, createdAt} );

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

/* Added on 8 Feb */
router.post('/task-2-part-4', (req, res) => {
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
    let includesBlank = answersObject.includes(`":""`);

    
    const reqRemoteAddress = req._remoteAddress;
    const reqPath = req.route.path;
    const newQuestionSubmittedByUser = new Answer ( { userId, userEmail, currentPage, reqPath, reqRemoteAddress, answersObject, questionsIdSaved, answersSaved, createdAt} );

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

/* Task Three Routes Below */
router.get('/task-3-1a', (req, res) => {
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




router.post('/task-3-1a', (req, res) => {
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
    const perguntas = dataForThisSheet.filter (data => data.radio);
    
    /* Next three lines are new as of Jan 29. They provide more information to help calculate how long a user spends on each question */
    const reqRemoteAddress = req._remoteAddress;
    const reqPath = req.route.path;
    const newQuestionSubmittedByUser = new Answer ( { userId, userEmail, currentPage, reqPath, reqRemoteAddress, answersObject, questionsIdSaved, answersSaved, createdAt} );

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



router.get('/task-3-1b', (req, res) => {
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

router.post('/task-3-1b', (req, res) => {
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
    const perguntas = dataForThisSheet.filter (data => data.radio);
    /* Next three lines are new as of Jan 29. They provide more information to help calculate how long a user spends on each question */
    const reqRemoteAddress = req._remoteAddress;
    const reqPath = req.route.path;
    const newQuestionSubmittedByUser = new Answer ( { userId, userEmail, currentPage, reqPath, reqRemoteAddress, answersObject, questionsIdSaved, answersSaved, createdAt} );

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

router.get('/task-3-2a', (req, res) => {
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

router.post('/task-3-2a', (req, res) => {
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
    const perguntas = dataForThisSheet.filter (data => data.radio);
    /* Next three lines are new as of Jan 29. They provide more information to help calculate how long a user spends on each question */
    const reqRemoteAddress = req._remoteAddress;
    const reqPath = req.route.path;
    const newQuestionSubmittedByUser = new Answer ( { userId, userEmail, currentPage, reqPath, reqRemoteAddress, answersObject, questionsIdSaved, answersSaved, createdAt} );

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

router.get('/task-3-2b', (req, res) => {
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

router.post('/task-3-2b', (req, res) => {
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
    const perguntas = dataForThisSheet.filter (data => data.radio);
    /* Next three lines are new as of Jan 29. They provide more information to help calculate how long a user spends on each question */
    const reqRemoteAddress = req._remoteAddress;
    const reqPath = req.route.path;
    const newQuestionSubmittedByUser = new Answer ( { userId, userEmail, currentPage, reqPath, reqRemoteAddress, answersObject, questionsIdSaved, answersSaved, createdAt} );

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

router.get('/task-3-3a', (req, res) => {
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

router.post('/task-3-3a', (req, res) => {
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
    const perguntas = dataForThisSheet.filter (data => data.radio);
    /* Next three lines are new as of Jan 29. They provide more information to help calculate how long a user spends on each question */
    const reqRemoteAddress = req._remoteAddress;
    const reqPath = req.route.path;
    const newQuestionSubmittedByUser = new Answer ( { userId, userEmail, currentPage, reqPath, reqRemoteAddress, answersObject, questionsIdSaved, answersSaved, createdAt} );

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

router.get('/task-3-3b', (req, res) => {
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

/* 
This last route differs from the previous route as it is the page where the user will submit the "final answer" 
The post request will retrieve all the saved data under the user's name from the db
It will then create a new object (FinalAnsSubmitted and send that to a different collection in the db) 
*/

router.post('/task-3-3b', (req, res) => {
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
    const perguntas = dataForThisSheet.filter (data => data.radio);
    /* Next three lines are new as of Jan 29. They provide more information to help calculate how long a user spends on each question */
    const reqRemoteAddress = req._remoteAddress;
    const reqPath = req.route.path;
    const newQuestionSubmittedByUser = new Answer ( { userId, userEmail, currentPage, reqPath, reqRemoteAddress, answersObject, questionsIdSaved, answersSaved, createdAt} );

    if (Object.keys(req.body).length === perguntas.length) {
        Answer.deleteMany({userEmail: userEmail, currentPage: currentPage})
        .then((answer) => {
            console.log(answer);
            newQuestionSubmittedByUser.save()
            .then( (answer) => {
                console.log(`Answer saved to database: ${answer}`);
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
                        console.log(arrayOfAllAns[i]);
                        const objectForTimings =
                        {
                            pageNumber: arrayOfAllAns[i].currentPage,
                            pageUrl: arrayOfAllAns[i].reqPath, 
                            nextButtonClicked: arrayOfAllAns[i].createdAt,
                        }                        
                        times.push(objectForTimings);
                    }

                    console.log(times);
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

                    console.log(timesWithDelta);
                      
                    const timesOfAnswers = JSON.stringify(timesWithDelta);
                    const answersSaved = JSON.stringify(answersSavedArray);
                    const finalAnswer = new FinalAnsSubmitted ( { userId, userEmail, answersSaved, timesOfAnswers} );
                    console.log(finalAnswer);
                    finalAnswer.save()
                    .then ( (x) => {
                        res.redirect(urlsAndPages.nextPage);
                    })})
                    .catch((error) => {
                        console.log(error);
})})})}});


router.get('/study-conclusion', (req, res) => {

    const currentPage = getPageNumber(req.originalUrl, allUrls);
    // Create variable which will be sent to Handlebars page after redemCode is fetched from db
    // Note, as of 7 Feb, this page no longer presents the user with the Amazon voucher.
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    const handlebarsPage = urlsAndPages.handlebarsStaticPage;

    res.render(handlebarsPage);

});


/*
userId: String,
userEmail: String,
userPaymentPref: String,
redemCode: String,
createdAt: String,
*/

router.post('/study-conclusion', (req, res) => {

    console.log('submitted');

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


/* --- The feedback page is only required for the MTurk version --- */
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