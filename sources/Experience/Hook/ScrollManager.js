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
    event.preventDefault();
    const delta = Math.sign(event.deltaY);

    if (delta !== 0) {
      const isIncreasing = delta > 0;

      const speedFactor = Math.abs(event.deltaY) > 15 ? 2 : 1;

      cancelAnimationFrame(this.animationId);

      this.animate(isIncreasing, speedFactor);
    }
  }

  animate(isIncreasing, speedFactor) {
    const step = () => {
      if ((isIncreasing && this.options.progress < this.options.end) ||
          (!isIncreasing && this.options.progress > this.options.begin)) {
          this.options.progress += this.incrementAmount * speedFactor * (isIncreasing ? 1 : -1);
          this.options.progress = Math.max(this.options.progress, this.options.begin);
          this.options.progress = Math.min(this.options.progress, this.options.end);
          this.updateAmount();
          this.animationId = requestAnimationFrame(step);
      }
    };
    step();
}

  updateAmount() {
    const range = this.options.end - this.options.begin;
    const mappedValue = (this.options.progress.toFixed(1) / 100) * range + this.options.begin;
    console.log('Amount:', mappedValue);
  }

  destroy() {
      window.removeEventListener('wheel', this.handleWheelEvent.bind(this));
      cancelAnimationFrame(this.animationId);
  }
}