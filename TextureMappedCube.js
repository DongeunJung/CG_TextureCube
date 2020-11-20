var gl;

function testGLError(functionLastCalled) {
    /* gl.getError returns the last error that occurred using WebGL for debugging */ 
    var lastError = gl.getError();

    if (lastError != gl.NO_ERROR) {
        alert(functionLastCalled + " failed (" + lastError + ")");
        return false;
    }
    return true;
}

function initialiseGL(canvas) {
    try {
        // Try to grab the standard context. If it fails, fallback to experimental
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        gl.viewport(0, 0, canvas.width, canvas.height);
    }
    catch (e) {
    }

    if (!gl) {
        alert("Unable to initialise WebGL. Your browser may not support it");
        return false;
    }
    return true;
}

var flagAnimation=1;
function toogleAnimation(){
	flagAnimation^=1;
}

var shaderProgram;

var vertexData;
var elementData = [ 
	0,  1,  2,  3,  4,  5,
	6,  7,  8,  9,  10, 11,
	12, 13, 14, 15, 16, 17,
	18, 19, 20, 21, 22, 23,
	24, 25, 26, 27, 28, 29,
	30, 31, 32, 33, 34, 35
	]; 
	
function createCubePos(sx, sy, sz){
	vertexData = [	 
	 sx/2,  sy/2,  sz/2, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,//0
	-sx/2,  sy/2,  sz/2, 0.7, 0.0, 0.0, 1.0, 1.0, 0.0,//1
	-sx/2, -sy/2,  sz/2, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0,//2
		
	 sx/2,  sy/2,  sz/2, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,//3
	-sx/2, -sy/2,  sz/2, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0,//4
	 sx/2, -sy/2,  sz/2, 0.7, 0.0, 0.0, 1.0, 0.0, 1.0,//5//front
	
	 sx/2,  sy/2,  sz/2, 1.0, 0.4, 0.0, 1.0, 1.0, 1.0,//6
	 sx/2, -sy/2,  sz/2, 0.6, 0.4, 0.0, 1.0, 0.0, 1.0,//7
	 sx/2, -sy/2, -sz/2, 1.0, 0.4, 0.0, 1.0, 0.0, 0.0,//8
		
	 sx/2,  sy/2,  sz/2, 1.0, 0.4, 0.0, 1.0, 1.0, 1.0,//9
	 sx/2, -sy/2, -sz/2, 1.0, 0.4, 0.0, 1.0, 0.0, 0.0,//10
	 sx/2,  sy/2, -sz/2, 0.6, 0.4, 0.0, 1.0, 1.0, 0.0,//11//right
		 
	 sx/2,  sy/2,  sz/2, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0,//12
	 sx/2,  sy/2, -sz/2, 1.0, 0.7, 0.0, 1.0, 1.0, 0.0,//13
	-sx/2,  sy/2, -sz/2, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0,//14
		 
	 sx/2,  sy/2,  sz/2, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0,//15
	-sx/2,  sy/2, -sz/2, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0,//16
	-sx/2,  sy/2,  sz/2, 1.0, 0.7, 0.0, 1.0, 0.0, 1.0,//17//top
		
	-sx/2, -sy/2, -sz/2, 0.8, 0.2, 1.0, 1.0, 0.0, 0.0,//18
	-sx/2,  sy/2, -sz/2, 0.5, 0.2, 1.0, 1.0, 0.0, 1.0,//19
	 sx/2,  sy/2, -sz/2, 0.8, 0.2, 1.0, 1.0, 1.0, 1.0,//20
		
	-sx/2, -sy/2, -sz/2, 0.8, 0.2, 1.0, 1.0, 0.0, 0.0,//21
	 sx/2,  sy/2, -sz/2, 0.8, 0.2, 1.0, 1.0, 1.0, 1.0,//22
	 sx/2, -sy/2, -sz/2, 0.5, 0.2, 1.0, 1.0, 1.0, 0.0,//23//back
	
	-sx/2, -sy/2, -sz/2, 0.0, 0.0, 1.0, 1.0, 1.0, 0.0,//24
	-sx/2, -sy/2,  sz/2, 0.0, 0.0, 0.7, 1.0, 1.0, 1.0,//25
	-sx/2,  sy/2,  sz/2, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0,//26
		 
	-sx/2, -sy/2, -sz/2, 0.0, 0.0, 1.0, 1.0, 1.0, 0.0,//27
	-sx/2,  sy/2,  sz/2, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0,//28
	-sx/2,  sy/2, -sz/2, 0.0, 0.0, 0.7, 1.0, 0.0, 0.0,//29//left
		
	-sx/2, -sy/2, -sz/2, 0.0, 0.6, 0.3, 1.0, 1.0, 0.0,//30
	 sx/2, -sy/2, -sz/2, 0.0, 0.3, 0.3, 1.0, 1.0, 1.0,//31
	 sx/2, -sy/2,  sz/2, 0.0, 0.6, 0.3, 1.0, 0.0, 1.0,//32
		
	-sx/2, -sy/2, -sz/2, 0.0, 0.6, 0.3, 1.0, 1.0, 0.0,//33
	 sx/2, -sy/2,  sz/2, 0.0, 0.6, 0.3, 1.0, 0.0, 1.0,//34
	-sx/2, -sy/2,  sz/2, 0.0, 0.3, 0.3, 1.0, 0.0, 0.0,//35//bottom
	];
}

