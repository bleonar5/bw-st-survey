// Looks at the urls array and returns the url of the next page
function nextPage(_currentPathname) {
    for (i = 0; i < urls.length; i++) {
        if (urls[i].url === _currentPathname) {
            window.location.pathname = urls[i].nextpage;
            break;
}}}



const urls = 

[
    {
        "pageold": 1,
        "page": 1,
        "urlold": "individual-login",
        "url": "/individual-login",
        "hbsview": "1-individual-login",
        "previouspage": "na",
        "nextpage": "/study-consent"
    },
    {
        "pageold": 2,
        "page": 2,
        "urlold": "study-consent",
        "url": "/study-consent",
        "previouspage": "/individual-login",
        "nextpage": "/eligibility-notice"
    },
    {
        "pageold": 3,
        "page": 3,
        "urlold": "eligibility-notice",
        "url": "/eligibility-notice",
        "previouspage": "/study-consent",
        "nextpage": "/welcome"
    },
    {
        "pageold": 4,
        "page": 4,
        "urlold": "welcome",
        "url": "/welcome",
        "previouspage": "/eligibility-notice",
        "nextpage": "/instructions-1"
    },
    {
        "pageold": 5,
        "page": 5,
        "urlold": "instructions-1",
        "url": "/instructions-1",
        "previouspage": "/welcome",
        "nextpage": "/task-1-part-1"
    },
    {
        "pageold": 6,
        "page": 6,
        "urlold": "task-1",
        "url": "/task-1-part-1",
        "pagination": "Page 1 of 2",
        "previouspage": "/instructions-1",
        "nextpage": "/task-1-part-2"
    },
    {
        "pageold": 7,
        "page": 7,
        "urlold": "task-1-pt-2",
        "url": "/task-1-part-2",
        "pagination": "Page 2 of 2",
        "backbutton": true,
        "previouspage": "/task-1-part-1",
        "nextpage": "/instructions-2"
    },
    {
        "pageold": 8,
        "page": 8,
        "urlold": "instructions-2",
        "url": "/instructions-2",
        "previouspage": "/task-1-part-2",
        "nextpage": "/task-2-part-1"
    },
    {
        "pageold": 9,
        "page": 9,
        "urlold": "task-2",
        "url": "/task-2-part-1",
        "pagination": "Page 1 of 3",
        "previouspage": "/instructions-2",
        "nextpage": "/task-2-part-2"
    },
    {
        "pageold": 10,
        "page": 10,
        "urlold": "task-2-pt-2",
        "url": "/task-2-part-2",
        "pagination": "Page 2 of 3",
        "previouspage": "/task-2-part-1",
        "nextpage": "/task-2-part-3"
    },
    {
        "pageold": 11,
        "page": 11,
        "urlold": "task-2-pt-3",
        "url": "/task-2-part-3",
        "pagination": "Page 3 of 3",
        "previouspage": "/task-2-part-2",
        "nextpage": "/instructions-3"
    },
    {
        "pageold": 12,
        "page": 12,
        "urlold": "instructions-3",
        "url": "/instructions-3",
        "previouspage": "/task-2-part-3",
        "nextpage": "/scenario-1"
    },
    {
        "pageold": 13,
        "page": 13,
        "urlold": "scenario-1",
        "url": "/scenario-1",
        "previouspage": "/instructions-3",
        "nextpage": "/task-3-part-1"
    },
    {
        "pageold": 14,
        "page": 14,
        "urlold": "task-3",
        "url": "/task-3-part-1",
        "backbutton": true,
        "previouspage": "/scenario-1",
        "nextpage": "/scenario-2"
    },
    {
        "pageold": 15,
        "page": 15,
        "urlold": "scenario-2",
        "url": "/scenario-2",
        "previouspage": "/task-3-part-1",
        "nextpage": "/task-3-part-2"
    },
    {
        "pageold": 16,
        "page": 16,
        "urlold": "task-3-pt-2",
        "url": "/task-3-part-2",
        "backbutton": true,
        "previouspage": "/scenario-2",
        "nextpage": "/scenario-3"
    },
    {
        "pageold": 17,
        "page": 17,
        "urlold": "scenario-3",
        "url": "/scenario-3",
        "previouspage": "/task-3-part-2",
        "nextpage": "/task-3-part-3"
    },
    {
        "pageold": 18,
        "page": 18,
        "urlold": "task-3-pt-3",
        "url": "/task-3-part-3",
        "backbutton": true,
        "previouspage": "/scenario-3",
        "nextpage": "/study-conclusion"
    },
    {
        "pageold": 19,
        "page": 19,
        "urlold": "study-conclusion",
        "url": "/study-conclusion",
        "previouspage": "/task-3-part-3",
        "nextpage": "/holding-page"
    },
    {
        "pageold": 21,
        "page": 20,
        "urlold": "holding-page",
        "url": "/holding-page",
        "previouspage": "/study-conclusion"
    },
    {
        "pageold": 20,
        "page": 21,
        "urlold": "n/a",
        "url": "/task-2-part-1b",
        "pagination": "Page 2 of 4",
        "previouspage": "/holding-page",
        "comment": "added on 22-dec"
    }
]