"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colors_1 = require("../common/colors");
const color_1 = require("../common/color");
const baseStateBatch_1 = require("./baseStateBatch");
const glVao_1 = require("./webgl/glVao");
const vaoAttributes_1 = require("./webgl/vaoAttributes");
const timing_1 = require("../client/timing");
const mat2d_1 = require("../common/mat2d");
// const BATCH_BUFFER_SIZE = 2048; // 8kb
// const BATCH_BUFFER_POOL_SIZE = 5;
// const pool: ArrayBuffer[] = [];
// function aquireBuffer(size: number): Float32Array | undefined {
// 	if (size <= BATCH_BUFFER_SIZE) {
// 		if (!pool.length) console.log('alloc');
// 		const buffer = pool.pop() || new ArrayBuffer(BATCH_BUFFER_SIZE);
// 		return new Float32Array(buffer, 0, size);
// 	} else {
// 		DEVELOPMENT && console.warn(`Failed to aquire buffer of size: ${size}`);
// 		return undefined;
// 	}
// }
// function releaseBuffer(buffer: Float32Array) {
// 	if (pool.length < BATCH_BUFFER_POOL_SIZE) {
// 		pool.push(buffer.buffer);
// 	} else {
// 		console.log('delete');
// 	}
// }
const WHITE_FLOAT = color_1.colorToFloat(colors_1.WHITE);
function getColorFloat(color, alpha) {
    return (color === colors_1.WHITE && alpha === 1) ? WHITE_FLOAT : color_1.colorToFloatAlpha(color, alpha);
}
exports.getColorFloat = getColorFloat;
class BaseSpriteBatch extends baseStateBatch_1.BaseStateBatch {
    constructor(gl, vertexCapacityMax, indexBuffer, attributes) {
        super();
        this.gl = gl;
        this.vertexCapacityMax = vertexCapacityMax;
        this.attributes = attributes;
        this.depth = 1;
        this.drawnTrisStats = 0;
        this.flushes = 0;
        this.index = 0;
        this.spritesCount = 0;
        this.rectSprite = undefined;
        this.batching = false;
        this.startBatchIndex = 0;
        this.startBatchSprites = 0;
        const bytesPerVertex = vaoAttributes_1.getVAOAttributesSize(gl, attributes);
        this.vertices = new Float32Array(vertexCapacityMax * bytesPerVertex);
        this.spritesCapacity = (vertexCapacityMax / 4) | 0; // 4 vertices per sprite
        this.floatsPerSprite = bytesPerVertex | 0; // bytesPerVertex * 4 / sizeof(float)
        const vertexBuffer = gl.createBuffer();
        if (!vertexBuffer) {
            throw new Error(`Failed to allocate vertex buffer`);
        }
        this.vertexBuffer = vertexBuffer;
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);
        this.indexBuffer = indexBuffer;
        this.vao = glVao_1.createVAO(gl, vaoAttributes_1.createVAOAttributes(gl, attributes, vertexBuffer), indexBuffer);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
    dispose() {
        disposeBuffers(this.gl, this);
    }
    begin() {
        if (!this.vao) {
            throw new Error('Disposed');
        }
        this.batching = false;
        this.vao.bind();
    }
    end() {
        if (!this.vao) {
            throw new Error('Disposed');
        }
        this.flush();
        this.vao.unbind();
    }
    drawBatch(batch) {
        if (DEVELOPMENT && !mat2d_1.isIdentity(this.transform)) {
            throw new Error('Cannot transform batch');
        }
        const batchSpriteCount = (batch.length / this.floatsPerSprite) | 0;
        if (this.spritesCapacity < (this.spritesCount + batchSpriteCount)) {
            this.flush();
        }
        this.vertices.set(batch, this.index);
        this.index += batch.length;
        this.spritesCount += batchSpriteCount;
    }
    startBatch() {
        if (this.batching) {
            throw new Error('Cannot start new batch');
        }
        this.startBatchIndex = this.index;
        this.startBatchSprites = this.spritesCount;
        this.batching = true;
    }
    finishBatch() {
        if (!this.batching) {
            throw new Error('Cannot finish batch');
        }
        this.batching = false;
        try {
            // const batch = aquireBuffer(this.index - this.startBatchIndex);
            // if (batch) {
            // 	batch.set(this.vertices.subarray(this.startBatchIndex, this.index));
            // }
            // return batch;
            return this.vertices.slice(this.startBatchIndex, this.index);
        }
        catch (_a) {
            return undefined;
        }
    }
    releaseBatch(_batch) {
        // releaseBuffer(batch);
    }
    flush() {
        if (this.index === 0)
            return;
        if (!this.vao || !this.vertexBuffer) {
            throw new Error('Disposed');
        }
        const gl = this.gl;
        if (this.batching) {
            TIMING && timing_1.timeStart('bufferSubData');
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vertices.subarray(0, this.startBatchIndex));
            TIMING && timing_1.timeEnd();
            TIMING && timing_1.timeStart('vao.draw');
            this.vao.draw(this.gl.TRIANGLES, this.startBatchSprites * 6, 0);
            TIMING && timing_1.timeEnd();
            this.drawnTrisStats += this.startBatchSprites * 2;
            this.spritesCount -= this.startBatchSprites;
            this.index -= this.startBatchIndex;
            this.vertices.copyWithin(0, this.startBatchIndex, this.startBatchIndex + this.index);
            this.startBatchIndex = 0;
            this.startBatchSprites = 0;
        }
        else {
            TIMING && timing_1.timeStart('bufferSubData');
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vertices.subarray(0, this.index));
            TIMING && timing_1.timeEnd();
            TIMING && timing_1.timeStart('vao.draw');
            this.vao.draw(this.gl.TRIANGLES, this.spritesCount * 6, 0);
            TIMING && timing_1.timeEnd();
            this.drawnTrisStats += this.spritesCount * 2;
            this.spritesCount = 0;
            this.index = 0;
        }
        this.flushes++;
    }
}
exports.BaseSpriteBatch = BaseSpriteBatch;
function disposeBuffers(gl, batch) {
    try {
        if (batch.vao) {
            batch.vao.dispose();
        }
        if (batch.vertexBuffer) {
            gl.deleteBuffer(batch.vertexBuffer);
        }
    }
    catch (e) {
        DEVELOPMENT && console.error(e);
    }
    batch.vao = undefined;
    batch.vertexBuffer = undefined;
}
//# sourceMappingURL=baseSpriteBatch.js.map