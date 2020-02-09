// Function extracts %SURVEY_CODE% from https://example-site.com/?code=%SURVEY_CODE%

// Declare function to extract survey code from url & return as key: value pair (e.g. code: "abcde");
function getUrlVars() {
    var vars = {};    
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
            vars[key] = value;
    });
    return vars;
}

// Declare function which extracts code from key value pair returned in getUrlVars function
function getUrlParam(parameter, defaultvalue){
    var urlparameter = defaultvalue;
    if(window.location.href.indexOf(parameter) > -1){
        urlparameter = getUrlVars()[parameter];
        }
    return urlparameter;
}

// Call function to retrieve survey code from URL
var survey_code = getUrlParam('code','');

// Store code in localStorage. Code will be retrieved at end of survey
window.localStorage.setItem('code', survey_code);