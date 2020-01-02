// let urls = require('../bin/urls.js');
// I'm temporarily pasting the arry in here because I can't find a way of using imports and exports with client side JS

// Declare variables to track user's progress
let employed = true;
let student = undefined;
let timeTaken = 0;

// Declare variables to measure user's screensize
const width  = window.innerWidth;
const height = window.innerHeight;
// console.log(`width: ${width}, height ${height}`);


// Function which removes the form validation warning when user clicks on any radio button
function removeWarning() {

    if (document.getElementById('warning-message-small') !== null) {
            document.getElementById('warning-message-small').innerHTML = '';
        } else if (document.getElementById('warning-message') !== null) {
            document.getElementById('warning-message').innerHTML = '';
        } else {
            console.log('there is no warning message div on this page');
        }
 
    let pageNumberExists = document.getElementById('page-number');
    
    if (pageNumberExists) {                    
        document.getElementById('page-number').style.display = "inherit";
    }

    let backButtonExists = document.getElementById('back-button');

    if (backButtonExists) {
        document.getElementById('back-button').style.display = "inherit";
    }
}


function toggleFontSize() {
    let task3TextBox = document.getElementById('task-3-text-box');
    let textSizeBox = document.getElementById('toggle-text-size-btn');

    if (task3TextBox.classList.contains('font-size-sm')) {
        task3TextBox.classList.remove('font-size-sm');
        textSizeBox.innerHTML = 'Decrease Font Size';
    } else {
        task3TextBox.classList.add('font-size-sm');
        textSizeBox.innerHTML = 'Increase Font Size';
    }
}

