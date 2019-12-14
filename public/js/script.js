
function checkRadioFive1 (_id) {

    let radios1 = document.getElementsByName(_id);
    let counter = 0;
        radios1.forEach((item) => {
             
            if (item.checked == true) {
                console.log('checked');
                counter++
            } else {
            console.log('not checked');
            }

        })


        if (counter == 0) {
        console.log('probs');
        console.log(`c is ${counter}`);
        let msg = '<div class="row"><div class="col-md-12 text-center"><div class="alert alert-danger" role="alert">Please make sure you answer all questions before continuing.</div></div></div>';                       
        document.getElementById('msg').innerHTML = msg;
        return false;
        } else {
        console.log('no probs');
        console.log(`c is ${counter}`);
        }

};
