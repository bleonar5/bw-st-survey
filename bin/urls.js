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
        "nextpage": "/scenario-1-split-1"
    },
    {
        "url": "/scenario-1-split-1",
        "page": 14,
        "previouspage": "/instructions-3",
        "nextpage": "/scenario-1-split-2",
        "comment": "[RP: added 08-jan]"
    },
    {
        "url": "/scenario-1-split-2",
        "page": 15,
        "backbutton": true,
        "previouspage": "/scenario-1-split-1",
        "nextpage": "/scenario-2-split-1",
        "comment": "[RP: added 08-jan]"
    },
    {
        "url": "/scenario-2-split-1",
        "page": 16,
        "previouspage": "/scenario-1-split-2",
        "nextpage": "/scenario-2-split-2",
        "comment": "[RP: added 08-jan]"
    },
    {
        "url": "/scenario-2-split-2",
        "page": 17,
        "backbutton": true,
        "previouspage": "/scenario-2-split-1",
        "nextpage": "/scenario-3-split-1",
        "comment": "[RP: added 08-jan]"
    },
    {
        "url": "/scenario-3-split-1",
        "page": 18,
        "previouspage": "/scenario-2-split-2",
        "nextpage": "/scenario-3-split-2",
        "comment": "[RP: added 08-jan]"
    },
    {
        "url": "/scenario-3-split-2",
        "page": 19,
        "backbutton": true,
        "previouspage": "/scenario-3-split-1",
        "nextpage": "/study-conclusion",
        "comment": "[RP: added 08-jan]"
    },
    {
        "url": "/study-conclusion",
        "page": 20,
        "previouspage": "/scenario-3-split-2"
    },
    {
        "url": "/scenario-1",
        "page": 114,
        "previouspage": "/instructions-3",
        "nextpage": "/task-3-part-1"
    },
    {
        "url": "/task-3-part-1",
        "page": 115,
        "backbutton": true,
        "previouspage": "/scenario-1",
        "nextpage": "/scenario-2"
    },
    {
        "url": "/scenario-2",
        "page": 116,
        "previouspage": "/task-3-part-1",
        "nextpage": "/task-3-part-2"
    },
    {
        "url": "/task-3-part-2",
        "page": 117,
        "backbutton": true,
        "previouspage": "/scenario-2",
        "nextpage": "/scenario-3"
    },
    {
        "url": "/scenario-3",
        "page": 118,
        "previouspage": "/task-3-part-2",
        "nextpage": "/task-3-part-3"
    },
    {
        "url": "/task-3-part-3",
        "page": 119,
        "backbutton": true,
        "previouspage": "/scenario-3",
        "nextpage": "/study-conclusion"
    }
]

module.exports = urls;