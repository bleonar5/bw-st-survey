
```js
router.post('/task-3-1a', (req, res) => {
    // Obtain current page (to input into extractUrlAndPage function)
    const currentPage = getPageNumber(req.originalUrl, allUrls);
    // Lookup nextpage (for redirect)
    const urlsAndPages = extractUrlAndPage(currentPage, allUrls);
    // Get array of questions (allQuestions stored in bin. bin contains array of questions which are imported from GoogleSheets)
    const dataForThisSheet = allQuestions.filter(data => data.page === currentPage);
    // Declare array of questions
    const perguntas = dataForThisSheet.filter (data => !data.heading);
    // Declare variable which stores time of post request 
    const createdAt = req._startTime;
    // Declare variable which extracts User ID from session
    const userId = req.cookies.session;
    // Extract useremail from session
    const userEmail = req.session.currentUser;
    // Convert the question IDs to numbers
    const keysConvertedToNumbers = Object.keys(req.body).map(_element => parseInt(_element, 10));
    // Pull the answers from the request body (the form that the user has submitted)
    const answersObject = JSON.stringify(req.body);
    // Extract the values of the question IDs
    const questionsIdSaved = JSON.stringify(Object.values(keysConvertedToNumbers));
    // Extract the values of the questions
    const answersSaved = JSON.stringify(Object.values(req.body));
    // Declare variable which stores the current pathname (which will be sent to the database
    const reqPath = req.route.path;
    // Count length of the number of questions answered by the user
    const numberOfQuestionsAnswered = Object.keys(req.body).length;

    // Perform backend validation on questions answered
    if (numberOfQuestionsAnswered === perguntas.length) {
    // Update or upsert database with answer
        Answer.updateOne( {userEmail: userEmail, currentPage: currentPage}, { $set:{ userId, userEmail, currentPage, reqPath, answersObject, questionsIdSaved, answersSaved, createdAt} }, { upsert: true })
        .then( (mongoUpdateResult) => {
            console.log(mongoUpdateResult);
            console.log(`--- Below is the Answer for ${userEmail} from page: ${reqPath}:`);
            console.log(answersObject);
            // Once database has been updated, redirect user to next page
            res.redirect(urlsAndPages.nextPage);
        })
        .catch((error) => {
            console.log(error);
        })
    } else {
        // If backend validation fails, refresh page
        res.redirect(req.originalUrl);
    }
});
```