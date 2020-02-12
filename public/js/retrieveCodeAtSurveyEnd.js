// On window load, fetch surveyCode from localStorage. If surveyCode has been set to N/A or surveyCode does not exist, disable Amazon Voucher button

// Commenting out this listener as we now want the user to have the option choosing cash or Amazon code
/*
window.addEventListener('DOMContentLoaded', () => {

    let surveyCode = window.localStorage.getItem('code');

    if (surveyCode === null) {
        let amazonBtn = document.getElementById('amazon-btn');

        amazonBtn.disabled = true;
        amazonBtn.classList.remove("hand-curser");
    }

});
*/

// Feb 12: Commenting out listener below as BW would like an extra page when user clicks on Amazon button

/*

let surveyCode = window.localStorage.getItem('code');

document.getElementById('amazon-btn').onclick = function () {

    let surveyCode = window.localStorage.getItem('code');
    let studyId = '562';
    let token = '9284b25d5cd34edab1e413fbe8ce8381';
    let redirectUrl = `https://harvarddecisionlab.sona-systems.com/webstudy_credit.aspx?experiment_id=${studyId}&credit_token=${token}&survey_code=${surveyCode}`;

    // Redirect participant to harvard decision lab
    window.localStorage.setItem('redirctUrl', redirectUrl);
    window.location.href = redirectUrl;

    // Returning false cancels the form submission.
    return false;
};

*/