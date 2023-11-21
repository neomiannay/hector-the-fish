import lerp from "../Utils/lerp";

export default class ScrollManager {
  constructor() {
    this.options = {
        begin: 0,
        end: 100,
        progress: 0
    };
    this.incrementAmount = .05;
    this.animationId = null;
    this.init();
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

  destroy() {
      window.removeEventListener('wheel', this.handleWheelEvent.bind(this));
      cancelAnimationFrame(this.animationId);
  }
}