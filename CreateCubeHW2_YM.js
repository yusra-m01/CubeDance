//Yusra Mannan
//CSE470 
//Professor Hansford





// CreateCubeHW2.js
/* These are the cube vertices and cube definition that must be used for HW 2.
*/
/* TO DO for HW 2:
    Add per face color: each face must have a unique color
*/
var vertices = [
    vec3( 0.0, 0.0,  0.0),
	vec3( 0.0, 1.0,  0.0 ),
	vec3( 1.0, 1.0,  0.0 ),
	vec3( 1.0, 0.0,  0.0 ),
	vec3( 0.0, 0.0, -1.0 ),
	vec3( 0.0, 1.0, -1.0),
	vec3( 1.0, 1.0, -1.0 ),
	vec3( 1.0, 0.0, -1.0 )
];

var vertTr = [
    vec4(vertices[0],1.0),
    vec4(vertices[1],1.0),
    vec4(vertices[2],1.0),
    vec4(vertices[3],1.0),
    vec4(vertices[4],1.0),
    vec4(vertices[5],1.0),
    vec4(vertices[6],1.0),
    vec4(vertices[7],1.0),
    ];

function quad(a, b, c, d) {
   
    var indices = [ a, b, c, a, c, d ];
    for ( var i = 0; i < indices.length; ++i ) {
        console.log("pushed color")
        pointsArray.push(vertTr[indices[i]]);
		colorsArray.push(vertexColors[indices[0]]);
    }
}

function colorCube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}


var vertexColors = [
	vec4(0.9, 0.9, 0.98, 1.0), // Lavender
    vec4(0.68, 0.85, 0.9, 1.0), // Pale blue
    vec4(0.4, 0.85, 0.6, 1.0), // Pale green
    vec4(1.0, 0.71, 0.76, 1.0), // Light pink
    vec4(0.8, 0.8, 1.0, 1.0), // periwinkle
    vec4(0.3, 0.2, 0.40, 0.7), // plum
    vec4(0.83, 0.61, 1.0, 1.0), // PURPLE
    vec4(0.99, 0.76, 0.8, 1.0), // Bubblegum pink
];