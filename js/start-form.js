class StartForm {
    constructor($el, config, utils, channel) {
        this.config = config;
        this.utils = utils;
        this.channel = channel;
        this.$el = $el;
        this._init();
    }

    _init() {
        this.$playerNum = this.$el.find('.js-player-num');
        this.$invalid = this.$el.find('.js-invalid');
        this.$maxWordCount = this.$invalid.find('span');
        this.$dictionaryWords = this.$el.find('.js-dictionary-words');
        this.$startBtn = this.$el.find('.js-start-btn');
        this.$invalidPlayer = this.$el.find('.js-player-invalid');

        this._initRender();
        this._initlisteners();
    }

    run() { }

    show() {
        this.$el.show();
    }

    hide() {
        this.$el.hide();
    }

    _initRender() {
        this.$invalid.hide();
        this.$invalidPlayer.hide();

        this.$maxWordCount.text(this.config.maxWordCountInDictionary);
        this.$el.find('.js-max').text(this.config.maxWordCountInDictionary);
        this.$invalidPlayer.find('span.js-min').text(this.config.playerRange[0]);
        this.$invalidPlayer.find('span.js-max').text(this.config.playerRange[1]);
    }

    _initlisteners() {
        this.$startBtn.click((e) => this._startBtnClick(e));
    }

    _validate(playerNum, words) {
        if (isNaN(playerNum) || playerNum < this.config.playerRange[0] || playerNum > this.config.playerRange[1]) {
            this.$invalidPlayer.show();
            this.$playerNum.addClass('is-invalid');

            return false;
        }

        if (this.utils.isEmptyWords(words) || words.length > this.config.maxWordCountInDictionary) {
            this.$invalid.show();
            this.$dictionaryWords.addClass('is-invalid');

            return false;
        }

        return true;
    }

    _startBtnClick(e) {
        e.preventDefault();

        this.$invalid.hide();
        this.$dictionaryWords.removeClass('is-invalid');
        this.$invalidPlayer.hide();
        this.$playerNum.removeClass('is-invalid');

        const words = this.$dictionaryWords.val().replace(/\s/g, '').split(',');
        const playerNum = parseInt(this.$playerNum.val());
        if (false === this._validate(playerNum, words)) {
            return;
        }

        this.channel.pub('startForm:start-button-clicked', {words, playerNum});

        this._cleanUpForm();
        this.hide();
    }
 
    _cleanUpForm() {
        this.$playerNum.val('');
        this.$dictionaryWords.val('');
    }
}