// On window load, fetch surveyCode from localStorage. If surveyCode has been set to N/A or surveyCode does not exist, disable Amazon Voucher button
window.addEventListener("load", function() {

    let surveyCode = window.localStorage.getItem('code');

    if (surveyCode === "N/A" || surveyCode === null) {
        let amazonBtn = document.getElementById('amazon-btn');

        amazonBtn.disabled = true;
        amazonBtn.classList.remove("hand-curser");
    }

});

document.getElementById('amazon-btn').onclick = function () {

    let surveyCode = window.localStorage.getItem('code');
    let studyId = '562';
    let token = '9284b25d5cd34edab1e413fbe8ce8381';
    let redirectUrl = `https://harvarddecisionlab.sona-systems.com/webstudy_credit.aspx?experiment_id=${studyId}&credit_token=${token}&survey_code=${surveyCode}`;

    // Redirect participant to harvard decision lab
    window.location.href = redirectUrl;

    // Save to localStorage for testing url is valid
    window.localStorage.setItem('redirectUrl', redirectUrl);

    // Returning false cancels the form submission.
    return false;
};