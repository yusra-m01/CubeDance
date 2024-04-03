//Yusra Mannan
//CSE470 
//Professor Hansford


var canvas;
var gl;

//cube
var numVertices  = 36;
var pointsArray = [];
var colorsArray = [];

var xMouse = 0;
var yMouse = 0;

//rotation
var Xaxis = 1;
var Yaxis = 1;
var Zaxis = 1;

//Og size of the cubes
var ogSize = 0.2;


//rotation/size values for the slider
var value; 
var valueSize;
var input;
var inputSize;

var outerTheta  = 0.0;//rotation angles
var centerTheta = 0.0;

var CenterXaxis = 0;//middle cube
var CenterYaxis = 0;
var CenterZaxis = 0;

//transformations
var matrix1; 
var matrix2;
var pMatrix;

var modelView //shader
var projection;

//Rotation/path settings
var rotationSetting = 0;
var pathSetting = 0;

//Rotation speed control
var rotationSpeed = 1.5;


window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
	gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.6, 0.8, 0.7, 0.4 );
    gl.enable(gl.DEPTH_TEST); 
	var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    colorCube();

//origin
	var origin = vec4(0.0, 0.0, 0.0, 1.0);
	pointsArray.push(origin); 
	colorsArray.push(vertexColors[0]);
		
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );
    
    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
 
    modelView = gl.getUniformLocation( program, "modelView" );
	matrix1 = mat4();
    matrix2 = mat4();
		
	

	//add the event listeners for mouse clicks/button clicks
	document.getElementById("ButtonIdentity").onclick = function(){ //Center cube becomes stationary
        dir = 3;
        console.log("clicked");    
	};

    canvas.addEventListener("mousemove", (e) => { //mouse pos
        xMouse = e.offsetX;
        yMouse = e.offsetY;
    });
    //If mouse is clicked, then whichever cube is in that or nearest to that area will decide the new rotation direction of the center. 
	//axis of rotation of clicked cube = new axis of rotation for center cube
	canvas.addEventListener("mousedown", (e) =>{
        console.log("xMouse = " + xMouse);
        console.log("yMouse = " + yMouse);
	
	
	//center cube rotates like TOP CUBE
        if((35 <= yMouse)&&(yMouse <= 90)&&(210 <= xMouse)&&(xMouse <= 290)){
            CenterXaxis = 0;
            CenterYaxis = Yaxis;
            dir = 1;
            rotationDir = 1;

        }
	//center cube rotates like TOP RIGHT CUBE
        if((80 <= yMouse)&&(160 <= 420)&&(330 <= xMouse)&&(xMouse <= 420)){
            CenterXaxis = Xaxis;
            CenterYaxis = Yaxis;
            dir = 1;
            rotationDir = 1;

        }
	//center cube rotates like RIGHT CUBE
        if((210 <= yMouse)&&(yMouse <= 290)&&(405 <= xMouse)&&(xMouse <= 485)){
            CenterXaxis = Xaxis;
            CenterYaxis = 0;
            dir = 1;
            rotationDir = 1;

        }
	//center cube rotates like BOTTOM RIGHT CUBE
        if((330 <= yMouse)&&(yMouse <= 410)&&(330 <= xMouse)&&(xMouse <= 410)){
            CenterXaxis = Xaxis;
            CenterYaxis = -Yaxis;
            dir = 1;
            rotationDir = 1;

        }
	//center cube rotates like BOTTOM CUBE
        if((410 <= yMouse)&&(yMouse <= 480)&&(210 <= xMouse)&&(xMouse <= 290)){
            CenterXaxis = 0;
            CenterYaxis = -Yaxis;
            dir = 1;
            rotationDir = 1;

        }
	//center cube rotates like BOTTOM LEFT CUBE
        if((330 <= yMouse)&&(yMouse <= 410)&&(80 <= xMouse)&&(xMouse <= 160)){
            CenterXaxis = -Xaxis;
            CenterYaxis = -Yaxis;
            dir = 1;
            rotationDir = 1;

        }
	//center cube rotates like LEFT CUBE
        if((210 <= yMouse)&&(yMouse <= 290)&&(30 <= xMouse)&&(xMouse <= 90)){
            CenterXaxis = -Xaxis;
            CenterYaxis = 0;
            dir = 1;
            rotationDir = 1;

        }
	//center cube rotates like TOP LEFT CUBE
        if((80 <= yMouse)&&(yMouse <= 160)&&(80 <= xMouse)&&(xMouse <= 160)){
            CenterXaxis = -Xaxis;
            CenterYaxis = Yaxis;
            dir = 1;
            rotationDir = 1;
        }
		
        if((225 <= yMouse)&&(yMouse <= 275)&&(225 <= xMouse)&&(xMouse <= 275)){
            CenterXaxis = -Xaxis;
            CenterYaxis = 0;
            dir = 0;
            rotationDir = 1;

        }
    });

    value = document.querySelector("#value");
    input = document.querySelector("#pi_input");
    value.textContent = input.value;
    input.addEventListener("input", (event) => {
        value.textContent = event.target.value;
    });
    valueSize = document.querySelector("#sizenum");
    inputSize = document.querySelector("#scalesize");
    valueSize.textContent = inputSize.value;
    inputSize.addEventListener("input", (event) => {
        console.log(ogSize);
        ogSize = valueSize.textContent;
        console.log(ogSize);

        valueSize.textContent = event.target.value;
        console.log(valueSize.textContent);
        matrix2 = mult(scalem(valueSize.textContent/ogSize,valueSize.textContent/ogSize,valueSize.textContent/ogSize), matrix2);
    });
       
    render();
}

