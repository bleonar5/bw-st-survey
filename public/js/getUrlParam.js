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


// Commenting out window.addEventListener to see if window.addEventListener('DOMContentLoaded' works in Chrome
// window.addEventListener("load", function() {
window.addEventListener('DOMContentLoaded', () => {

    // On window load, take surveycode from url
    var surveyCodeFromUrl = getUrlParam('code','');

    console.log(window.location.href);

    // If code exists, save in localStorage & redirect user to "/"
    if (surveyCodeFromUrl.length !== 0) {
        window.localStorage.setItem('code', surveyCodeFromUrl);
        console.log('before redirect');
        console.log(window.location.href);
        window.location.href = "/", true;
        console.log('after redirect');
        console.log(window.location.href);
    // If code does not appear in url, then check that user already has code saved in localStorage. If user does not have a code saved in localStorage, set code as N/A. This can then be used to disable Amazon button when user reaches study-conclusion page.
    } else {
        let surveyCodeInLocalStorage = window.localStorage.getItem('code')

        if (surveyCodeInLocalStorage === null) {
            window.localStorage.setItem('code', "N/A");
        }
    }
});