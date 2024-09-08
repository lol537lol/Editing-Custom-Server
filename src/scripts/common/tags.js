"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const accountUtils_1 = require("./accountUtils");
const colors_1 = require("./colors");
const placeholder = { id: '', tagClass: '', label: '' };
const tags = {
    'superadmin': Object.assign({}, placeholder, { name: 'super admin', className: 'dev', color: colors_1.ADMIN_COLOR }),
    'dev': Object.assign({}, placeholder, { name: 'developer', className: 'dev', color: colors_1.WHITE }),
    'dev:prog': Object.assign({}, placeholder, { name: 'dev programmer', className: 'dev', color: colors_1.ADMIN_COLOR }),
    'dev:art': Object.assign({}, placeholder, { name: 'dev artist', className: 'dev', color: colors_1.ADMIN_COLOR }),
    'dev:music': Object.assign({}, placeholder, { name: 'dev musician', className: 'dev', color: colors_1.ADMIN_COLOR }),
    'mod': Object.assign({}, placeholder, { name: 'moderator', className: 'mod', color: colors_1.MOD_COLOR }),
    'op': Object.assign({}, placeholder, { name: 'operator', className: 'op', color: colors_1.OP_COLOR }),
    'contributor': Object.assign({}, placeholder, { name: 'contributor', className: 'contr', color: colors_1.CONTRIBUTOR_COLOR }),
    'npc': Object.assign({}, placeholder, { name: 'npc', className: 'npc', color: colors_1.NPC_COLOR }),
    'sup1': Object.assign({}, placeholder, { name: 'supporter', className: 'sup1', color: colors_1.PATREON_COLOR }),
    'sup2': Object.assign({}, placeholder, { name: 'supporter', className: 'sup2', color: colors_1.WHITE }),
    'sup3': Object.assign({}, placeholder, { name: 'supporter', className: 'sup3', color: colors_1.WHITE }),
    'hidden': Object.assign({}, placeholder, { name: 'hidden', className: 'hidden', color: colors_1.ANNOUNCEMENT_COLOR }),
};
Object.keys(tags).forEach(id => {
    const tag = tags[id];
    tag.id = id;
    tag.label = `<${tag.name.toUpperCase()}>`;
    tag.tagClass = `tag-${tag.className}`;
});
exports.emptyTag = { id: '', name: 'no tag', label: '', className: '', tagClass: '', color: 0 };
function getAllTags() {
    return Object.keys(tags).map(key => tags[key]);
}
exports.getAllTags = getAllTags;
function getTag(id) {
    return id ? tags[id] : undefined;
}
exports.getTag = getTag;
function getTagPalette(tag, palettes) {
    switch (tag.id) {
        case 'sup2': return palettes.supporter2;
        case 'sup3': return palettes.supporter3;
        default: return palettes.white;
    }
}
exports.getTagPalette = getTagPalette;
function canUseTag(account, tag) {
    if (tag === 'mod') {
        return accountUtils_1.hasRole(account, 'mod');
    }
    else if (tag === 'dev' || /^dev:/.test(tag)) {
        return accountUtils_1.hasRole(account, 'dev');
    }
    else if (tag === 'superadmin') {
        return accountUtils_1.hasRole(account, 'superadmin');
    }
    else if (tag === 'op') {
        return accountUtils_1.hasRole(account, 'op');
    }
    else if (tag === 'contributor') {
        return accountUtils_1.hasRole(account, 'contr');
    }
    else if (tag === 'npc') {
        return accountUtils_1.hasRole(account, 'npc');
    }
    else {
        return false;
    }
}
exports.canUseTag = canUseTag;
function getAvailableTags(account) {
    return getAllTags().filter(tag => canUseTag(account, tag.id));
}
exports.getAvailableTags = getAvailableTags;
//# sourceMappingURL=tags.js.map