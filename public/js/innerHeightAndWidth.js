// Declare variables to measure user's screensize
const width  = window.innerWidth;
const height = window.innerHeight;
console.log(`width: ${width}, height ${height}`);

let heightGetEle = document.getElementById("innerHeightHtml"); 
heightGetEle.innerHTML = `${height}`;

let widthGetEle = document.getElementById("innerWidthHtml");
widthGetEle.innerHTML = `${width}`;