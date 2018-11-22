console.log("Hello World in Paint");

//Initializin variables and conditions
var counter = -1;
var imageArray = [];
//Step 1 Find Canvas. 
var canvas = document.getElementById('canvas');

// 1.1 GetContext function. 
var ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var mouse = false;
ctx.lineJoin = 'round';
ctx.lineCap = 'round';
var positionX, positionY;
var lastX, lastY;
var interval;
var points = [];

// 1.2 Element retrieval
var brush = document.getElementById('brush'); // Brush
var eraser = document.getElementById('erased'); // Eraser
var color = document.getElementById("myColor"); // Color
var size = document.getElementById("myRange"); // Size
var reset = document.getElementById("reset"); // Reset
var saveLink = document.getElementById("saveLink"); //Link element
var undo = document.getElementById("undo"); // Undo
var redo = document.getElementById("redo"); // Redo
// 1.3 Set initial size conditions
var mySize = size.value; // Size 
ctx.lineWidth = mySize;

brush.style.border = "2px solid red";
canvas.style.cursor = "pointer";
var myColor = color.value; // Color
ctx.strokeStyle = myColor;

canvas.addEventListener("mousedown", brushDown, false);
canvas.addEventListener("mousemove", brushMove, false);
canvas.addEventListener("mouseup", brushUp, false);


// 1.4 Color and Size function
function colorChange() {
    myColor = color.value;
    ctx.strokeStyle = myColor;
}

function sizeChange() {
    mySize = size.value;
    ctx.lineWidth = mySize;
}

//Step 2. Make the brush work

// 2.1 Functions 
function getCoordinates(canvas, e) {
    var rect = canvas.getBoundingClientRect(); //introduce the size of the element, object oriented topic
    return { //objects
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

function brushDraw(canvas, positionX, positionY) {
    if (mouse == true) {
        ctx.lineTo(positionX, positionY);
        ctx.stroke();
        canvas.style.cursor = "pointer";

        points.push({
            x: positionX,
            y: positionY,
            mode: "draw"

        });
  
        console.log(points)
        
    }
}

function brushMove(e) {
    var coordinates = getCoordinates(canvas, e);
    positionX = coordinates.x;
    positionY = coordinates.y;
    brushDraw(canvas, positionX, positionY);

}

function brushDown(e) {
    mouse = true;
    var coordinates = getCoordinates(canvas, e);
    positionX = coordinates.x;
    positionY = coordinates.y;
    ctx.beginPath();
    ctx.moveTo(positionX, positionY);
    ctx.lineTo(positionX, positionY);
    ctx.stroke();

    points.push({
        x: positionX,
        y: positionY,
        mode: "begin"
    });

    lastX = positionX;
    lastY = positionY;
}

function brushUp() {
    mouse = false;
    canvas.style.cursor = "default";
    points.push({
        x: positionX,
        y: positionY,
        size: brush,
        color: color,
        mode: "end"
    });
    
    var data = canvas.toDataURL();
    imageArray.push(document.getElementById("canvas").toDataURL());
    console.log( imageArray)
          counter++;
}

function redrawAll(myarray) {
    if (myarray.length == 0) {
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
console.log(myarray.length)
    for (var i = 0; i < myarray.length; i++) {
        var pt = myarray[i];
        var begin = false;
        if (ctx.lineWidth != pt.size) {
            ctx.lineWidth = pt.size;
            begin = true;
        }
        if (ctx.strokeStyle != pt.color) {
            ctx.strokeStyle = pt.color;
            begin = true;
        }
        if (pt.mode == "begin" || begin) {
            ctx.beginPath();
            ctx.moveTo(pt.x, pt.y);
        }
        ctx.lineTo(pt.x, pt.y);
        if (pt.mode == "end" || (i == myarray.length)) {
            ctx.stroke();
        }
    }
    ctx.stroke();
 
}
// Undo function
function undoLastPoint() {
    counter--;
    var lastPoint = [];
    lastPoint.push(points[counter]);
 
    redrawAll(lastPoint);
    
}

function cPush(){
    counter++;
    if(counter < imageArray.length){
        imageArray.length = counter;
    }
    
 imageArray.push(document.getElementById("canvas").toDataURL());
    console.log(imageArray);
    document.title = counter + ":" + imageArray.length; 
    console.log(document.title);
}

// Redo Function
function cRedo(e) {
    if (counter < imageArray.length-1) {
        counter++;
        var canvasPic = new Image();
        canvasPic.src = imageArray[counter];
        canvasPic.onload = function () 
        { ctx.drawImage(canvasPic, 0, 0); }
        
        document.title = counter + ":" + imageArray.length;
               
    }  
}

function brushClick() {
    var brushColor = document.getElementById("myColor");
    ctx.strokeStyle = brushColor.value;
    brush.style.border = "2px solid red";
    eraser.style.border = "none";

    canvas.addEventListener("mousedown", brushDown, false); //buble phase
    canvas.addEventListener("mousemove", brushMove, false);
    canvas.addEventListener("mouseup", brushUp, false);

}

//Step 3. Making the eraser work
function eraserClick() {
    ctx.strokeStyle = "white";
    eraser.style.border = "2px solid red";
    brush.style.border = "none";

    canvas.addEventListener("mousedown", brushDown, false);
    canvas.addEventListener("mousemove", brushMove, false);
    canvas.addEventListener("mouseup", brushUp, false);

}
// 4. Making the reset button work
function resetClick() {
    window.location.reload();
}

// 5. Making the save button work
function saveClick() {
    var data = canvas.toDataURL(); //encodes image information
    console.log(data);
    saveLink.href = data;
    saveLink.download = "paint.png";
}

function line(x1, y1, x2, y2) {
    x1 = +x1;
    y1 = +y1;
    x2 = +x2;
    y2 = +y2;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    document.getElementById('x1').value = 0;
    document.getElementById('y1').value = 0;
    document.getElementById('x2').value = 0;
    document.getElementById('y2').value = 0;

}
//Event listeners for tools
brush.addEventListener("click", brushClick); // Brush Click Event
eraser.addEventListener("click", eraserClick); // Eraser Click Event
color.addEventListener("change", colorChange); // Color Change Event
size.addEventListener("change", sizeChange); // Size Change Event
reset.addEventListener("click", resetClick); // Reset Click event
saveLink.addEventListener("click", saveClick); // Save Click event
undo.addEventListener("click", undoLastPoint, 50); // Undo Click event
redo.addEventListener("click", cRedo, 50); 