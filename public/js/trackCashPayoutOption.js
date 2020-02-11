// Function which attaches unique url with survey code to receipt_button so that hdsl can track participants who choose cash option

window.addEventListener('DOMContentLoaded', () => {

    let surveyCode = window.localStorage.getItem('code');

    // Update credit token (feb 11)
    let redirectUrl = `https://harvarddecisionlab.sona-systems.com/webstudy_credit.aspx?experiment_id=562&credit_token=9284b25d5cd34edab1e413fbe8ce8381&survey_code=${surveyCode}`;

    console.log(`btn onlick updated to: ${redirectUrl}`);

    document.getElementById('receipt-button').setAttribute('onClick', `window.location.href = "http://dashboard.harvarddecisionlab.org/new-receipt?i=NTQ3&t=c3RhbmRhcmQ=&p=MTA=&l=b25saW5l&d=&r="+btoa("${redirectUrl}");`);

});