// Todo: Make it functional for task-2-text-box


function toggleFontSize() {

    let infoTextBox = document.getElementById('informed-consent-form-text-box');
    let welcomeText = document.getElementById('welcome-text-box');
    let task1TextBox = document.getElementById('task-1-text-box');
    let task2TextBox = document.getElementById('task-2-text-box');
    let task3TextBox = document.getElementById('task-3-text-box');
    let eligibilityTextBox = document.getElementById('eligibility-notice-text-box');

    changeTextSize(infoTextBox, 'font-size-100', 'font-size-110');
    changeTextSize(welcomeText, 'font-size-110', 'font-size-120');
    changeTextSize(eligibilityTextBox, 'font-size-125', 'font-size-140');
    changeTextSize(task1TextBox, 'font-size-100', 'font-size-110');
    changeTextSize(task2TextBox, 'font-size-100', 'font-size-110');    
    changeTextSize(task3TextBox, 'font-size-90', 'font-size-100');

}


function changeTextSize(_nameOfDiv, _smallText, _bigText) {

    // Check that the name of the div is actually on the page
    if (_nameOfDiv !== null) {
        // Declare variable which gets the button
        let textSizeBox = document.getElementById('toggle-text-size-btn');

        // If the div contains the class for bigger text, remove it
        if (_nameOfDiv.classList.contains(_bigText)) {
            _nameOfDiv.classList.remove(_bigText);
            _nameOfDiv.classList.add(_smallText);
            textSizeBox.innerHTML = '<strong>a</strong>A';
            let textSizePreference = 'small text';
            localStorage.setItem('textSizePreference', JSON.stringify(textSizePreference));
        // If the div doesn't contain the class for bigger text, then add it
        } else {
            _nameOfDiv.classList.add(_bigText);
            _nameOfDiv.classList.remove(_smallText);
            textSizeBox.innerHTML = 'a<strong>A</strong>';
            let textSizePreference = 'large text';
            localStorage.setItem('textSizePreference', JSON.stringify(textSizePreference));
        }

    } else {
        return false;
    }
}




