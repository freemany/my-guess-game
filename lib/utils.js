const Utils = (function () {
    const isEmptyWords = (words) => {
        return Array.isArray(words) && words.length === 1 && words[0] === '';
    };

    return {
        isEmptyWords: isEmptyWords,
    }
})();