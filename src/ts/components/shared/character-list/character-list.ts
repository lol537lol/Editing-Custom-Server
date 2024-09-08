import { Component, Output, EventEmitter, ViewChild, ElementRef, OnInit, Input, NgZone } from '@angular/core';
import { uniq } from 'lodash';
import { PonyObject } from '../../../common/interfaces';
import { clamp, flatten } from '../../../common/utils';
import { isMobile } from '../../../client/data';
import { Model } from '../../services/model';
import { LATEST_CHARACTER_LIMIT } from '../../../common/constants';
import { faHashtag } from '../../../client/icons';

@Component({
	selector: 'character-list',
	templateUrl: 'character-list.pug',
	styleUrls: ['character-list.scss'],
})
export class CharacterList implements OnInit {
	readonly hashIcon = faHashtag;
	@Input() inGame = false;
	@Input() canNew = false;
	@Output() close = new EventEmitter<void>();
	@Output() newCharacter = new EventEmitter<void>();
	@Output() selectCharacter = new EventEmitter<PonyObject>();
	@Output() previewCharacter = new EventEmitter<PonyObject | undefined>();
	@ViewChild('ariaAnnounce', { static: true }) ariaAnnounce!: ElementRef;
	@ViewChild('searchInput', { static: true }) searchInput!: ElementRef;
	search?: string;
	selectedIndex = -1;
	ponies: PonyObject[] = [];
	tags: string[] = [];
	private previewPony: PonyObject | undefined = undefined;

	constructor(private model: Model, private zone: NgZone) {}

	get selectedPony() {
		return this.model.pony;
	}

	get searchable() {
		return this.model.ponies.length > LATEST_CHARACTER_LIMIT;
	}

	get placeholder() {
		return `search (${this.model.ponies.length} / ${this.model.characterLimit} ponies)`;
	}

	ngOnInit() {
		this.updatePonies();

		this.tags = uniq(flatten(this.ponies.map(p => (p.desc || '').split(/ /g).map(x => x.trim())))
			.filter(x => /^#/.test(x)))
			.sort();

		if (!isMobile) {
			setTimeout(() => this.searchInput.nativeElement.focus());
		}
	}

	setPreview(pony: PonyObject) {
		this.previewPony = pony;
		this.previewCharacter.emit(this.model.parsePonyObject(pony));
	}

	unsetPreview(pony: PonyObject) {
		if (this.previewPony === pony) {
			this.previewPony = undefined;
			this.previewCharacter.emit(undefined);
		}
	}

	updatePonies() {
		this.zone.run(() => {
			const query = this.search && this.search.toLowerCase().trim();

			function matchesWords(text: string, words: string[]) {
				for (const word of words) {
					if (text.indexOf(word) === -1) {
						return false;
					}
				}
				return true;
			}

			if (query) {
				const words = query.split(/ /g).map(x => x.trim());

				this.ponies = this.model.ponies.filter(pony => {
					const text = `${pony.name} ${pony.desc || ''}`.toLowerCase();
					return matchesWords(text, words);
				}).sort((a, b) => this.comparePonies(a, b));
			} else {
				this.ponies = this.model.ponies.slice().sort((a, b) => this.comparePonies(a, b));
			}

			this.setSelectedIndex(this.selectedIndex);
			this.previewCharacter.emit(undefined);
		});
	}

	comparePonies(a: PonyObject, b: PonyObject): number {
		return a.name.localeCompare(b.name);
	}

	select(pony: PonyObject) {
		this.selectCharacter.emit(pony);
	}

	createNew() {
		this.newCharacter.emit();
	}

	private setSelectedIndex(index: number) {
		this.zone.run(() => {
			this.selectedIndex = clamp(index, -1, this.ponies.length - 1);
			const pony = this.ponies[index];
			this.ariaAnnounce.nativeElement.textContent = pony ? pony.name : '';

			if (pony) {
				this.setPreview(pony);
			} else if (this.previewPony) {
				this.unsetPreview(this.previewPony);
			}
		});
	}
}
