// Function which checks if a group of radios has been selected
function checkRadios(_question) {
    // Create NodeList of the five radio boxes for the question selected
    let radios = document.getElementsByName(_question);

    // Declare checked variable to monitor if user has selected any of the radio buttons for this question
    // QuesMig - is it good practice to assign this variable a value or could you declare it without assigning it a value (let checked;)
    let checked = false;

    for(let i = 0; i < radios.length; i++) 
    {
        // Iterate through the NodeList of five variable buttons
        if (radios[i].checked) {
            // Change value of checked varible to true if one of the radio boxes is ticked
            checked = true;
            break;
        }
    }

    // Return a value (true or false) to signify whether the user has selected any of the radios for this question
    return checked;
};