function initialiseBuffer() {

    gl.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

	gl.elementBuffer = gl.createBuffer(); 
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.elementBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(elementData),gl.STATIC_DRAW);
	
	var texture = gl.createTexture(); 
	gl.bindTexture(gl.TEXTURE_2D, texture);
	// Fill the texture with a 1x1 red pixel.
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, document.getElementById("newimage")); 
	//gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_NEAREST); // It is default
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    return testGLError("initialiseBuffers");
}

function initialiseShaders() {

    var fragmentShaderSource = '\
			varying highp vec4 color; \
			varying mediump vec2 texture;\
			uniform sampler2D sampler;\
			void main(void) \
			{ \
				gl_FragColor=0.15*color+texture2D(sampler, texture);\
			}';

    gl.fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(gl.fragShader, fragmentShaderSource);
    gl.compileShader(gl.fragShader);
    // Check if compilation succeeded
    if (!gl.getShaderParameter(gl.fragShader, gl.COMPILE_STATUS)) {
        alert("Failed to compile the fragment shader.\n" + gl.getShaderInfoLog(gl.fragShader));
        return false;
    }

    // Vertex shader code
    var vertexShaderSource = '\
			attribute highp vec3 myVertex; \
			attribute highp vec4 myColor; \
			attribute highp vec2 myTexture;\
			uniform mediump mat4 transformationMatrix; \
			uniform mediump mat4 viewMatrix; \
			uniform mediump mat4 projMatrix; \
			varying highp vec4 color;\
			varying mediump vec2 texture;\
			void main(void)  \
			{ \
				gl_Position = projMatrix*viewMatrix*transformationMatrix*vec4(myVertex, 1.0); \
				color = myColor; \
				texture=myTexture;\
			}';

    gl.vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(gl.vertexShader, vertexShaderSource);
    gl.compileShader(gl.vertexShader);
    // Check if compilation succeeded
    if (!gl.getShaderParameter(gl.vertexShader, gl.COMPILE_STATUS)) {
        alert("Failed to compile the vertex shader.\n" + gl.getShaderInfoLog(gl.vertexShader));
        return false;
    }

    gl.programObject = gl.createProgram();
    gl.attachShader(gl.programObject, gl.fragShader);
    gl.attachShader(gl.programObject, gl.vertexShader);

    gl.bindAttribLocation(gl.programObject, 0, "myVertex");
    gl.bindAttribLocation(gl.programObject, 1, "myColor");
	gl.bindAttribLocation(gl.programObject, 2, "myTexture");

    gl.linkProgram(gl.programObject);

    if (!gl.getProgramParameter(gl.programObject, gl.LINK_STATUS)) {
        alert("Failed to link the program.\n" + gl.getProgramInfoLog(gl.programObject));
        return false;
    }

    gl.useProgram(gl.programObject);
    console.log("myVertex Location is: ", gl.getAttribLocation(gl.programObject, "myColor"));

    return testGLError("initialiseShaders");
}

