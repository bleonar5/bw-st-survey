// Looks at the urls array and returns the url of the next page
function nextPage(_currentPathname) {
    for (i = 0; i < urls.length; i++) {
        if (urls[i].url === _currentPathname) {

            // Check if you should skip the next question, then find the nextpage of i+1
            if (skipNextQuestion) {
                console.log('Next Question has been skipped');
                window.location.pathname = urls[i+1].nextpage;
            }

            // Otherwise, proceed to next page
            else {
                console.log('Proceed to next page');
                console.log(urls[i].nextpage);
                window.location.pathname = urls[i].nextpage;
            }

            break;
}}}


// Write logic which performs a check on the given page to see if there is a possibility that we should skip the next question.

const urls = 
[
    {
        "url": "/individual-login",
        "page": 1,
        "hbsview": "1-individual-login",
        "previouspage": "na",
        "nextpage": "/study-consent"
    },
    {
        "url": "/study-consent",
        "page": 2,
        "previouspage": "/individual-login",
        "nextpage": "/eligibility-notice"
    },
    {
        "url": "/eligibility-notice",
        "page": 3,
        "previouspage": "/study-consent",
        "nextpage": "/welcome"
    },
    {
        "url": "/welcome",
        "page": 4,
        "previouspage": "/eligibility-notice",
        "nextpage": "/instructions-1"
    },
    {
        "url": "/instructions-1",
        "page": 5,
        "previouspage": "/welcome",
        "nextpage": "/task-1-part-1"
    },
    {
        "url": "/task-1-part-1",
        "page": 6,
        "pagination": "Page 1 of 2",
        "previouspage": "/instructions-1",
        "nextpage": "/task-1-part-2"
    },
    {
        "url": "/task-1-part-2",
        "page": 7,
        "pagination": "Page 2 of 2",
        "backbutton": true,
        "previouspage": "/task-1-part-1",
        "nextpage": "/instructions-2"
    },
    {
        "url": "/instructions-2",
        "page": 8,
        "previouspage": "/task-1-part-2",
        "nextpage": "/task-2-part-1a"
    },
    {
        "url": "/task-2-part-1a",
        "page": 9,
        "pagination": "Page 1 of 4",
        "previouspage": "/instructions-2",
        "nextpage": "/task-2-part-1b"
    },
    {
        "url": "/task-2-part-1b",
        "page": 10,
        "pagination": "Page 2 of 4",
        "previouspage": "/task-2-part-1a",
        "nextpage": "/task-2-part-2"
    },
    {
        "url": "/task-2-part-2",
        "page": 11,
        "pagination": "Page 3 of 4",
        "previouspage": "/task-2-part-1b",
        "nextpage": "/task-2-part-3"
    },
    {
        "url": "/task-2-part-3",
        "page": 12,
        "pagination": "Page 4 of 4",
        "previouspage": "/task-2-part-2",
        "nextpage": "/instructions-3"
    },
    {
        "url": "/instructions-3",
        "page": 13,
        "previouspage": "/task-2-part-3",
        "nextpage": "/scenario-1"
    },
    {
        "url": "/scenario-1",
        "page": 14,
        "previouspage": "/instructions-3",
        "nextpage": "/task-3-part-1"
    },
    {
        "url": "/task-3-part-1",
        "page": 15,
        "backbutton": true,
        "previouspage": "/scenario-1",
        "nextpage": "/scenario-2"
    },
    {
        "url": "/scenario-2",
        "page": 16,
        "previouspage": "/task-3-part-1",
        "nextpage": "/task-3-part-2"
    },
    {
        "url": "/task-3-part-2",
        "page": 17,
        "backbutton": true,
        "previouspage": "/scenario-2",
        "nextpage": "/scenario-3"
    },
    {
        "url": "/scenario-3",
        "page": 18,
        "previouspage": "/task-3-part-2",
        "nextpage": "/task-3-part-3"
    },
    {
        "url": "/task-3-part-3",
        "page": 19,
        "backbutton": true,
        "previouspage": "/scenario-3",
        "nextpage": "/study-conclusion"
    },
    {
        "url": "/study-conclusion",
        "page": 20,
        "previouspage": "/task-3-part-3",
        "nextpage": "/holding-page-1"
    },
    {
        "url": "/holding-page-1",
        "page": 21,
        "previouspage": "/study-conclusion",
        "nextpage": "/holding-page-2"
    },
    {
        "url": "/holding-page-2",
        "page": 22,
        "previouspage": "/holding-page-1",
        "nextpage": "/end-of-survey",
        "comment": "added on 22-dec"
    }
]