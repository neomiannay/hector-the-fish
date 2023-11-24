import Experience from "./Experience";

export default class UI {
    constructor() {
        this.experience = new Experience();

        this.mainScreen = document.querySelector('.main-screen');
        this.loadingScreenElement = document.querySelector('.loading-screen-container');
        this.loadingBarElement = document.querySelector('.loading-bar');
        this.startBtn = document.querySelector('.cta-container .cta');
    }
}