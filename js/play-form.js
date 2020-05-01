class PlayForm {
    constructor($el, config, utils) {
        this.$el = $el;
        this.config = config;
        this.utils = utils;
        this.successText = 'Well done!';
        this.errorTextPrefix = 'Here are the wrong words: ';

        this._init();
    }

    run(dictionary, players) {
        this.dictionary = dictionary; 
        this.players = players; 
        this.show();
        this.render();
        this.cleanUpForm();
    }

    show() {
        this.$el.show();
    }

    hide() {
        this.$el.hide();
    }

    _init() {
        this.$input = this.$el.find('.js-player-input');
        this.$invalid = this.$el.find('.js-invalid');
        this.$submitBtn = this.$el.find('.js-submit-btn');
        this.$userId = this.$el.find('.js-user-id');
        this.$success = this.$el.find('.success');
        this.$error = this.$el.find('.error');

        this._initRender();
        this._initlisteners();
    }

    _initRender() {
        this.hide();
        this.$invalid.hide();
        this.$success.hide();
        this.$error.hide();
        this.$invalid.find('span').text(this.config.maxGuessWords);
    }

    render() {
        this.$userId.text(this.players.getCurrentPlayer().id);
    }

    _initlisteners() {
        this.$submitBtn.click((e) => this._submitBtnClick(e));
    }

    cleanUpForm() {
        this._cleanUpBeforeSubmit();
        this.$input.val('');
    }

    _cleanUpBeforeSubmit() {
        this.$error.hide();
        this.$invalid.hide();
        this.$input.removeClass('is-invalid');
    }

    _validate(words) {
        if (this.utils.isEmptyWords(words) || words.length > this.config.maxGuessWords) {
            this.$invalid.show();
            this.$input.addClass('is-invalid');

            return false;
        }

        return true;
    }

    async _submitBtnClick(e) {
        e.preventDefault();

        this._cleanUpBeforeSubmit();

        const inputWords = this.$input.val().replace(/\s/g, '').split(',');
        if (false === this._validate(inputWords)) {
            return;
        }

        try {
            await this.dictionary.check(inputWords);

            this.$success.show();
            this.$success.text(this.successText);
            setTimeout(() => this.$success.hide(), 2000);

            this.players.addPlayerCorrects(inputWords.length);
            this.players.addTurn();
            this.players.nextPlayer();

        } catch (wrongWords) { 
            console.log('Dictionary reject', wrongWords);
            this.$error.show();
            this.$error.text(this.errorTextPrefix + wrongWords.join(', '));

            this.players.addTurn(true);
        }

        this.render();
    }

    afterTimeUp() {
        this.players.addTurn();
        this.players.nextPlayer();
        this.render();
        this.cleanUpForm();
    }
}