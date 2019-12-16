const questions =

[
    {
        "id": 101,
        "section": 1,
        "page": 6,
        "text": "I always ask for information from others before making any important decision",
        "type": "radio"
    },
    {
        "id": 102,
        "section": 1,
        "page": 6,
        "text": "I would rather take action on my own than wait around for others’ input",
        "type": "radio"
    },
    {
        "id": 103,
        "section": 1,
        "page": 6,
        "text": "When solving a problem, it is very important to make your own decision and stick by it",
        "type": "radio"
    },
    {
        "id": 104,
        "section": 1,
        "page": 6,
        "text": "Teams usually work very effectively",
        "type": "radio"
    },
    {
        "id": 105,
        "section": 1,
        "page": 6,
        "text": "I find that it is often more productive to work on my own than with others",
        "type": "radio",
        "comments": "[RP-09-dec: corrected typo won -> own]"
    },
    {
        "id": 106,
        "section": 1,
        "page": 6,
        "text": "For most tasks, I would rather work alone than as part of a group",
        "type": "radio",
        "comments": "[RP-09-dec: corrected typo along -> alone]"
    },
    {
        "id": 107,
        "section": 1,
        "page": 6,
        "text": "When I disagree with other team members, I tend to go with my own gut feelings",
        "type": "radio"
    },
    {
        "id": 108,
        "section": 1,
        "page": 6,
        "text": "I can usually perform better when I work on my own",
        "type": "radio"
    },
    {
        "id": 109,
        "section": 1,
        "page": 7,
        "text": "I find working on team projects to be very satisfying",
        "type": "radio"
    },
    {
        "id": 110,
        "section": 1,
        "page": 7,
        "text": "When I have a different opinion than another group member, I usually try to stick with my own opinion",
        "type": "radio"
    },
    {
        "id": 111,
        "section": 1,
        "page": 7,
        "text": "I prefer to complete a task from beginning to end with no assistance from others",
        "type": "radio"
    },
    {
        "id": 112,
        "section": 1,
        "page": 7,
        "text": "It is important to stick to your own decisions, even when others around you are trying to get you to change",
        "type": "radio"
    },
    {
        "id": 113,
        "section": 1,
        "page": 7,
        "text": "I think it is usually better to take the bull by the horns and do something yourself, rather than wait to get input from others",
        "type": "radio"
    },
    {
        "id": 114,
        "section": 1,
        "page": 7,
        "text": "I find it easy to negotiate with others who hold a different viewpoint than I hold",
        "type": "radio"
    },
    {
        "id": 115,
        "section": 1,
        "page": 7,
        "text": "When others disagree, it is important to hold one’s own ground and not give in",
        "type": "radio"
    },
    {
        "id": 201,
        "section": 2,
        "page": 9,
        "text": "Are you currently employed?",
        "type": "dropdown",
        "options": "yes; no; full-time student"
    },
    {
        "id": 202,
        "section": 2,
        "page": 9,
        "text": "What industry do you work in?",
        "type": "dropdown",
        "options": "option 1 [BW to provide]; option 2 [BW to provide]; option 3 etc. [BW to provide]"
    },
    {
        "id": 203,
        "section": 2,
        "page": 9,
        "text": "What is your role?",
        "type": "textarea"
    },
    {
        "id": 204,
        "section": 2,
        "page": 9,
        "text": "On average, how many times per week do you meet with co-workers to discuss work?",
        "type": "dropdown",
        "options": "once; 2 times; 3 times; every day; multiple times per day"
    },
    {
        "id": 205,
        "section": 2,
        "page": 9,
        "text": "What is your annual salary?",
        "type": "dropdown",
        "options": "$10-20k; 20-30k; 30-40k; 40-50k; 50-70k; 70-90k; 90-120k; 120-150k; 150-200k; >200k; prefer not to say"
    },
    {
        "id": 206,
        "section": 2,
        "page": 10,
        "text": "If you are a current student OR have completed a degree, what was your major?",
        "type": "dropdown",
        "options": "option 1 [BW to provide]; option 2 [BW to provide]; option 3 etc. [BW to provide]"
    },
    {
        "id": 207,
        "section": 2,
        "page": 10,
        "text": "Roughly what fraction of your assessment during your degree was based on group work or team assignments?",
        "type": "dropdown",
        "options": "[option 1 [BW to provide]; option 2 [BW to provide]; option 3 etc. [BW to provide]"
    },
    {
        "id": 208,
        "section": 2,
        "page": 10,
        "text": "[placeholder 1; David still coming up with some Q’s here]",
        "type": "tbc"
    },
    {
        "id": 209,
        "section": 2,
        "page": 10,
        "text": "[placeholder 2; David still coming up with some Q’s here]",
        "type": "tbc"
    },
    {
        "id": 210,
        "section": 2,
        "page": 10,
        "text": "[placeholder 3; David still coming up with some Q’s here]",
        "type": "tbc"
    },
    {
        "id": 211,
        "section": 2,
        "page": 11,
        "text": "In the last year, have you been part of any recreational clubs or groups that involves working in groups?",
        "type": "yes-no"
    },
    {
        "id": 212,
        "section": 2,
        "page": 11,
        "text": "If YES, how often do you attend?",
        "type": "dropdown",
        "options": "more than 3 times a week; 1-3 times a week; 1 per month; infrequently"
    },
    {
        "id": 213,
        "section": 2,
        "page": 11,
        "text": "In the last year, have you worked with others as a volunteer, for example for a charity or for a local church?",
        "type": "yes-no"
    },
    {
        "id": 214,
        "section": 2,
        "page": 11,
        "text": "If YES, how often do you attend?",
        "type": "dropdown",
        "options": "more than 3 times a week; 1-3 times a week; 1 per month; infrequently"
    },
    {
        "id": 301,
        "section": 3,
        "page": 14,
        "text": "a) Make sure the team knows of potential risks and that it is critical that you are able to check for damage to the machine before any recommendation is made.",
        "type": "radio"
    },
    {
        "id": 302,
        "section": 3,
        "page": 14,
        "text": "b) Support your team members in their decision, you’ve worked together for a long time, and trust their judgment.",
        "type": "radio"
    },
    {
        "id": 303,
        "section": 3,
        "page": 14,
        "text": "c) Make sure the machine gets the job done on schedule by accepting the judgment of your experienced teammates.",
        "type": "radio"
    },
    {
        "id": 304,
        "section": 3,
        "page": 14,
        "text": "d) Acknowledge that it’s likely that the electrical systems have not been damaged, but insist that you be given a chance to inspect the machine’s structural soundness yourself.",
        "type": "radio"
    },
    {
        "id": 305,
        "section": 3,
        "page": 14,
        "text": "e) Tell the team about your experiences with similar accidents in the past and ask that you be able to inspect the machine personally before the recommendation is made.",
        "type": "radio"
    },
    {
        "id": 306,
        "section": 3,
        "page": 14,
        "text": "f) Recommend that they go ahead and run the machine to support your team and then check its structural soundness after the important production run is finished.",
        "type": "radio"
    },
    {
        "id": 307,
        "section": 3,
        "page": 14,
        "text": "g) Relate to the team some additional areas of potential damage to the machine after inquiring into the inspections they have made.",
        "type": "radio"
    },
    {
        "id": 308,
        "section": 3,
        "page": 14,
        "text": "h) Although you are more experienced in the structural mechanics, go with the judgment made by your teammates because two of them have been with the company much longer than you have.",
        "type": "radio"
    },
    {
        "id": 309,
        "section": 3,
        "page": 14,
        "text": "i) Thank the team for checking the machine over, but relate to the team your experience with “unseen damage” occurring even when it is not evident from an outside glance.",
        "type": "radio"
    },
    {
        "id": 310,
        "section": 3,
        "page": 14,
        "text": "j) Don’t waste time unnecessarily by asking the team to repeat everything they have checked, just let them know you will go with their judgment as long as they accept responsibility for the decision.",
        "type": "radio"
    },
    {
        "id": 311,
        "section": 3,
        "page": 16,
        "text": "a) Acknowledge that your arguments have been heard and discussed by the team, and support the team’s decision.",
        "type": "radio"
    },
    {
        "id": 312,
        "section": 3,
        "page": 16,
        "text": "b) Ask the team to reconsider one more time your perspective on the long-term political impact of refusing the new product line because you feel it is an important issue.",
        "type": "radio"
    },
    {
        "id": 313,
        "section": 3,
        "page": 16,
        "text": "c) Let the team know that although you believe in team unity, you can’t bring yourself to refuse the new product line.",
        "type": "radio"
    },
    {
        "id": 314,
        "section": 3,
        "page": 16,
        "text": "d) Show your willingness to be a team player by voicing your support of the team’s decision. .",
        "type": "radio"
    },
    {
        "id": 315,
        "section": 3,
        "page": 16,
        "text": "e) Recognize that the team has reviewed the issues, and begin discussing ways to make the recommendation to management.",
        "type": "radio"
    },
    {
        "id": 316,
        "section": 3,
        "page": 16,
        "text": "f) Suggest that since the team can’t reach consensus they should allow upper management to make the final decision.",
        "type": "radio"
    },
    {
        "id": 317,
        "section": 3,
        "page": 16,
        "text": "g) Even though you would still prefer to take on the new product line, go along with the team’s decision, because they have let you have your say in the matter.",
        "type": "radio"
    },
    {
        "id": 318,
        "section": 3,
        "page": 16,
        "text": "h) Recognize that the team has some good arguments, but remain committed to making the team see that the benefits clearly outweigh the costs.",
        "type": "radio"
    },
    {
        "id": 319,
        "section": 3,
        "page": 16,
        "text": "i) Sustain the team’s decision on the recommendation, as long as they acknowledge to upper management that the team would revisit its decision if more resources are provided. .",
        "type": "radio"
    },
    {
        "id": 320,
        "section": 3,
        "page": 16,
        "text": "j) Be assertive and let the team know you still feel strongly that the team should take on the new product line.",
        "type": "radio"
    },
    {
        "id": 321,
        "section": 3,
        "page": 18,
        "text": "a) Highlight the fact that you have been doing the job for 15 years and the current layout is the best one.",
        "type": "radio"
    },
    {
        "id": 322,
        "section": 3,
        "page": 18,
        "text": "b) Propose that a good strategy may be to think outside of the box and get new layout ideas from high performance manufacturers in other industries.",
        "type": "radio"
    },
    {
        "id": 323,
        "section": 3,
        "page": 18,
        "text": "c) Keep the team on track by pointing out that it is very inefficient to waste time discussing solutions that are probably not practically feasible.",
        "type": "radio"
    },
    {
        "id": 324,
        "section": 3,
        "page": 18,
        "text": "d) Suggest that the team keep the ideas similar to the current layout to simplify the transition to the new building.",
        "type": "radio"
    },
    {
        "id": 325,
        "section": 3,
        "page": 18,
        "text": "e) Suggest that to find the optimal layout, the team should first generate innovative ideas and save the evaluation of the ideas for later in the process.",
        "type": "radio"
    },
    {
        "id": 326,
        "section": 3,
        "page": 18,
        "text": "f) Make sure the team doesn’t waste time discussing drastic changes to the current layout because management is not likely to endorse such a proposal anyway.",
        "type": "radio"
    },
    {
        "id": 327,
        "section": 3,
        "page": 18,
        "text": "g) Make sure production levels don’t drop due to letting your team’s most creative member make all suggestions.",
        "type": "radio"
    },
    {
        "id": 328,
        "section": 3,
        "page": 18,
        "text": "h) Remind the team that they have been working in the current environment for many years, and should consider all layout options even if they seem unfamiliar.",
        "type": "radio"
    },
    {
        "id": 329,
        "section": 3,
        "page": 18,
        "text": "i) Recommend that each team member take time this week to create three layout designs and bring them to the next team meeting.",
        "type": "radio"
    },
    {
        "id": 330,
        "section": 3,
        "page": 18,
        "text": "j) Suggest that a good way to generate innovative layouts would be to hold the next meeting in the new building.",
        "type": "radio"
    },
    {
        "id": "scenario01-01",
        "page": 13,
        "text": "You are a member of an equipment maintenance team responsible for 12 high tech manufacturing machines."
    },
    {
        "id": "scenario01-02",
        "page": 13,
        "text": "Your five-person team has experts in many areas, including mechanical, electrical, & hydraulic systems."
    },
    {
        "id": "scenario01-03",
        "page": 13,
        "text": "You are the only member of your team with experience in the structural mechanics of the machines."
    },
    {
        "id": "scenario01-04",
        "page": 13,
        "text": "One of the machines was struck by a forklift while being prepared for an important production run."
    },
    {
        "id": "scenario01-05",
        "page": 13,
        "text": "The company owner quickly pulls your team together and asks if it is ok to run the machine. You are the last one to arrive at the meeting."
    },
    {
        "id": "scenario01-06",
        "page": 13,
        "text": "Apparently, the team feels that there was not any visible damage to the machine and it can be used safely.  They tell you that they have looked it over and didn’t see any damage."
    },
    {
        "id": "scenario02-01",
        "page": 15,
        "text": "You are a member of a manufacturing production team."
    },
    {
        "id": "scenario02-02",
        "page": 15,
        "text": "Your team is responsible for the production of three product lines."
    },
    {
        "id": "scenario02-03",
        "page": 15,
        "text": "Last month management asked for a recommendation from your team as to whether or not your team could assume responsibility for another product line (making a total of four)."
    },
    {
        "id": "scenario02-04",
        "page": 15,
        "text": "Your personal view is that taking on the new product line would increase the visibility and importance of the team within the organization, which would help raise salaries and promotional opportunities."
    },
    {
        "id": "scenario02-05",
        "page": 15,
        "text": "The other four members of your team feel that, in addition to the increased time and personnel demands placed on the team, current technology may not be capable of producing the new product efficiently."
    },
    {
        "id": "scenario02-06",
        "page": 15,
        "text": "For the past several weeks your team has been carefully investigating the possibility of taking on another product. Your team has thoroughly discussed all the issues and would like to propose to management that the product line be manufactured at another facility."
    },
    {
        "id": "scenario03-01",
        "page": 17,
        "text": "You are a member of a long-standing manufacturing team."
    },
    {
        "id": "scenario03-02",
        "page": 17,
        "text": "Your team has been together for several years and has become pretty good at handling the work at hand."
    },
    {
        "id": "scenario03-03",
        "page": 17,
        "text": "Each team member is comfortable with the work process and the other team members."
    },
    {
        "id": "scenario03-04",
        "page": 17,
        "text": "Your work team will be moving to a new building that has been added onto the plant."
    },
    {
        "id": "scenario03-05",
        "page": 17,
        "text": "The area manager has asked your team for some new ideas on how the equipment should be laid out in the new building."
    },
    {
        "id": "consent-01",
        "page": 2,
        "heading": "Purpose of Research Study",
        "text": "To understand the relationship between measures of social skill and fluid intelligence.",
        "type": "heading"
    },
    {
        "id": "consent-02",
        "page": 2,
        "heading": "What You’ll Do",
        "text": "This is a follow-up survey. We will ask you some demographic questions about your work history and experience of teamwork, along with a ‘situational judgment test’ to assess your knowledge of working in a team.",
        "type": "heading"
    },
    {
        "id": "consent-03",
        "page": 2,
        "heading": "Risks",
        "text": "There are no risks for participating in this study beyond those associated with normal computer use, including fatigue and mild stress.",
        "type": "heading"
    },
    {
        "id": "consent-04",
        "page": 2,
        "heading": "Compensation",
        "text": "Overall, compensation for this experiment will be $15.",
        "type": "heading"
    },
    {
        "id": "consent-05",
        "page": 2,
        "heading": "Please Note",
        "text": "This study contains a number of checks to make sure that participants are finishing the tasks honestly and completely.",
        "type": "heading"
    },
    {
        "id": "consent-06",
        "page": 2,
        "heading": "Voluntary Participation And Right To Withdraw",
        "text": "Participation in this study is voluntary, and you can stop at any time without any penalty. To stop, simply close your browser window. Partial data will not be analyzed.",
        "type": "heading"
    },
    {
        "id": "consent-07",
        "page": 2,
        "heading": "Confidentiality",
        "text": "All data collected as part of this study will be anonymized (and personal information, such as your email address, will be removed).",
        "type": "heading"
    },
    {
        "id": "consent-08",
        "page": 2,
        "heading": "Contact Information",
        "text": "If you have any questions about this research, you may contact: Ben Weidmann at <a href=\"mailto:benweidmann@g.harvard.edu\">benweidmann@g.harvard.edu</a>, or David Deming at <a href=\"mailto:david_deming@harvard.edu\">david_deming@harvard.edu</a>",
        "type": "heading",
        "comments": "[RP-16-dec: html markup added to create links to email addresses]"
    },
    {
        "id": "consent-09",
        "page": 2,
        "heading": "Clicking Accept",
        "text": "By clicking on the \"I Consent\" button, you indicate that you are 18 years of age or older, that you voluntarily agree to participate in this study and that you understand the information in this consent form.",
        "type": "heading"
    },
    {
        "id": "eligibility-01",
        "page": 3,
        "text": "Our study requires participants who try their best in these Online Tasks. If you skip through questions, or don’t read the instructions, your responses cannot be used."
    },
    {
        "id": "eligibility-02",
        "page": 3,
        "text": "<strong>Our tasks contain checks to see whether or not you’re reading the instructions and the questions.</strong>",
        "comments": "[RP-16-dec: HTML <strong> tag = bold text]"
    },
    {
        "id": "eligibility-03",
        "page": 3,
        "text": "Everybody who makes a genuine attempt to answer the questions will be eligible for the Superteams study, regardless of your score."
    },
    {
        "id": "eligibility-04",
        "page": 3,
        "text": "Click \"I agree\" if you would like to proceed. If not, thank you for your time!"
    },
    {
        "id": "welcome-01",
        "page": 4,
        "text": "This survey is only available to people who successfully participated in Superteams."
    },
    {
        "id": "welcome-02",
        "page": 4,
        "text": "These questions take <strong>40 minutes</strong>. We will ask questions about your work experience, and your views on groupwork."
    },
    {
        "id": "welcome-03",
        "page": 4,
        "text": "There are <strong>three parts</strong>. Some will take longer than others, but not more than 20 minutes. "
    },
    {
        "id": "welcome-04",
        "page": 4,
        "text": "If you have to stop, that's OK. Your answers will be saved. To continue, come back to <span class=\"text-primary\"><a href=\"individual-login\">this website </a></span> re-enter the <strong>same login details</strong> and pick up where you left off."
    },
    {
        "id": "welcome-05",
        "page": 4,
        "text": "<span class=\"text-danger\">Note: These tasks <strong>must</strong> be done on a laptop or desktop computer.<br>They <strong>cannot</strong> be done on a mobile phone or tablet.</span>"
    },
    {
        "id": "inst-01-01",
        "page": 5,
        "heading": "Task 1 (of 3)",
        "type": "heading"
    },
    {
        "id": "inst-01-02",
        "page": 5,
        "text": "The purpose of this task is to understand your views about teamwork and working independently."
    },
    {
        "id": "inst-01-03",
        "page": 5,
        "text": "It shouldn’t take more than 5 minutes. "
    },
    {
        "id": "inst-01-04",
        "page": 5,
        "text": "Please be as honest as possible. Your answers will be kept in absolute confidence, and fully anonymized."
    },
    {
        "id": "inst-02-01",
        "page": 8,
        "heading": "Task 2 (of 3)",
        "type": "heading"
    },
    {
        "id": "inst-02-02",
        "page": 8,
        "text": "The purpose of this task is to understand more about your background and experiences."
    },
    {
        "id": "inst-02-03",
        "page": 8,
        "text": "It shouldn’t take more than a few minutes. "
    },
    {
        "id": "inst-02-04",
        "page": 8,
        "text": "Again, please be as honest as possible. Your answers will be kept in absolute confidence, and fully anonymized."
    }
]

module.exports = questions;