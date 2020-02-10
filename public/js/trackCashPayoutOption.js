// Function which attaches unique url with survey code to receipt_button so that hdsl can track participants who choose cash option

window.addEventListener('DOMContentLoaded', () => {

    let surveyCode = window.localStorage.getItem('code');

    let redirectUrl = `https://harvarddecisionlab.sona-systems.com/webstudy_credit.aspx?experiment_id=562&credit_token=9185d436e5f94b1581b0918162f6d7e8&survey_code=${surveyCode}`;

    console.log(`btn onlick updated to: ${redirectUrl}`);

    // Note, this produces an error when clicked. Need to check if there is a typo somewhere.
    document.getElementById('receipt-button').setAttribute('onClick', `window.location.href = "http://dashboard.harvarddecisionlab.org/new-receipt?i=NTQ3&t=c3RhbmRhcmQ=&p=MTA=&l=b25saW5l&d=&r="+btoa(${redirectUrl});`);

});