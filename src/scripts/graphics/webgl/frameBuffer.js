"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const texture2d_1 = require("./texture2d");
function createFrameBuffer(gl, target, width, height, createDepthStencil, depthStencilRenderbuffer) {
    const handle = gl.createFramebuffer();
    if (!handle) {
        throw new Error('Failed to create frame buffer');
    }
    const resources = createFrameBufferResources(gl, width, height, createDepthStencil);
    target.handle = handle;
    target.colorTexture = resources.colorTexture;
    target.depthStencilRenderbuffer = resources.depthStencilRenderbuffer;
    target.width = width;
    target.height = height;
    target.owningDepthStencil = createDepthStencil;
    if (!createDepthStencil) {
        target.depthStencilRenderbuffer = depthStencilRenderbuffer;
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, handle);
    bindFrameBufferAttachments(gl, target);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}
exports.createFrameBuffer = createFrameBuffer;
function disposeFrameBuffer(gl, buffer) {
    try {
        if (gl && buffer) {
            gl.deleteFramebuffer(buffer.handle);
            if (buffer.colorTexture) {
                gl.deleteTexture(buffer.colorTexture.handle);
            }
            if (buffer.depthStencilRenderbuffer && buffer.owningDepthStencil) {
                gl.deleteRenderbuffer(buffer.depthStencilRenderbuffer);
            }
        }
    }
    catch (e) {
        DEVELOPMENT && console.error(e);
    }
    return undefined;
}
exports.disposeFrameBuffer = disposeFrameBuffer;
function bindFrameBuffer(gl, { handle }) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, handle);
}
exports.bindFrameBuffer = bindFrameBuffer;
function unbindFrameBuffer(gl) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}
exports.unbindFrameBuffer = unbindFrameBuffer;
function bindFrameBufferAttachments(gl, { colorTexture, depthStencilRenderbuffer }) {
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, colorTexture.handle, 0);
    if (depthStencilRenderbuffer) {
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthStencilRenderbuffer);
    }
    gl.depthMask(true);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.depthMask(false);
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
        throw new Error('Failed to set framebuffer attachments');
    }
}
function createFrameBufferResources(gl, width, height, createDepthBuffer) {
    const colorTexture = texture2d_1.createEmptyTexture(gl, false, width, height, gl.RGB);
    if (!colorTexture) {
        throw new Error('Failed to create frame buffer\'s color texture');
    }
    let depthStencilRenderbuffer = null;
    if (createDepthBuffer) {
        depthStencilRenderbuffer = gl.createRenderbuffer();
        if (depthStencilRenderbuffer) {
            gl.bindRenderbuffer(gl.RENDERBUFFER, depthStencilRenderbuffer);
            gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
            gl.bindRenderbuffer(gl.RENDERBUFFER, null);
        }
        else {
            console.warn('depth/stencil is not available');
        }
    }
    return { colorTexture, depthStencilRenderbuffer };
}
//# sourceMappingURL=frameBuffer.js.map