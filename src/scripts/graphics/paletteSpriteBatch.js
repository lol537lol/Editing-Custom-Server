"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseSpriteBatch_1 = require("./baseSpriteBatch");
const color_1 = require("../common/color");
const spriteUtils_1 = require("../client/spriteUtils");
const paletteManager_1 = require("./paletteManager");
const defaultRectSprite = spriteUtils_1.createSprite(0, 0, 1, 1, 0, 0, 3);
const types = new Float32Array([
    color_1.colorToFloat(color_1.colorFromRGBA(255, 0, 0, 0)),
    color_1.colorToFloat(color_1.colorFromRGBA(0, 0, 255, 0)),
    color_1.colorToFloat(color_1.colorFromRGBA(0, 0, 0, 0)),
    color_1.colorToFloat(color_1.colorFromRGBA(255, 0, 0, 255)),
    color_1.colorToFloat(color_1.colorFromRGBA(0, 255, 0, 255)),
    color_1.colorToFloat(color_1.colorFromRGBA(0, 0, 255, 255)),
    color_1.colorToFloat(color_1.colorFromRGBA(0, 0, 0, 255)),
]);
/*
function pushVertex(
    vertices: Float32Array, _verticesUint32: Uint32Array, index: number,
    x: number, y: number, u: number, v: number, pu: number, pv: number, c: number, c1: number, transform: Matrix2D
) {
    vertices[index++] = transform[0] * x + transform[2] * y + transform[4];
    vertices[index++] = transform[1] * x + transform[3] * y + transform[5];
    vertices[index++] = u;
    vertices[index++] = v;
    vertices[index++] = pu;
    vertices[index++] = pv;
    vertices[index++] = c;
    vertices[index++] = c1;
}

function pushQuad(
    vertices: Float32Array, verticesUint32: Uint32Array,
    transform: mat2d, index: number, type: number, color: number, palette: Palette,
    sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number
) {
    const c1 = types[type];

    const y2 = dy + dh;
    const x2 = dx + dw;

    const u1 = sx + 0.1;
    const v1 = sy + 0.1;
    const u2 = sx + sw;
    const v2 = sy + sh;

    const pu = palette.u;
    const pv = palette.v;

    pushVertex(vertices, verticesUint32, index, dx, dy, u1, v1, pu, pv, color, c1, transform);
    pushVertex(vertices, verticesUint32, index + 8, x2, dy, u2, v1, pu, pv, color, c1, transform);
    pushVertex(vertices, verticesUint32, index + 16, x2, y2, u2, v2, pu, pv, color, c1, transform);
    pushVertex(vertices, verticesUint32, index + 24, dx, y2, u1, v2, pu, pv, color, c1, transform);

    return index + 32;
}
*/
function pushQuad(vertices, transform, index, type, color, palette, sx, sy, sw, sh, dx, dy, dz, dw, dh) {
    index |= 0;
    const c1 = types[type];
    const y2 = dy + dh;
    const x2 = dx + dw;
    const u1 = sx + 0.1;
    const v1 = sy + 0.1;
    const u2 = sx + sw;
    const v2 = sy + sh;
    const pu = palette.u; // + palette.v * 1024;
    const pv = palette.v;
    const t0 = transform[0];
    const t1 = transform[1];
    const t2 = transform[2];
    const t3 = transform[3];
    const t4 = transform[4];
    const t5 = transform[5];
    vertices[index++] = t0 * dx + t2 * dy + t4;
    vertices[index++] = t1 * dx + t3 * dy + t5;
    vertices[index++] = dz;
    vertices[index++] = u1;
    vertices[index++] = v1;
    vertices[index++] = pu;
    vertices[index++] = pv;
    vertices[index++] = color;
    vertices[index++] = c1;
    vertices[index++] = t0 * x2 + t2 * dy + t4;
    vertices[index++] = t1 * x2 + t3 * dy + t5;
    vertices[index++] = dz;
    vertices[index++] = u2;
    vertices[index++] = v1;
    vertices[index++] = pu;
    vertices[index++] = pv;
    vertices[index++] = color;
    vertices[index++] = c1;
    vertices[index++] = t0 * x2 + t2 * y2 + t4;
    vertices[index++] = t1 * x2 + t3 * y2 + t5;
    vertices[index++] = dz;
    vertices[index++] = u2;
    vertices[index++] = v2;
    vertices[index++] = pu;
    vertices[index++] = pv;
    vertices[index++] = color;
    vertices[index++] = c1;
    vertices[index++] = t0 * dx + t2 * y2 + t4;
    vertices[index++] = t1 * dx + t3 * y2 + t5;
    vertices[index++] = dz;
    vertices[index++] = u1;
    vertices[index++] = v2;
    vertices[index++] = pu;
    vertices[index++] = pv;
    vertices[index++] = color;
    vertices[index++] = c1;
    return index;
}
// function colorWithAlpha(color: number, alpha: number) {
// 	return ((color & 0xffffff00) | (((color & 0xff) * alpha) & 0xff)) >>> 0;
// }
class PaletteSpriteBatch extends baseSpriteBatch_1.BaseSpriteBatch {
    constructor(gl, vertexCapacityMax, indexBuffer) {
        super(gl, vertexCapacityMax, indexBuffer, [
            { name: 'position', size: 3 },
            { name: 'texcoord0', size: 4 },
            { name: 'color', size: 4, type: gl.UNSIGNED_BYTE, normalized: true },
            { name: 'color1', size: 4, type: gl.UNSIGNED_BYTE, normalized: true },
        ]);
        this.depth = 1;
        this.palette = true;
        this.defaultPalette = paletteManager_1.createPalette(new Uint32Array(0));
    }
    drawImage(type, color, palette, sx, sy, sw, sh, dx, dy, dw, dh) {
        if (this.spritesCapacity <= this.spritesCount) {
            this.flush();
        }
        this.index = pushQuad(this.vertices, this.transform, this.index, type, baseSpriteBatch_1.getColorFloat(color, this.globalAlpha), palette || this.defaultPalette, sx, sy, sw, sh, dx, dy, this.depth, dw, dh);
        this.spritesCount++;
    }
    drawRect(color, x, y, w, h) {
        if (w !== 0 && h !== 0) {
            if (this.spritesCapacity <= this.spritesCount) {
                this.flush();
            }
            const s = this.rectSprite || defaultRectSprite;
            this.index = pushQuad(this.vertices, this.transform, this.index, s.type, baseSpriteBatch_1.getColorFloat(color, this.globalAlpha), this.defaultPalette, s.x, s.y, s.w, s.h, x, y, this.depth, w, h);
            this.spritesCount++;
        }
    }
    drawSprite(s, color, palette, x, y) {
        if (s.w !== 0 && s.h !== 0) {
            if (this.spritesCapacity <= this.spritesCount) {
                this.flush();
            }
            if (this.hasCrop) {
                const crop = this.cropRect;
                let sx = s.x;
                let sy = s.y;
                let w = s.w;
                let h = s.h;
                let dx = x + s.ox;
                let dy = y + s.oy;
                const cropX = crop.x; // - this.transform[4];
                const cropY = crop.y; // - this.transform[5];
                const shiftLeft = cropX - dx;
                const shiftTop = cropY - dy;
                const shiftRight = (dx + w) - (cropX + crop.w);
                const shiftBottom = (dy + h) - (cropY + crop.h);
                if (shiftLeft > 0) {
                    sx += shiftLeft;
                    dx += shiftLeft;
                    w -= shiftLeft;
                }
                if (shiftRight > 0) {
                    w -= shiftRight;
                }
                if (shiftTop > 0) {
                    sy += shiftTop;
                    dy += shiftTop;
                    h -= shiftTop;
                }
                if (shiftBottom > 0) {
                    h -= shiftBottom;
                }
                if (w > 0 && h > 0) {
                    this.index = pushQuad(this.vertices, this.transform, this.index, s.type, baseSpriteBatch_1.getColorFloat(color, this.globalAlpha), palette || this.defaultPalette, sx, sy, w, h, dx, dy, this.depth, w, h);
                    this.spritesCount++;
                }
            }
            else {
                this.index = pushQuad(this.vertices, this.transform, this.index, s.type, baseSpriteBatch_1.getColorFloat(color, this.globalAlpha), palette || this.defaultPalette, s.x, s.y, s.w, s.h, x + s.ox, y + s.oy, this.depth, s.w, s.h);
                this.spritesCount++;
            }
        }
    }
    patchBatchDepth(batch) {
        for (let i = 0; i < batch.length; i += 9) {
            batch[i + 2] = this.depth;
        }
    }
}
exports.PaletteSpriteBatch = PaletteSpriteBatch;
//# sourceMappingURL=paletteSpriteBatch.js.map