function toggleFontSize() {

    let task1TextBox = document.getElementById('task-1-text-box');
    let contentMainA = document.getElementById('content-main-a'); 
    let contentMainB = document.getElementById('content-main-b');
    let task3TextBoxScenario = document.getElementById('task3TextBoxScenario');
    let task3TextRadioBox = document.getElementById('task-3-text-box');

    // Content A - study-consent
    if (contentMainA !== null) {
        changeTextSize(contentMainA, 'font-size-bigger');
    }

    // Content B - welcome
    if (contentMainB !== null) {
        changeTextSize(contentMainB, 'font-size-bigger-130');
    }
    
    // Task 1 Radio Buttons
    if (task1TextBox !== null) {
        changeTextSize(task1TextBox, 'font-size-bigger');
    }

    // Task 3 Radio and Scenario Buttons
    if (task3TextBoxScenario !== null) {
        changeTextSize(task3TextBoxScenario, 'font-size-bigger');
        changeTextSize(task3TextRadioBox, 'font-size-bigger');
    }
}


function changeTextSize(_nameOfDiv, _bigText) {

    // Declare variable which gets the button
    let textSizeBox = document.getElementById('toggle-text-size-btn');

    // If the div contains the class for bigger text, remove it
    if (_nameOfDiv.classList.contains(_bigText)) {
        _nameOfDiv.classList.remove(_bigText);
        textSizeBox.innerHTML = '<strong>a</strong>A';
        // localStorage.clear();
        let textSizePreference = 'small text';
        localStorage.setItem('textSizePreference', JSON.stringify(textSizePreference));
    // If the div doesn't contain the class for bigger text, then add it
    } else {
        _nameOfDiv.classList.add(_bigText);
        textSizeBox.innerHTML = 'a<strong>A</strong>';
        // localStorage.clear();
        let textSizePreference = 'large text';
        localStorage.setItem('textSizePreference', JSON.stringify(textSizePreference));
    }
}




