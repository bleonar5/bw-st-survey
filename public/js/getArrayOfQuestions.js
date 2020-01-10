// This function below will work regardless of what question type (i.e. radios, yesnos, dropdowns etc.) we are dealing with. To make it work you need to add the classname "first-radio-box" to the questions).
function getArrayOfQuestions() {
    // Returns an HTML collection of the first radio boxes for each question (note: this is because the classname first-radio-box is only present on the first radio box of each question)
    let $collectionOfFirstRadios = document.getElementsByClassName("first-radio-box");

    // Convert HTML collection to array
    const arrayFromCollection = Array.from($collectionOfFirstRadios);

    // Declare empty array into which we will push the question IDs
    let arrayOfQuestionIds = [];

    for (let i = 0; i < arrayFromCollection.length; i++) {
        arrayOfQuestionIds.push(parseInt(arrayFromCollection[i].name));
    }
    // Return the array of question IDs. This array will then be passed into another function
    return arrayOfQuestionIds;
}