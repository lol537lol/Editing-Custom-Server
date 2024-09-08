"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const modal_1 = require("ngx-bootstrap/modal");
const game_1 = require("../../../client/game");
const data_1 = require("../../../client/data");
const buttonActions_1 = require("../../../client/buttonActions");
const settingsService_1 = require("../../services/settingsService");
const constants_1 = require("../../../common/constants");
const utils_1 = require("../../../common/utils");
const icons_1 = require("../../../client/icons");
let ActionBar = class ActionBar {
    constructor(game, settings, modalService) {
        this.game = game;
        this.settings = settings;
        this.modalService = modalService;
        this.blurred = false;
        this.cogIcon = icons_1.faCog;
        this.activeAction = undefined;
        this.shortcuts = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='];
        this._editable = false;
        this.isWaitingForActionsModal = false;
    }
    get editable() {
        return this._editable;
    }
    set editable(value) {
        if (this._editable !== value) {
            this._editable = value;
            this.updateFreeSlots();
            if (!value) {
                this.save();
            }
        }
    }
    get actions() {
        return this.game.actions;
    }
    get mobile() {
        return data_1.isMobile;
    }
    get hasScroller() {
        return this.editable && data_1.isMobile;
    }
    get blurCount() {
        const boxWidth = data_1.isMobile ? 50 : 40;
        const width = 450 + this.scroller.nativeElement.scrollLeft;
        return Math.floor(width / boxWidth);
    }
    use(action) {
        buttonActions_1.useAction(this.game, action);
    }
    drag(index) {
        this.actions[index].action = undefined;
        this.updateFreeSlots();
    }
    drop(action, index) {
        this.actions[index].action = action;
        this.updateFreeSlots();
    }
    save() {
        const settings = Object.assign({}, this.settings.account, { actions: buttonActions_1.serializeActions(this.actions) });
        this.settings.saveAccountSettings(settings);
    }
    scroll(e) {
        if (e.deltaY) {
            const delta = e.deltaY > 0 ? 1 : -1;
            this.scroller.nativeElement.scrollLeft += delta * 20;
        }
    }
    openActions() {
        if (this.isWaitingForActionsModal) {
            return;
        }
        if (this.modalRef) {
            this.closeActions();
        }
        else {
            // if the action menu was opened from the settings dropdown, just do nothing
            // it means you can't close that menu by clicking on this button, but it's
            // a minor issue
            if (document.body.classList.contains('actions-modal-opened')) {
                return;
            }
            this.isWaitingForActionsModal = true;
            this.modalRef = this.modalService.show(this.actionsModal, { ignoreBackdropClick: true });
        }
    }
    closeActions() {
        if (this.isWaitingForActionsModal) {
            return;
        }
        if (this.modalRef) {
            this.isWaitingForActionsModal = true;
            this.modalRef.hide();
            this.modalRef = undefined;
        }
    }
    actionsModalNotify() {
        this.isWaitingForActionsModal = false;
    }
    updateFreeSlots() {
        const actions = this.actions;
        if (this.editable) {
            while (actions.length < 5 || (utils_1.last(actions).action !== undefined && actions.length < constants_1.ACTIONS_LIMIT)) {
                actions.push({ action: undefined });
            }
        }
        else {
            while (actions.length > 0 && utils_1.last(actions).action === undefined) {
                actions.pop();
            }
        }
    }
};
tslib_1.__decorate([
    core_1.ViewChild('scroller', { static: true }),
    tslib_1.__metadata("design:type", core_1.ElementRef)
], ActionBar.prototype, "scroller", void 0);
tslib_1.__decorate([
    core_1.ViewChild('actionsModal', { static: true }),
    tslib_1.__metadata("design:type", core_1.ElementRef)
], ActionBar.prototype, "actionsModal", void 0);
tslib_1.__decorate([
    core_1.Input(),
    tslib_1.__metadata("design:type", Object)
], ActionBar.prototype, "blurred", void 0);
tslib_1.__decorate([
    core_1.Input(),
    tslib_1.__metadata("design:type", Object),
    tslib_1.__metadata("design:paramtypes", [Object])
], ActionBar.prototype, "editable", null);
ActionBar = tslib_1.__decorate([
    core_1.Component({
        selector: 'action-bar',
        templateUrl: 'action-bar.pug',
        styleUrls: ['action-bar.scss'],
    }),
    tslib_1.__metadata("design:paramtypes", [game_1.PonyTownGame, settingsService_1.SettingsService, modal_1.BsModalService])
], ActionBar);
exports.ActionBar = ActionBar;
//# sourceMappingURL=action-bar.js.map