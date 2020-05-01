class Players {
    constructor(playerNum, maxTurns, channel) {
        this.channel = channel;
        this.playerNum = playerNum;
        this.maxTurns = maxTurns;
        this.currentPlayerIndex = 0;
        this.turnFullCount = 0;
        this.players = [];

        this._initPlayers();
    }

    _initPlayers() {
        for (let i = 0; i < this.playerNum; i++) {
            const player = { id: i + 1, corrects: 0, turns: 0, end: false };
            this.players.push(player);
        }

        this.channel.pub('players:game-start');
    }

    addPlayerCorrects(corrects) {
        this.players[this.currentPlayerIndex].corrects += corrects;
    }

    isGameOver() {
        return this.turnFullCount === this.playerNum;
    }

    _getWinners() {
        let winners = [];
        let maxCorrect = 0;
        this.players.forEach(p => {
            if (p.corrects === maxCorrect) {
                winners.push(p.id);
                return;
            }
            if (p.corrects > maxCorrect) {
                winners = [p.id];
                maxCorrect = p.corrects;
            }
        });

        return winners;
    }

    addTurn(afterWrongGuess) {
        afterWrongGuess = afterWrongGuess || false;
        this.players[this.currentPlayerIndex].turns++;
        if (this.players[this.currentPlayerIndex].turns === this.maxTurns) {
            this.players[this.currentPlayerIndex].end = true;
            this.turnFullCount++;
            if (true === afterWrongGuess) {
                this.nextPlayer();
            }
        }
    }

    nextPlayer() {
        this.channel.pub('players:next-player'); 

        if (this.currentPlayerIndex === this.playerNum - 1) {
            this.currentPlayerIndex = 0;
        } else {
            this.currentPlayerIndex++;
        }

        if (true === this.players[this.currentPlayerIndex].end) {
            if (true === this.isGameOver()) {
                this.channel.pub('players:game-end', this._getWinners());

                return;
            }
            this.nextPlayer();

            return;
        }
    
        this.channel.pub('players:alert-next-player', this.players[this.currentPlayerIndex].id);
    }

    getCurrentPlayer() {
        return this.players[this.currentPlayerIndex];
    }
}
