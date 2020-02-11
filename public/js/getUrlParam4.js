
const beginSurveyBtn = document.getElementById('begin-survey');
const resumeSurveyBtn = document.getElementById('resume-survey');
let startedSurvey = window.localStorage.getItem('startedSurvey');
// console.log(`Started survey: ${startedSurvey}`);

// Declare function to extract survey code from url & return as key-value pair (i.e. code: "abcde");
function getUrlVars() {
    var vars = {};    
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
            vars[key] = value;
    });
    return vars;
}

// Declare function which extracts code from key-value pair returned in getUrlVars function
function getUrlParam(parameter, defaultvalue){
    var urlparameter = defaultvalue;

    if (window.location.href.indexOf(parameter) > -1) {
        urlparameter = getUrlVars()[parameter];
    }
    return urlparameter;
}

window.addEventListener('DOMContentLoaded', () => {

    // If startedSurvey does not exists yet in LocalStorage, set it to a value of false (which will be stored as a string)
    if (startedSurvey === null) {
        window.localStorage.setItem('startedSurvey', false)
    }

    // Disable begin survey button if participant has already started the survey
    if (startedSurvey == "true") {
        beginSurveyBtn.disabled = true;
        beginSurveyBtn.classList.remove("hand-curser");
    // Else, disable resume survey button
    } else {
        resumeSurveyBtn.classList.remove("hand-curser");
        resumeSurveyBtn.classList.add("disabled");
    }

    let surveyCodefromLocalStorage = window.localStorage.getItem('code');
    // console.log(`code retrieved from localstorage: ${surveyCodefromLocalStorage}`);

    // Take surveycode from url
    let surveyCodeFromUrl = getUrlParam('code','');

    // If code exists, save in localStorage & redirect user to "/". Redirecting user to "/" will remove the code from the url
    // if (surveyCodeFromUrl.length !== 0) {
    // Updated feb 11. Note, I changed surveyCodeFromUrl.length !== "N/A" to surveyCodeFromUrl !== "N/A"
    if (surveyCodeFromUrl.length !== 0 && surveyCodeFromUrl !== "N/A" && surveyCodeFromUrl !== null) {
        // console.log(`code ${surveyCodeFromUrl} removed from url with window.history.replacestate`);
        window.history.replaceState({}, "Index", "/")
        window.localStorage.setItem('code', surveyCodeFromUrl);
        console.log(`code saved to localStorage: ${surveyCodeFromUrl}`);
    }
});

// Set status of startedSurvey to true in localStorage if participant has already started survey
beginSurveyBtn.addEventListener("click", () => {
    window.localStorage.setItem('startedSurvey', true);
});