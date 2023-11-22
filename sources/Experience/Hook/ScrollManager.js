import lerp from "../Utils/lerp";

export default class ScrollManager {
    constructor() {
        this.options = {
            begin: 0,
            end: 100,
            progress: 0,
            scrollingDirection: null,
            isScrolling: false,
        };
        this.incrementAmount = .05;
        this.animationId = null;
        this.scrollTimeout = null;
        this.scrollStopCallback = null;
        this.init();
    }

    init() {
        window.addEventListener('wheel', this.handleWheelEvent.bind(this));
    }

    handleWheelEvent(event) {
        const delta = Math.sign(event.deltaY);

        if (delta !== 0) {
            const isIncreasing = delta > 0;
            const speedFactor = 1 + Math.min(Math.abs(event.deltaY) / 100, 0.5);

            cancelAnimationFrame(this.animationId);

            this.animate(isIncreasing, speedFactor);
            this.setScrolling(true);

            clearTimeout(this.scrollTimeout);
            this.scrollTimeout = setTimeout(() => {
                this.setScrolling(false);
                if (this.scrollStopCallback) {
                    this.scrollStopCallback();
                }
            }, 50); // timeout duration in milliseconds
        }

        if (delta > 0) {
            this.options.scrollingDirection = 'up';
        } else if (delta < 0) {
            this.options.scrollingDirection = 'down';
        }
    }

    animate(isIncreasing, speedFactor) {
        const targetProgress = isIncreasing ? this.options.end : this.options.begin;
        const step = () => {
            const amt = this.incrementAmount * 0.01;
            this.options.progress = lerp(this.options.progress, targetProgress, amt);

            if ((isIncreasing && this.options.progress < this.options.end) ||
                (!isIncreasing && this.options.progress > this.options.begin)) {
                this.updateAmount();
                this.animationId = requestAnimationFrame(step);
            }
        };
        step();
    }

    updateAmount() {
        const range = this.options.end - this.options.begin;
        const mappedValue = (this.options.progress.toFixed(1) / 100) * range + this.options.begin;
        this.options.amount = mappedValue;
    }

    setScrolling(isScrolling) {
        this.options.isScrolling = isScrolling;
    }

    onScrollStop(callback) {
        this.scrollStopCallback = callback;
    }

    destroy() {
        window.removeEventListener('wheel', this.handleWheelEvent.bind(this));
        clearTimeout(this.scrollTimeout);
        cancelAnimationFrame(this.animationId);
    }
}
