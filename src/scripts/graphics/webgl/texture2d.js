"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const webglUtils_1 = require("./webglUtils");
function createEmptyTexture(gl, isResizable, width, height, format, type, internalFormat) {
    if (format === undefined) {
        format = gl.RGBA;
    }
    if (type === undefined) {
        type = gl.UNSIGNED_BYTE;
    }
    if (internalFormat === undefined) {
        internalFormat = format;
    }
    const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    if (maxTextureSize != null && (width < 0 || width > maxTextureSize || height < 0 || height > maxTextureSize)) {
        throw new Error('Invalid texture shape');
    }
    if (type === gl.FLOAT && !gl.getExtension('OES_texture_float')) {
        throw new Error('Floating point textures not supported on this platform');
    }
    webglUtils_1.clearWebGLErrors(gl);
    const handle = createTextureHandle(gl);
    if (!isResizable && webglUtils_1.isWebGL2(gl)) {
        const gl2 = gl;
        let format2;
        if (internalFormat === gl.RGB) {
            format2 = gl2.RGB8;
        }
        else if (internalFormat === gl.RGBA) {
            format2 = gl2.RGBA8;
        }
        else {
            throw new Error('Cannot convert internal format into WebGL2 format');
        }
        gl2.texStorage2D(gl.TEXTURE_2D, 1, format2, width, height);
    }
    else {
        gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, width, height, 0, format, type, null);
    }
    if (webglUtils_1.hasWebGLErrors(gl)) {
        console.warn('createEmptyTexture failed due to a WebGL error');
        return undefined;
    }
    return { handle, width, height, format, type, internalFormat };
}
exports.createEmptyTexture = createEmptyTexture;
function createTexture(gl, data, format, type, internalFormat) {
    if (format === undefined) {
        format = gl.RGBA;
    }
    if (type === undefined) {
        type = gl.UNSIGNED_BYTE;
    }
    if (internalFormat === undefined) {
        internalFormat = format;
    }
    webglUtils_1.clearWebGLErrors(gl);
    const handle = createTextureHandle(gl);
    gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, format, type, data);
    if (webglUtils_1.hasWebGLErrors(gl)) {
        console.warn('createTexture failed due to a WebGL error');
        return undefined;
    }
    return { handle, width: data.width, height: data.height, format, type, internalFormat };
}
exports.createTexture = createTexture;
function disposeTexture(gl, texture) {
    try {
        if (gl && texture) {
            gl.deleteTexture(texture.handle);
        }
    }
    catch (e) {
        DEVELOPMENT && console.error(e);
    }
    return undefined;
}
exports.disposeTexture = disposeTexture;
function bindTexture(gl, unit, texture) {
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, texture ? texture.handle : null);
}
exports.bindTexture = bindTexture;
function resizeTexture(gl, texture, width, height) {
    width = width | 0;
    height = height | 0;
    const { format, type, internalFormat } = texture;
    const maxSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    if (maxSize != null && (width < 0 || width > maxSize || height < 0 || height > maxSize)) {
        throw new Error('Invalid texture size');
    }
    texture.width = width;
    texture.height = height;
    gl.bindTexture(gl.TEXTURE_2D, texture.handle);
    gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, width, height, 0, format, type, null);
}
exports.resizeTexture = resizeTexture;
function createTextureHandle(gl) {
    const texture = gl.createTexture();
    if (!texture) {
        throw new Error('Failed to create texture');
    }
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return texture;
}
//# sourceMappingURL=texture2d.js.map