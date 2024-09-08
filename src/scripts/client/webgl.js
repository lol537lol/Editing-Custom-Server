"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shaders_1 = require("../generated/shaders");
const frameBuffer_1 = require("../graphics/webgl/frameBuffer");
const shader_1 = require("../graphics/webgl/shader");
const paletteSpriteBatch_1 = require("../graphics/paletteSpriteBatch");
const webglUtils_1 = require("../graphics/webgl/webglUtils");
const graphicsUtils_1 = require("../graphics/graphicsUtils");
const spriteSheetUtils_1 = require("../graphics/spriteSheetUtils");
const sprites = require("../generated/sprites");
const spriteBatch_1 = require("../graphics/spriteBatch");
const constants_1 = require("../common/constants");
const mergeShaderSource = shaders_1.mergeShader;
const spriteShaderSource = shaders_1.spriteShader;
const paletteShaderSource = shaders_1.paletteLayersShader;
const lightShaderSource = shaders_1.lightShader;
function createIndices(vertexCount) {
    const numIndices = (vertexCount * 6 / 4) | 0;
    const indices = new Uint16Array(numIndices);
    for (let i = 0, j = 0; i < numIndices; j = (j + 4) | 0) {
        indices[i++] = (j + 0) | 0;
        indices[i++] = (j + 1) | 0;
        indices[i++] = (j + 2) | 0;
        indices[i++] = (j + 0) | 0;
        indices[i++] = (j + 2) | 0;
        indices[i++] = (j + 3) | 0;
    }
    return indices;
}
function initWebGL(canvas, paletteManager, camera) {
    const gl = webglUtils_1.getWebGLContext(canvas);
    return initWebGLResources(gl, paletteManager, camera);
}
exports.initWebGL = initWebGL;
function initWebGLResources(gl, paletteManager, camera) {
    let renderer = '';
    let failedFBO = false;
    let failedDepthBuffer = false;
    let frameBuffer = {};
    let frameBuffer2 = {};
    gl.enable(gl.DEPTH_TEST); // no reason to not have it enabled at all times, depth reads/writes are controlled by other parameters
    gl.disable(gl.DITHER);
    try {
        frameBuffer_1.createFrameBuffer(gl, frameBuffer, camera.w, camera.h, true, null);
        frameBuffer_1.createFrameBuffer(gl, frameBuffer2, camera.w, camera.h, false, frameBuffer.depthStencilRenderbuffer);
    }
    catch (e) {
        DEVELOPMENT && console.warn(e);
        failedFBO = true;
        failedDepthBuffer = true;
    }
    if (!failedFBO) {
        failedDepthBuffer = frameBuffer.depthStencilRenderbuffer === null;
    }
    spriteSheetUtils_1.createTexturesForSpriteSheets(gl, sprites.spriteSheets);
    const palettes = graphicsUtils_1.createCommonPalettes(paletteManager);
    const mergeShaderRaw = new shader_1.Shader(mergeShaderSource);
    const paletteShaderRaw = new shader_1.Shader(paletteShaderSource);
    const spriteShaderRaw = new shader_1.Shader(spriteShaderSource);
    const lightShaderRaw = new shader_1.Shader(lightShaderSource);
    const indexBuffer = gl.createBuffer();
    if (!indexBuffer) {
        throw new Error(`Failed to allocate index buffer`);
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, createIndices(constants_1.BATCH_VERTEX_CAPACITY_MAX), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    const spriteBatch = new spriteBatch_1.SpriteBatch(gl, constants_1.BATCH_VERTEX_CAPACITY_MAX, indexBuffer);
    const paletteBatch = new paletteSpriteBatch_1.PaletteSpriteBatch(gl, constants_1.BATCH_VERTEX_CAPACITY_MAX, indexBuffer);
    spriteBatch.rectSprite = sprites.pixel;
    paletteBatch.rectSprite = sprites.pixel2;
    paletteBatch.defaultPalette = palettes.defaultPalette;
    paletteManager.init(gl);
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
        renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    }
    const mergeShader = mergeShaderRaw.compile(gl, []);
    const paletteShader = paletteShaderRaw.compile(gl, []);
    const paletteShaderWithDepth = paletteShaderRaw.compile(gl, ['DEPTH_BUFFERED']);
    const spriteShader = spriteShaderRaw.compile(gl, []);
    const spriteShaderWithColor = spriteShaderRaw.compile(gl, ['USE_COLOR']);
    const lightShader = lightShaderRaw.compile(gl, []);
    return {
        gl, mergeShader: mergeShader, paletteShader: paletteShader, paletteShaderWithDepth: paletteShaderWithDepth,
        spriteShader: spriteShader, spriteShaderWithColor: spriteShaderWithColor, lightShader: lightShader,
        spriteBatch, paletteBatch, frameBuffer, frameBuffer2, palettes, failedFBO, failedDepthBuffer, renderer, indexBuffer
    };
}
exports.initWebGLResources = initWebGLResources;
function disposeWebGL(webgl) {
    const { gl } = webgl;
    webglUtils_1.unbindAllTexturesAndBuffers(gl);
    spriteSheetUtils_1.disposeTexturesForSpriteSheets(gl, sprites.spriteSheets);
    frameBuffer_1.disposeFrameBuffer(gl, webgl.frameBuffer);
    shader_1.disposeShaderProgramData(gl, webgl.paletteShader);
    shader_1.disposeShaderProgramData(gl, webgl.paletteShaderWithDepth);
    shader_1.disposeShaderProgramData(gl, webgl.spriteShader);
    shader_1.disposeShaderProgramData(gl, webgl.spriteShaderWithColor);
    shader_1.disposeShaderProgramData(gl, webgl.lightShader);
    webgl.spriteBatch.dispose();
    webgl.paletteBatch.dispose();
    gl.deleteBuffer(webgl.indexBuffer);
}
exports.disposeWebGL = disposeWebGL;
//# sourceMappingURL=webgl.js.map