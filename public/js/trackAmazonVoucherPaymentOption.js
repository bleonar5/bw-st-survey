
window.addEventListener('DOMContentLoaded', () => {

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

});