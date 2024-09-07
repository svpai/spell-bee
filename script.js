document.addEventListener("DOMContentLoaded", () => {
    const words = ["neighbourhood", "landmark", "electrician", "ambulance", "emergency", "fishmonger", "chemist", "garbage", "grocer", "firefighter"];
    const blankPercentage = 50;

    // Shuffle array
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Get random indices to blank out
    function getBlankIndices(word, percentage) {
        const numBlanks = Math.ceil(word.length * percentage / 100);
        return new Set(randomIndices(word.length, numBlanks));
    }

    // Get random indices
    function randomIndices(length, num) {
        const indices = [];
        while (indices.length < num) {
            const index = Math.floor(Math.random() * length);
            if (!indices.includes(index)) {
                indices.push(index);
            }
        }
        return indices;
    }

    // Generate blanked out words
    function generateWords(words, blankPercentage) {
        const wordElements = words.map(word => {
            const blankIndices = getBlankIndices(word, blankPercentage);
            const wordElement = document.createElement('div');
            wordElement.classList.add('word');

            word.split('').forEach((char, index) => {
                if (blankIndices.has(index)) {
                    const input = document.createElement('input');
                    input.classList.add('blank-input');
                    input.setAttribute('data-letter', char);
                    input.setAttribute('data-word', word);
                    input.setAttribute('maxlength', '1');
                    input.addEventListener('input', handleInput);
                    wordElement.appendChild(input);
                } else {
                    const span = document.createElement('span');
                    span.textContent = char;
                    span.classList.add('word-letter');
                    wordElement.appendChild(span);
                }
            });

            const resultSpan = document.createElement('span');
            resultSpan.classList.add('result');
            wordElement.appendChild(resultSpan);

            return wordElement;
        });

        return { wordElements };
    }

    // Initialize puzzle
    function initPuzzle() {
        shuffle(words);
        const { wordElements } = generateWords(words, blankPercentage);

        const wordsContainer = document.getElementById('words');
        wordsContainer.innerHTML = '';
        wordElements.forEach(wordElement => {
            wordsContainer.appendChild(wordElement);
        });
    }

    // Handle input event
    function handleInput(event) {
        const input = event.target;
        const wordElement = input.parentElement;
        const inputs = wordElement.querySelectorAll('.blank-input');
        const resultSpan = wordElement.querySelector('.result');

        const currentWord = Array.from(inputs).map(input => input.value).join('');
        const originalWord = inputs[0].getAttribute('data-word');

        if (currentWord.length === originalWord.length) {
            if (currentWord === originalWord) {
                resultSpan.innerHTML = '<span class="checkmark">&#10004;</span>'; // Green check mark
            } else {
                resultSpan.innerHTML = '<span class="wrongmark">&#10060;</span>'; // Red wrong mark
            }
        } else {
            resultSpan.innerHTML = ''; // Clear result if not all letters are entered
        }
    }

    initPuzzle();
});