var scaling = vec3(0.2,0.2,0.2);

function matrixEnd(mtrix){
    matrix1 = mult(matrix1, scalem(scaling));
    matrix1 = mult(matrix1, translate(-0.5,-0.5,0.5));
    gl.uniformMatrix4fv( modelView, false, flatten(matrix1) );
    gl.drawArrays( gl.TRIANGLES, 0, numVertices );
}


var dir = 0;
var rotationDir = 0;

var render = function() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    outerTheta += rotationSpeed
    rotationSpeed = Number(value.textContent);
    scaling[0] = Number(valueSize.textContent);
    scaling[1] = Number(valueSize.textContent);
    scaling[2] = Number(valueSize.textContent);
    //console.log(Number(value.textContent) + 3);

	//TOP CUBE
    matrix1 = mult(translate(0,0.75,0), rotate(outerTheta, 0.0, Yaxis, 0.0));
    matrixEnd(matrix1);
	
    //TOP RIGHT CUBE
    matrix1 = mult(rotate(outerTheta, Xaxis, Yaxis, 0), translate(0.5,0.5,0))
    matrixEnd(matrix1);
	
	//RIGHT CUBE
    matrix1 = mult(translate(0.75,0,0), rotate(outerTheta, Xaxis, 0.0, 0.0));
    matrixEnd(matrix1);
	
	 //BOTTOM RIGHT CUBE
    matrix1 = mult(translate(0.5,-0.5,0), rotate(outerTheta, Xaxis, -Yaxis, 0.0));
    matrixEnd(matrix1);

	//BOTTOM CUBE
    matrix1 = mult(translate(0,-0.75,0), rotate(outerTheta, 0.0, -Yaxis, 0.0));
    matrixEnd(matrix1);


    //BOTTOM LEFT CUBE
    matrix1 = mult(translate(-0.5,-0.5,0), rotate(outerTheta, -Xaxis, -Yaxis, 0.0));
    matrixEnd(matrix1);

    //LEFT CUBE
    matrix1 = mult(translate(-0.75,0,0), rotate(outerTheta, -Xaxis, 0.0, 0.0));
    matrixEnd(matrix1);

    //TOP LEFT CUBE
    matrix1 = mult(translate(-0.5,0.5,0), rotate(outerTheta, -Xaxis, Yaxis, 0.0));
    matrixEnd(matrix1);
     
    //CENTER CUBE
    if(dir == 0){
        matrix2 = mult(scalem(scaling),translate(-0.5,-0.5,0.5));
        centerTheta = 0     
    }
    else if (dir == 1){
        matrix2 = mult(rotate(rotationSpeed,CenterXaxis,CenterYaxis,0.0), matrix2);
    }
    else{
    }
	
    gl.uniformMatrix4fv( modelView, false, flatten(matrix2) );
    gl.drawArrays( gl.TRIANGLES, 0, numVertices );
		
		
		

    requestAnimFrame(render);
}