var angle = 0.0; 

function renderScene() {

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    gl.clear(gl.COLOR_BUFFER_BIT);
	
	gl.enable(gl.DEPTH_TEST);

    var transformationMatrixLocation = gl.getUniformLocation(gl.programObject, "transformationMatrix");
	var viewMatrixLocation=gl.getUniformLocation(gl.programObject, "viewMatrix");
	var projMatrixLocation=gl.getUniformLocation(gl.programObject, "projMatrix");
	
	var transformationMatrix=new Float32Array(16);
	var xRotationMatrix = new Float32Array(16);
	var yRotationMatrix = new Float32Array(16);
	var zRotationMatrix = new Float32Array(16);

	var identityMatrix = new Float32Array(16);
	glMatrix.mat4.identity(identityMatrix);
	
	glMatrix.mat4.rotate(yRotationMatrix, identityMatrix, angle, [0, 1, 0]);
	glMatrix.mat4.rotate(xRotationMatrix, identityMatrix, angle/2, [1, 0, 0]);
	glMatrix.mat4.rotate(zRotationMatrix, identityMatrix, angle, [0, 0, 1]);
	glMatrix.mat4.mul(transformationMatrix, yRotationMatrix, xRotationMatrix);
	glMatrix.mat4.mul(transformationMatrix, zRotationMatrix, transformationMatrix);
    
	
	if(flagAnimation){
		angle += 0.01;
	}
	var viewMatrix=new Float32Array(16);
	var projMatrix=new Float32Array(16);
	glMatrix.mat4.lookAt(viewMatrix, [0, 0, 3], [0, 0, 0], [0, 1, 0]);
	glMatrix.mat4.perspective(projMatrix, glMatrix.glMatrix.toRadian(45), 800 / 600, 0.1, 1000.0);
    gl.uniformMatrix4fv(transformationMatrixLocation, gl.FALSE, transformationMatrix);
	gl.uniformMatrix4fv(viewMatrixLocation, gl.FALSE, viewMatrix);
	gl.uniformMatrix4fv(projMatrixLocation, gl.FALSE, projMatrix);

    if (!testGLError("gl.uniformMatrix4fv")) {
        return false;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.vertexBuffer);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, gl.FALSE, 9*4, 0);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 4, gl.FLOAT, gl.FALSE, 9*4, 3*4);
	gl.enableVertexAttribArray(2);
	gl.vertexAttribPointer(2, 2, gl.FLOAT, gl.FALSE, 9*4, 7*4);

    if (!testGLError("gl.vertexAttribPointer")) {
        return false;
    }

    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT,0);
	
	console.log("Enum for Primitive Assumbly", gl.TRIANGLES, gl.TRIANGLE, gl.POINTS);  
    if (!testGLError("gl.drawArrays")) {
        return false;
    }

    return true;
}

function createCube(x, y, z) {
    var canvas = document.getElementById("newcanvas");
	
	createCubePos(x, y, z)

    if (!initialiseGL(canvas)) {
        return;
    }

    if (!initialiseBuffer()) {
        return;
    }

    if (!initialiseShaders()) {
        return;
    }

    // Render loop
    requestAnimFrame = (function () {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame ||
			function (callback) {
			    window.setTimeout(callback, 1000, 60);
			};
    })();

    (function renderLoop() {
        if (renderScene()) {
            // Everything was successful, request that we redraw our scene again in the future
            requestAnimFrame(renderLoop);
        }
    })();
}
