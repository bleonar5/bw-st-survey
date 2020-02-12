const alertDivOne = document.getElementById('alert-1');
const alertDivTwo = document.getElementById('alert-2');

function hideAlertDiv () {

    if (alertDivOne !== null) {
        alertDivOne.style.display = "none";
    }

    if (alertDivTwo !== null) {
        alertDivTwo.style.display = "none";
    }

}