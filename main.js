(function() {
    "use strict"

    let url = window.location.origin;

    let fetchText = async function(path) {
        let res = await fetch(url + path, {
            method: "GET"
        });
        return await res.text();
    };

    window.addEventListener("load", setupWebGL, false);
    let gl, program;


    async function setupWebGL(evt) {
        
        let sourceV = await fetchText("/vert.c");
        let sourceF = await fetchText("/frag.c");
        
        window.removeEventListener(evt.type, setupWebGL, false);
        if (!(gl = getRenderingContext()))return;
        
        let vertShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertShader, sourceV);
        gl.compileShader(vertShader);
        let fragShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragShader, sourceF);
        gl.compileShader(fragShader);
        program = gl.createProgram();
        gl.attachShader(program, vertShader);
        gl.attachShader(program, fragShader);
        gl.linkProgram(program);
        gl.detachShader(program, vertShader);
        gl.detachShader(program, fragShader);
        gl.deleteShader(vertShader);
        gl.deleteShader(fragShader);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            let linkErrLog = gl.getProgramInfoLog(program);
            cleanup();
            console.log(
                "Shader program did not link successfully. " +
                "Error log: " + linkErrLog
            );
            return;
        }

        initializeAttributes();

        gl.useProgram(program);
        gl.drawArrays(gl.POINTS, 0, 1);

        cleanup();

        
    }

    let buffer;

    function initializeAttributes() {
        gl.enableVertexAttribArray(0);
        buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.vertexAttribPointer(0, 1, gl.FLOAT, false, 0, 0);
    }

    function cleanup() {
        gl.useProgram(null);
        if (buffer ) gl.deleteBuffer(buffer);
        if (program) gl.deleteProgram(program);
    }

    function getRenderingContext() {
        let canvas = document.getElementById("canvas");
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        let gl = canvas.getContext("webgl") ||
            canvas.getContext("experimental-webgl");
        if (!gl) {
            console.log(
                "Failed to get WebGL context." +
                "Your browser or device may not support WebGL."
            );
            return null;
        }
        gl.viewport(0, 0,
            gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        return gl;
    }
})();
/*
let width = 500;
let height = 300;
let canvas = document.getElementById("canvas");
canvas.width = width;
canvas.height = height;
//let ctx = canvas.getContext("webgl");
*/