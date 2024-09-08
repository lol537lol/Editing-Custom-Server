"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const emoji_1 = require("../../../client/emoji");
const icons_1 = require("../../../client/icons");
const data_1 = require("../../../client/data");
const router_1 = require("@angular/router");
let Help = class Help {
    // allow scrolling to #issues and #rules fragments
    constructor(route) {
        this.route = route;
        this.leftIcon = icons_1.faArrowLeft;
        this.rightIcon = icons_1.faArrowRight;
        this.upIcon = icons_1.faArrowUp;
        this.downIcon = icons_1.faArrowDown;
        this.emotes = emoji_1.emojis.map(e => e.names[0]);
        this.mac = /Macintosh/.test(navigator.userAgent);
        this.contactEmail = data_1.contactEmail;
        this.contactDiscord = data_1.contactDiscord;
    }
    ngAfterViewInit() {
        this.route.fragment.subscribe(f => {
            const element = document.querySelector("#" + f);
            if (element)
                setTimeout(() => element.scrollIntoView(), 10);
        });
    }
};
Help = tslib_1.__decorate([
    core_1.Component({
        selector: 'help',
        templateUrl: 'help.pug',
        styleUrls: ['help.scss'],
    }),
    tslib_1.__metadata("design:paramtypes", [router_1.ActivatedRoute])
], Help);
exports.Help = Help;
//# sourceMappingURL=help.js.map