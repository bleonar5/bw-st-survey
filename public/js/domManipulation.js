// Function which removes classname container from the overarching div
function removeContainer() {
    let $mainContainer = document.getElementById('main-container');
    if ($mainContainer.classList.contains("container") === true) {
    $mainContainer.classList.remove("container");
    $mainContainer.classList.add("container-fluid");
    $mainContainer.classList.add("maxWidth");
    } else {
        $mainContainer.classList.remove("container-fluid");
        $mainContainer.classList.remove("maxWidth");
        $mainContainer.classList.add("container");
    }
}

function toggleTextSizeOld() {
    let $questionsText = document.getElementsByClassName('question-text');
    if ($questionsText.classList.contains("smaller-text") === true ) {
        $questionsText.classList.remove("smaller-text");
    } else {
        $questionsText.classList.add("smaller-text");
    }
}

function toggleTextSize() {
    let $questionsText = document.getElementsByClassName('question-text');

    if ($questionsText[0].classList.contains('smaller-text') === true) {
    for (let i = 0; i < $questionsText.length; i++) {
        $questionsText[i].classList.remove('smaller-text');
        console.log('removed');
    }
    } else {
    for (let i = 0; i < $questionsText.length; i++) {
        $questionsText[i].classList.add('smaller-text');
        console.log('added');
    }}
}


function _removeClasses() {
    for (var i = 0; i < els.length; i++) {
      els[i].classList.remove('active')
    }
  }