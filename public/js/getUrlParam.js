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

// This function will run twice if the participant is directed here from Soma. First, the window will be loaded and the code will be extracted and saved to localStorage. The user will then get redirected to the index so that the code is removed from the url. When the user is redirected the window gets loaded again. This time (2) as nothing can be extracted from the url, the function will not run again.
window.addEventListener('DOMContentLoaded', () => {

    let surveyCodefromLocalStorage = window.localStorage.getItem('code');
    console.log(`code retrieved from localstorage: ${surveyCodefromLocalStorage}`);

    // On window load, take surveycode from url
    let surveyCodeFromUrl = getUrlParam('code','');

    // If code exists, save in localStorage & redirect user to "/". Redirecting user to "/" will remove the code from the url
    if (surveyCodeFromUrl.length !== 0) {
       //  window.history.pushState("object or string", "Title", "");
        console.log(`code ${surveyCodeFromUrl} removed from url with window.history.replacestate`);
        window.history.replaceState({}, "Index", "/")
        // Comment out redirect
        // window.location.href = "/", true;
 
        window.localStorage.setItem('code', surveyCodeFromUrl);
        console.log(`code saved to localStorage: ${surveyCodeFromUrl}`);
    }
});


/*
Legacy Code - leave until tested code above across broswers

// Commenting out window.addEventListener to see if window.addEventListener('DOMContentLoaded' works in Chrome
// window.addEventListener("load", function() {
    window.addEventListener('DOMContentLoaded', () => {

        // On window load, take surveycode from url
        var surveyCodeFromUrl = getUrlParam('code','');
    
        // If code exists, save in localStorage & redirect user to "/"
        if (surveyCodeFromUrl.length !== 0) {
            window.localStorage.setItem('code', surveyCodeFromUrl);
            window.location.href = "/", true;
        // If code does not appear in url, then check that user already has code saved in localStorage. If user does not have a code saved in localStorage, set code as N/A. This can then be used to disable Amazon button when user reaches study-conclusion page.
        } else {
            let surveyCodeInLocalStorage = window.localStorage.getItem('code')
    
            if (surveyCodeInLocalStorage === null) {
                window.localStorage.setItem('code', "N/A");
            }
        }
    });
*/