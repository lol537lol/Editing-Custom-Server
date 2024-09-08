"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const model_1 = require("../../services/model");
const ponyHelpers_1 = require("../../../client/ponyHelpers");
const gameService_1 = require("../../services/gameService");
const ponyAnimations_1 = require("../../../client/ponyAnimations");
let Home = class Home {
    constructor(gameService, model) {
        this.gameService = gameService;
        this.model = model;
        this.state = ponyHelpers_1.defaultPonyState();
        this.previewPony = undefined;
        this.animationTime = 0;
    }
    get authError() {
        return this.model.authError;
    }
    get accountAlert() {
        return this.model.accountAlert;
    }
    get canInstall() {
        return false;
    }
    get playing() {
        return this.gameService.playing;
    }
    get loading() {
        return this.model.loading || this.model.updating;
    }
    get account() {
        return this.model.account;
    }
    get pony() {
        return this.model.pony;
    }
    get previewInfo() {
        return this.previewPony ? this.previewPony.ponyInfo : this.pony.ponyInfo;
    }
    get previewName() {
        return this.previewPony ? this.previewPony.name : this.pony.name;
    }
    get previewTag() {
        return model_1.getPonyTag(this.previewPony || this.pony, this.account);
    }
    signIn(provider) {
        this.model.signIn(provider);
    }
    ngOnInit() {
        let last = Date.now();
        this.interval = setInterval(() => {
            const now = Date.now();
            this.update((now - last) / 1000);
            last = now;
        }, 1000 / 24);
    }
    ngOnDestroy() {
        clearInterval(this.interval);
    }
    update(delta) {
        this.animationTime += delta;
        const animation = ponyAnimations_1.stand;
        this.state.animation = animation;
        this.state.animationFrame = Math.floor(this.animationTime * animation.fps) % animation.frames.length;
    }
};
Home = tslib_1.__decorate([
    core_1.Component({
        selector: 'home',
        templateUrl: 'home.pug',
        styleUrls: ['home.scss'],
    }),
    tslib_1.__metadata("design:paramtypes", [gameService_1.GameService,
        model_1.Model])
], Home);
exports.Home = Home;
//# sourceMappingURL=home.js.map