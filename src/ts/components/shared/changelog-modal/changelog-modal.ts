import { Component, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'changelog-modal',
	templateUrl: 'changelog-modal.pug',
	styleUrls: ['changelog-modal.scss'],
})
export class ChangelogModal {
	@Output() close = new EventEmitter();

	closeModal() {
		this.close.emit();
	}
}
