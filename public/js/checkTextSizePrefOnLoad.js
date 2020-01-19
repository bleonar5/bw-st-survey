// Function which checks the user's text-size preference when the page loads
// To use value from localStrorage you need to convert a JSON string to a JS object
let textSizePreference = JSON.parse(localStorage.getItem('textSizePreference'));

if (textSizePreference === null || textSizePreference === "small text" ) {
    // console.log(`textSizePreference is ${textSizePreference}`)
} else if (textSizePreference === "large text") {
    // console.log(`textSizePreference is ${textSizePreference}`)
    toggleFontSize()
} else {
    console.log(textSizePreference);
    console.log(typeof textSizePreference);
    console.log('Text Size Preference not recognized');
}
