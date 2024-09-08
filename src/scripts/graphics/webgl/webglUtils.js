"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const webgl_debug_1 = require("webgl-debug");
const errors_1 = require("../../common/errors");
function getWebGLContext(canvas) {
    const options = {
        alpha: false,
        preserveDrawingBuffer: false,
        premultipliedAlpha: false,
        antialias: false,
        depth: false
    };
    let gl = canvas.getContext('webgl2', options)
        || canvas.getContext('webgl', options)
        || canvas.getContext('experimental-webgl', options);
    if (!gl) {
        throw new Error(errors_1.WEBGL_CREATION_ERROR);
    }
    // debug context will check every GL call for errors and will
    // emit a console message with a stack trace if there was an error,
    // but it can slow execution down by more than 2x depending
    // on the platform so it isn't on by default even in DEVELOPMENT
    const useDebugContext = false;
    if (useDebugContext) {
        gl = webgl_debug_1.makeDebugContext(gl);
        if (!gl) {
            throw new Error(errors_1.WEBGL_CREATION_ERROR);
        }
    }
    return gl;
}
exports.getWebGLContext = getWebGLContext;
function isWebGL2(gl) {
    return !!(gl && gl.MAX_ELEMENT_INDEX);
}
exports.isWebGL2 = isWebGL2;
function getWebGLError(gl) {
    const error = gl.getError();
    switch (error) {
        case gl.NO_ERROR: return 'NO_ERROR';
        case gl.INVALID_ENUM: return 'INVALID_ENUM';
        case gl.INVALID_VALUE: return 'INVALID_VALUE';
        case gl.INVALID_OPERATION: return 'INVALID_OPERATION';
        case gl.INVALID_FRAMEBUFFER_OPERATION: return 'INVALID_FRAMEBUFFER_OPERATION';
        case gl.OUT_OF_MEMORY: return 'OUT_OF_MEMORY';
        case gl.CONTEXT_LOST_WEBGL: return 'CONTEXT_LOST_WEBGL';
        default: return `${error}`;
    }
}
exports.getWebGLError = getWebGLError;
function unbindAllTexturesAndBuffers(gl) {
    try {
        const numTextureUnits = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS) | 0;
        for (let i = 0; i < numTextureUnits; i++) {
            gl.activeTexture(gl.TEXTURE0 + i);
            gl.bindTexture(gl.TEXTURE_2D, null);
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
    catch (e) {
        DEVELOPMENT && console.error(e);
    }
}
exports.unbindAllTexturesAndBuffers = unbindAllTexturesAndBuffers;
function clearWebGLErrors(gl) {
    while (hasWebGLErrors(gl))
        ;
}
exports.clearWebGLErrors = clearWebGLErrors;
function hasWebGLErrors(gl) {
    return gl.getError() !== gl.NO_ERROR;
}
exports.hasWebGLErrors = hasWebGLErrors;
//# sourceMappingURL=webglUtils.js.map