const Game = (function (config, utils, resource, channel, $) {
    let isStarted = false;

    function end(winners) {
        isStarted = false;

        resource.run('playForm', playForm => playForm.hide());
        resource.run('startForm', startForm => startForm.show());
        resource.run('timer', timer => timer.end());

        const winnerLabel = winners.length === 1 ? 'Winner' : 'Winners';
        alert('Congradulations to ' + winnerLabel + ': ' + winners.join(', '));
    }

    function initDictionary(words) {
        return new Dictionary(words);
    }

    function initPlayers(playerNum) {
        const players = new Players(playerNum, config.maxTurns, channel);

        return players;
    }

    function initStartForm($el) {
        const startForm = new StartForm($el, config, utils, channel);
        resource.register('startForm', startForm);

        channel.sub('startForm:start-button-clicked', ({ words, playerNum }) => {
            const dictionary = initDictionary(words);
            const players = initPlayers(playerNum);
            resource.run('playForm', playForm => playForm.run(dictionary, players));

            start();
        });

        return startForm;
    }

    function initPlayForm($el) {
        const playForm = new PlayForm($el, config, utils);
        resource.register('playForm', playForm);

        channel.sub('players:next-player', () => {
            resource.run('timer', timer => timer.start(true));
            resource.run('playForm', playForm => playForm.cleanUpForm());
        });
        channel.sub('players:game-end', (winners) => {
            resource.run('timer', timer => timer.end());
            end(winners);
        });
        channel.sub('players:alert-next-player', (playerId) => {
            alertNextPlayer(playerId);
        });
        channel.sub('players:game-start', () => {
            resource.run('timer', timer => timer.start());
        });

        return playForm;
    }

    function initTimer($el) {
        const timer = new Timer($el, config, channel);
        resource.register('timer', timer);

        channel.sub('timer:time-up', () => {
            resource.run('playForm', playForm => playForm.afterTimeUp());
        });
    }

    function start() {
        isStarted = true;
    }

    function run() {
        resource.run('startForm', startForm => startForm.run());
    }

    function alertNextPlayer(playId) {
        alert('Next player: ' + playId);
    }

    function init(opts) {
        if (opts['$startForm'] && opts['$startForm'] instanceof $) {
            initStartForm(opts['$startForm'])
        }
        if (opts['$playForm'] && opts['$playForm'] instanceof $) {
            initPlayForm(opts['$playForm'])
        }
        if (opts['$timer'] && opts['$timer'] instanceof $) {
            initTimer(opts['$timer'])
        }
    }

    return {
        init: init,
        run: run,
    }
})(Config, Utils, ResourceManager, ChannelManager, $);