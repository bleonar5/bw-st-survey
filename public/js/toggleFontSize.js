function toggleFontSize() {

    let textSizeBox = document.getElementById('toggle-text-size-btn');

    let task1TextBox = document.getElementById('task-1-text-box');
    let task3TextBox = document.getElementById('task-3-text-box');
    let task3TextBoxScenario = document.getElementById('task3TextBoxScenario');
    let contentMainA = document.getElementById('content-main-a');
    let contentMainB = document.getElementById('content-main-b');
    let contentMainTopF = document.getElementById('ontent-main-top-f');
    let contentMainBottomF = document.getElementById('content-main-bottom-f');

    if (contentMainTopF !== null && contentMainBottomF !== null) {
        if (contentMainTopF.classList.contains('font-size-bigger')) {
            contentMainTopF.classList.remove('font-size-bigger');
            contentMainBottomF.classList.remove('font-size-bigger');
            textSizeBox.innerHTML = '<strong>a</strong>A';
        } else {
            contentMainTopF.classList.add('font-size-bigger');
            contentMainBottomF.classList.add('font-size-bigger');
            textSizeBox.innerHTML = 'a<strong>A</strong>';
        }
    }


    if (task3TextBoxScenario !== null) {
        if (task3TextBoxScenario.classList.contains('font-size-bigger')) {
            task3TextBoxScenario.classList.remove('font-size-bigger');
            textSizeBox.innerHTML = 'a<strong>A</strong>';
        } else {
            task3TextBoxScenario.classList.add('font-size-bigger');
            textSizeBox.innerHTML = '<strong>a</strong>A';
        }
    }

    if (contentMainA !== null) {
        if (contentMainA.classList.contains('font-size-bigger')) {
            contentMainA.classList.remove('font-size-bigger');
            textSizeBox.innerHTML = '<strong>a</strong>A';
        } else {
            contentMainA.classList.add('font-size-bigger');
            textSizeBox.innerHTML = 'a<strong>A</strong>';
        }
    }

    if (contentMainB !== null) {
        if (contentMainB.classList.contains('font-size-bigger-120')) {
            contentMainB.classList.remove('font-size-bigger-120');
            contentMainB.classList.add('font-size-bigger');
            textSizeBox.innerHTML = '<strong>a</strong>A';
        } else {
            contentMainB.classList.add('font-size-bigger-120');
            contentMainB.classList.remove('font-size-bigger');
            textSizeBox.innerHTML = 'a<strong>A</strong>';
        }
    }
    
    if (task1TextBox !== null) {


        if (task1TextBox.classList.contains('font-size-bigger')) {
            task1TextBox.classList.remove('font-size-bigger');
            task1TextBox.classList.add('font-size-task-one');
            textSizeBox.innerHTML = '<strong>a</strong>A';
        } else {
            task1TextBox.classList.remove('font-size-task-one');
            task1TextBox.classList.add('font-size-bigger');
            textSizeBox.innerHTML = 'a<strong>A</strong>';
        }

    }

    if (task3TextBox !== null) {
        if (task3TextBox.classList.contains('font-size-sm')) {
            task3TextBox.classList.remove('font-size-sm');
            textSizeBox.innerHTML = 'a<strong>A</strong>';
        } else {
            task3TextBox.classList.add('font-size-sm');
            textSizeBox.innerHTML = '<strong>a</strong>A';
        }
    }




}