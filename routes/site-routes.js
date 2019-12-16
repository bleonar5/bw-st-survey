const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.render('index');
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
  instructions1pg5 = allQuestions.filter(data => data.page === 5);
  res.render('3a-instructions-1', { instructions1pg5 });
});


router.get('/task-1', (req, res) => {
  const allQuestions = require('../bin/sheets-import');
  const perguntas = allQuestions.filter(data => data.page === 6);
  res.render('3b-task-1', { perguntas });
});

router.get('/task-1-pt-2', (req, res) => {
  const allQuestions = require('../bin/sheets-import');

  const perguntas = allQuestions.filter( data => data.page === 7);

  res.render('3c-task-1-pt-2', { perguntas });
});

/* --- TASK TWO ROUTES --- */
router.get('/instructions-2', (req, res) => {
  instructions2pg8 = allQuestions.filter(data => data.page === 8);
  res.render('4a-instructions-2', { instructions2pg8 });
});

router.get('/task-2', (req, res) => {
  const allQuestions = require('../bin/sheets-import');
  const perguntas = allQuestions.filter( data => data.page === 9);
  res.render('4b-task-2', { perguntas });
});

router.get('/task-2-pt-2', (req, res) => {
  const allQuestions = require('../bin/sheets-import');
  const perguntas = allQuestions.filter( data => data.page === 10);
  res.render('4c-task-2-pt-2', { perguntas });
});

router.get('/task-2-pt-3', (req, res) => {
  const allQuestions = require('../bin/sheets-import');
  const perguntas = allQuestions.filter( data => data.page === 11);

  res.render('4d-task-2-pt-3', { perguntas });
});

/* --- TASK THREE ROUTES --- */
router.get('/instructions-3', (req, res) => {
  res.render('5a-instructions-3');
});

router.get('/task-3', (req, res) => {
  const allQuestions = require('../bin/sheets-import');
  // WARNING: The code below might not work on IE.
  const perguntas = allQuestions.filter( data => data.page === 14);
  console.log(perguntas);
  res.render('5c-task-3', { perguntas });
});

router.get('/task-3-pt-2', (req, res) => {
  const allQuestions = require('../bin/sheets-import');
  const perguntas = allQuestions.filter( data => data.page === 16);

  res.render('5e-task-3-pt-2', { perguntas });
});

router.get('/task-3-pt-3', (req, res) => {
  const allQuestions = require('../bin/sheets-import');
  const perguntas = allQuestions.filter( data => data.page === 18);
  res.render('5g-task-3-pt-3', { perguntas });
});

router.get('/scenario-1', (req, res) => {
  const allQuestions = require('../bin/sheets-import');
  const sheetsSituations = allQuestions.filter( data => data.page === 13);
  res.render('5b-scenario-1', { sheetsSituations });
});

router.get('/scenario-2', (req, res) => {
  const allQuestions = require('../bin/sheets-import');
  const sheetsSituations = allQuestions.filter( data => data.page === 15);
  res.render('5d-scenario-2', { sheetsSituations });
});

router.get('/scenario-3', (req, res) => {
  const allQuestions = require('../bin/sheets-import');
  const sheetsSituations = allQuestions.filter( data => data.page === 17);
  res.render('5f-scenario-3', { sheetsSituations });
});

router.get('/study-conclusion', (req, res) => {
  res.render('6a-study-conclusion');
});

module.exports = router;