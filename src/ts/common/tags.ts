import { CharacterTag, FontPalettes } from './interfaces';
import { hasRole, AccountRoles } from './accountUtils';
import { MOD_COLOR, ADMIN_COLOR, PATREON_COLOR, ANNOUNCEMENT_COLOR, WHITE, OP_COLOR, CONTRIBUTOR_COLOR, 
	NPC_COLOR } from './colors';

const placeholder = { id: '', tagClass: '', label: '' };
const tags: { [key: string]: CharacterTag; } = {
	'superadmin': {...placeholder, name: 'super admin', className: 'dev', color: ADMIN_COLOR},
	'dev': { ...placeholder, name: 'developer', className: 'dev', color: WHITE },
	'dev:prog': {...placeholder, name: 'dev programmer', className: 'dev', color: ADMIN_COLOR},
	'dev:art': { ...placeholder, name: 'dev artist', className: 'dev', color: ADMIN_COLOR },
	'dev:music': { ...placeholder, name: 'dev musician', className: 'dev', color: ADMIN_COLOR },
	'mod': { ...placeholder, name: 'moderator', className: 'mod', color: MOD_COLOR },
	'op': { ...placeholder, name: 'operator', className: 'op', color: OP_COLOR },
	'contributor': {...placeholder, name: 'contributor', className: 'contr', color: CONTRIBUTOR_COLOR},
	'npc': { ...placeholder, name: 'npc', className: 'npc', color: NPC_COLOR },
	'sup1': { ...placeholder, name: 'supporter', className: 'sup1', color: PATREON_COLOR },
	'sup2': { ...placeholder, name: 'supporter', className: 'sup2', color: WHITE },
	'sup3': { ...placeholder, name: 'supporter', className: 'sup3', color: WHITE },
	'hidden': { ...placeholder, name: 'hidden', className: 'hidden', color: ANNOUNCEMENT_COLOR }, //все  ссуществующие теги
};

Object.keys(tags).forEach(id => {
	const tag = tags[id];
	tag.id = id;
	tag.label = `<${tag.name.toUpperCase()}>`;
	tag.tagClass = `tag-${tag.className}`;
});

export const emptyTag: CharacterTag = { id: '', name: 'no tag', label: '', className: '', tagClass: '', color: 0 };

export function getAllTags() {
	return Object.keys(tags).map(key => tags[key]);
}

export function getTag(id: string | undefined): CharacterTag | undefined {
	return id ? tags[id] : undefined;
}

export function getTagPalette(tag: CharacterTag, palettes: FontPalettes) {
	switch (tag.id) {
		case 'sup2': return palettes.supporter2;
		case 'sup3': return palettes.supporter3;
		default: return palettes.white;
	}
}

export function canUseTag(account: AccountRoles, tag: string) {
    if (tag === 'mod') {
        return hasRole(account, 'mod');
    } else if (tag === 'dev' || /^dev:/.test(tag)) {
        return hasRole(account, 'dev');
    } else if (tag === 'superadmin') {
        return hasRole(account, 'superadmin'); 
    } else if (tag === 'op') {
        return hasRole(account, 'op');
    } else if (tag === 'contributor')  {
    	return hasRole(account, 'contr');
    } else if (tag === 'npc') {
		return hasRole(account, 'npc');
	} else {
        return false;
    }
}


export function getAvailableTags(account: AccountRoles): CharacterTag[] {
	return getAllTags().filter(tag => canUseTag(account, tag.id));
}
