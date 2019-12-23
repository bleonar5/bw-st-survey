console.log(`Backend is up`);

/* --- HELPER FUNCTIONS (only temporarily in site-routes --- */
/* --- TODO: Ask Miguel what the best practice is for storing these functions? i.e. what folder do they belong in? --- */
/* -- HELPER FUNCTION FOR CONVERTING DROPDOWN QUESTIONS -- */

// Impfort Function to get page number

const express = require("express");
const router = express.Router();

const getPageNumber = require('../helpers/getPageNumber.js');
const convertDropdownQues = require('../helpers/convertDropdownQues.js');
const formatQuestions = require('../helpers/formatQuestions.js');
const extractUrlAndPage = require('../helpers/extractUrlAndPage.js');

// Declare variable which hold all data from Google Sheets Import
const allQuestions = require('../bin/sheets-import');
const allUrls = require('../bin/urls');

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
    res.render('3a-instructions-1', { instructions, urlsAndPages });
});

router.get('/instructions-2', (req, res) => {
    currentPage = getPageNumber(req.originalUrl, allUrls);
    const instructions = allQuestions.filter(data => data.page === currentPage);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    res.render('3a-instructions-1', { instructions, urlsAndPages });
});

router.get('/instructions-3', (req, res) => {
    currentPage = getPageNumber(req.originalUrl, allUrls);
    const instructions = allQuestions.filter(data => data.page === currentPage);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    res.render('3a-instructions-1', { instructions, urlsAndPages });
  });


/* --- TASK ONE ROUTES --- */
router.get('/task-1-part-1', (req, res) => {
    currentPage = getPageNumber(req.originalUrl, allUrls);
    const perguntas = allQuestions.filter(data => data.page === currentPage);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    res.render('3b-task-1', { perguntas, urlsAndPages });
});

router.get('/task-1-part-2', (req, res) => {
    currentPage = getPageNumber(req.originalUrl, allUrls);
    const perguntas = allQuestions.filter(data => data.page === currentPage);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    res.render('3b-task-1', { perguntas, urlsAndPages });
});

/* --- TASK TWO ROUTES --- */
router.get('/task-2-part-1', (req, res) => {
    currentPage = getPageNumber(req.originalUrl, allUrls);
    const perguntasUnconverted = allQuestions.filter( data => data.page === currentPage );
    const perguntas = formatQuestions(perguntasUnconverted);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    res.render('4b-task-2', { perguntas, urlsAndPages });
});

router.get('/task-2-part-2', (req, res) => {
    currentPage = getPageNumber(req.originalUrl, allUrls);
    const perguntasUnconverted = allQuestions.filter( data => data.page === currentPage );
    const perguntas = formatQuestions(perguntasUnconverted);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    res.render('4b-task-2', { perguntas, urlsAndPages });
});

router.get('/task-2-part-3', (req, res) => {
    currentPage = getPageNumber(req.originalUrl, allUrls);
    const perguntasUnconverted = allQuestions.filter( data => data.page === currentPage );
    const perguntas = formatQuestions(perguntasUnconverted);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    res.render('4b-task-2', { perguntas, urlsAndPages });
});

router.get('/task-2-part-4', (req, res) => {
    currentPage = getPageNumber(req.originalUrl, allUrls);
    const perguntasUnconverted = allQuestions.filter( data => data.page === currentPage );
    const perguntas = formatQuestions(perguntasUnconverted);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    res.render('4b-task-2', { perguntas, urlsAndPages });
});

/* --- TASK THREE ROUTES --- */
router.get('/task-3-part-1', (req, res) => {
    currentPage = getPageNumber(req.originalUrl, allUrls);
    const perguntas = allQuestions.filter(data => data.page === currentPage);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    res.render('5c-task-3', { perguntas, urlsAndPages });
});

router.get('/task-3-part-2', (req, res) => {
    currentPage = getPageNumber(req.originalUrl, allUrls);
    const perguntas = allQuestions.filter(data => data.page === currentPage);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    res.render('5c-task-3', { perguntas, urlsAndPages });
});

router.get('/task-3-part-3', (req, res) => {
    currentPage = getPageNumber(req.originalUrl, allUrls);
    const perguntas = allQuestions.filter(data => data.page === currentPage);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    res.render('5c-task-3', { perguntas, urlsAndPages });
});

router.get('/scenario-1', (req, res) => {
    currentPage = getPageNumber(req.originalUrl, allUrls);
    const sheetsSituations = allQuestions.filter( data => data.page === currentPage);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    res.render('5b-scenario-1', { sheetsSituations, urlsAndPages });
});

router.get('/scenario-2', (req, res) => {
    currentPage = getPageNumber(req.originalUrl, allUrls);
    const sheetsSituations = allQuestions.filter( data => data.page === currentPage);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    res.render('5b-scenario-1', { sheetsSituations, urlsAndPages });
});

router.get('/scenario-3', (req, res) => {
    currentPage = getPageNumber(req.originalUrl, allUrls);
    const sheetsSituations = allQuestions.filter( data => data.page === currentPage);
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    res.render('5b-scenario-1', { sheetsSituations, urlsAndPages });
});

router.get('/study-conclusion', (req, res) => {
  res.render('6a-study-conclusion');
});

module.exports = router;