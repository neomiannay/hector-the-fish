import Experience from "../Experience";
import lerp from "../Utils/lerp";

export default class ScrollManager {
  constructor() {
    this.experience = new Experience();
    this.debug = this.experience.debug;

    this.options = {
      begin: 0,
      end: 100,
      progress: 13, // 0
      scrollingDirection: null,
      isScrolling: false,
    };
    this.incrementAmount = .05;
    this.animationId = null;
    this.scrollTimeout = null;
    this.scrollStopCallback = null;
    this.init();

    if (this.debug) {
        this.setDebug();
    }
  }

    setDebug() {
        this.debugFolder = this.debug.addFolder({
            title: 'ScrollManager',
            expanded: true
        });

        this.debugFolder
            .addBinding(this.options, 'progress', {
                min: 0,
                max: 100,
                step: 0.1
            })
            .on('change', ({value}) => {
                this.progress = value;
            });

    }

    init() {
        window.addEventListener('wheel', this.handleWheelEvent.bind(this));
    }

    handleWheelEvent(event) {
        const delta = Math.sign(event.deltaY);

        if (delta !== 0) {
            const isIncreasing = delta > 0;

            // Use a more gradual change in speedFactor based on deltaY
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
            // Smaller amt value for smoother interpolation
            const amt = this.incrementAmount * 0.01; // Adjust this value as needed

            this.options.progress = lerp(this.options.progress, targetProgress, amt);

            // Check if the animation needs to continue
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
