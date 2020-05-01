class Dictionary {
    constructor(words) {
        this.words = words;
    }

    check(words) {
        const wordNotAvail = words.filter(w => this.words.indexOf(w) < 0);

        return new Promise((resolve, reject) => {
            if (wordNotAvail.length > 0) {
                reject(wordNotAvail);
            } else {
                resolve('hit');
            }
        });
    }
}