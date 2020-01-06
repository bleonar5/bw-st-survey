



localStorage.setItem('radio1', '12');

let radios = document.getElementsByName('10601');



localStorage.setItem('firstQues', radios);

// let radios = document.getElementsByName('10601');
// let val = localStorage.getItem(

// var radios = document.getElementsByName("seconds"); // list of radio buttons
// var val = localStorage.getItem('seconds'); // local storage value
// for(var i=0;i<radios.length;i++){
//   if(radios[i].value == val){
//       radios[i].checked = true; // marking the required radio as checked
//   }
// }


// for (let i = 0; i < radios.length; i++) {

// }


// function get_radio_values()
// {
//     var form = document.getElementsByTagName('form');
//     var radio_values='';
//     for(var i=1; i<form.length+1; i++)
//     {
//         var input=form[i-1].getElementsByTagName('input');
//         for(var j=0; j<input.length; j++)
//         {
//             if(input[j].type=='radio' && input[j].name=='box'+i && input[j].checked)
//             {
//                 radio_values+='box'+i+'='+input[j].value+',';
//             }
//         }
//     }
//     document.getElementById('result').innerHTML=radio_values;
// }