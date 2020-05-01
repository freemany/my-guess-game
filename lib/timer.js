class Timer {
    constructor($el, config, channel) {
        this.channel = channel;
        this.$el = $el;
        this.maxCount = config.maxTimerCount;
        this.count = this.maxCount;
        this.timeout = 1000;
        this.timeup = false;
        this.timer = null;

        this._init();
    }

    _init() {
        this.$count = this.$el.find('.count');
        this.render();
    }

    render() {
        this.$count.text(this.count);
    }

    _counting() {
        this.timer = setInterval(() => {
            if (true === this.isTimeup()) {
                return;
            }
            this.count--;
            this.render();
        }, this.timeout);
    }

    start(afterAlert) {
        this.end();
        this.$el.show();
        this.count = true === afterAlert ? this.maxCount + 1 : this.maxCount;
        this.render();
        this._counting();
    }

    end() {
        this.$el.hide();
        this.count = this.maxCount;
        clearInterval(this.timer);
    }

    pause() {
        clearInteval(this.timer);
    }

    resume() {
        this._counting();
    }

    isTimeup() {
        if (0 === this.count) {
            this.end();

            this.channel.pub('timer:time-up');

            return true;
        }

        return false;
    }
}