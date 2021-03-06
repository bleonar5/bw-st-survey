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
        "hbsview": "1a-informed-consent",
        "previouspage": "/individual-login",
        "nextpage": "/eligibility-notice"
    },
    {
        "url": "/eligibility-notice",
        "page": 3,
        "hbsview": "1c-eligibility-notice",
        "previouspage": "/study-consent",
        "nextpage": "/welcome"
    },
    {
        "url": "/welcome",
        "page": 4,
        "hbsview": "2a-welcome",
        "previouspage": "/eligibility-notice",
        "nextpage": "/instructions-1"
    },
    {
        "url": "/instructions-1",
        "page": 5,
        "hbsview": "3a-instructions",
        "previouspage": "/welcome",
        "nextpage": "/task-1-part-1"
    },
    {
        "url": "/task-1-part-1",
        "page": 6,
        "pagination": "Page 1 of 2",
        "hbsview": "3b-task-1",
        "previouspage": "/instructions-1",
        "nextpage": "/task-1-part-2"
    },
    {
        "url": "/task-1-part-2",
        "page": 7,
        "pagination": "Page 2 of 2",
        "backbutton": true,
        "hbsview": "3b-task-1",
        "previouspage": "/task-1-part-1",
        "nextpage": "/instructions-2"
    },
    {
        "url": "/instructions-2",
        "page": 8,
        "hbsview": "3a-instructions",
        "previouspage": "/task-1-part-2",
        "nextpage": "/task-2-part-1a"
    },
    {
        "url": "/task-2-part-1a",
        "page": 9,
        "pagination": "Page 1 of 5",
        "hbsview": "4c-task-2",
        "previouspage": "/instructions-2",
        "nextpage": "/task-2-part-1b"
    },
    {
        "url": "/task-2-part-1b",
        "page": 10,
        "pagination": "Page 2 of 5",
        "hbsview": "4c-task-2",
        "previouspage": "/task-2-part-1a",
        "nextpage": "/task-2-part-2"
    },
    {
        "url": "/task-2-part-2",
        "page": 11,
        "pagination": "Page 3 of 5",
        "hbsview": "4c-task-2",
        "previouspage": "/task-2-part-1b",
        "nextpage": "/task-2-part-3"
    },
    {
        "url": "/task-2-part-3",
        "page": 12,
        "pagination": "Page 4 of 5",
        "hbsview": "4c-task-2",
        "previouspage": "/task-2-part-2",
        "nextpage": "/task-2-part-4"
    },
    {
        "url": "/task-2-part-4",
        "page": 13,
        "pagination": "Page 5 of 5",
        "hbsview": "4c-task-2",
        "previouspage": "/task-2-part-3",
        "nextpage": "/instructions-3",
        "comment": "[RP: added 08-feb]"
    },
    {
        "url": "/instructions-3",
        "page": 14,
        "hbsview": "3a-instructions",
        "previouspage": "/task-2-part-4",
        "nextpage": "/task-3-1a"
    },
    {
        "url": "/task-3-1a",
        "page": 15,
        "hbsview": "5a-task-3",
        "previouspage": "/instructions-3",
        "nextpage": "/task-3-1b",
        "comment": "[RP: added 08-jan]",
        "legacyurl": "/scenario-1-split-1"
    },
    {
        "url": "/task-3-1b",
        "page": 16,
        "backbutton": true,
        "hbsview": "5a-task-3",
        "previouspage": "/task-3-1a",
        "nextpage": "/scenario-2-intro",
        "comment": "[RP: added 08-jan]",
        "legacyurl": "/scenario-1-split-2"
    },
    {
        "url": "/scenario-2-intro",
        "page": 17,
        "backbutton": true,
        "hbsview": "5d-scenarios-mezzanine",
        "previouspage": "/task-3-1b",
        "nextpage": "/task-3-2a",
        "comment": "[RP: added 09-jan]",
        "legacyurl": "/scenario-2-intro"
    },
    {
        "url": "/task-3-2a",
        "page": 18,
        "hbsview": "5a-task-3",
        "previouspage": "/scenario-2-intro",
        "nextpage": "/task-3-2b",
        "comment": "[RP: added 08-jan]",
        "legacyurl": "/scenario-2-split-1"
    },
    {
        "url": "/task-3-2b",
        "page": 19,
        "backbutton": true,
        "hbsview": "5a-task-3",
        "previouspage": "/task-3-2a",
        "nextpage": "/scenario-3-intro",
        "comment": "[RP: added 08-jan]",
        "legacyurl": "/scenario-2-split-2"
    },
    {
        "url": "/scenario-3-intro",
        "page": 20,
        "backbutton": true,
        "hbsview": "5d-scenarios-mezzanine",
        "previouspage": "/task-3-2b",
        "nextpage": "/task-3-3a",
        "comment": "[RP: added 09-jan]",
        "legacyurl": "/scenario-3-intro"
    },
    {
        "url": "/task-3-3a",
        "page": 21,
        "hbsview": "5a-task-3",
        "previouspage": "/scenario-3-intro",
        "nextpage": "/task-3-3b",
        "comment": "[RP: added 08-jan]",
        "legacyurl": "/scenario-3-split-1"
    },
    {
        "url": "/task-3-3b",
        "page": 22,
        "backbutton": true,
        "hbsview": "5a-task-3",
        "previouspage": "/task-3-3a",
        "nextpage": "/study-conclusion",
        "comment": "[RP: added 08-jan]",
        "legacyurl": "/scenario-3-split-2"
    },
    {
        "url": "/study-conclusion",
        "page": 23,
        "hbsview": "6a-study-conclusion",
        "previouspage": "/task-3-3b"
    },
    {
        "url": "/compensation-cash",
        "page": 24,
        "hbsview": "6c-compensation-cash",
        "previouspage": "/study-conclusion",
        "nextpage": "/compensation-1",
        "comment": "[RP: added 07-feb]"
    },
    {
        "url": "/compensation-amazon",
        "page": 25,
        "hbsview": "6d-compensation-amazon",
        "previouspage": "/study-conclusion",
        "nextpage": "/compensation-2",
        "comment": "[RP: added 07-feb]"
    },
    {
        "url": "/feedback-page",
        "page": 122,
        "hbsview": "6b-feedback-page",
        "previouspage": "/task-3-3b",
        "nextpage": "/study-conclusion",
        "comment": "[RP: added 29-jan for M-Turkers] | [RP: removed 7-feb for final version]"
    },
    {
        "url": "/scenario-1",
        "page": 114,
        "previouspage": "/task-3-1b",
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