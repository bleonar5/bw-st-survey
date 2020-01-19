// Todo: Make it functional for task-2-text-box


function toggleFontSize() {

    let task1TextBox = document.getElementById('task-1-text-box');
    let task2TextBox = document.getElementById('task-2-text-box');
    let task3TextBox = document.getElementById('task-3-text-box');

    
    // Task 1 Radio Buttons
    if (task1TextBox !== null) {
        changeTextSize(task1TextBox, 'font-size-100', 'font-size-110');
    }

    if (task2TextBox !== null) {
        changeTextSize(task2TextBox, 'font-size-100', 'font-size-110');
    }

    if (task3TextBox !== null) {
        changeTextSize(task3TextBox, 'font-size-90', 'font-size-100');
    }


}


function changeTextSize(_nameOfDiv, _smallText, _bigText) {

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
}




