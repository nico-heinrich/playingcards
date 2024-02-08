const suits = ["clubs", "hearts", "spades", "diamonds"];
const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

const container = document.querySelector(".container");

let pressed = false;
let touchStartPos;
let touchEndPos;
let timer;
let millisecondsPassed = 0;
let currentCard;
let forceCard = {suit: null, value: null};

function playingCard({suit, value}) {
    const playingCard = document.createElement("div");
    playingCard.className = "playing-card";
    playingCard.dataset.suit = suit;
    playingCard.dataset.value = value;

    const index = document.createElement("span");
    index.className = "playing-card__index";
    index.textContent = value;
    playingCard.appendChild(index);

    if (parseInt(value)) {
        for (let i = 0; i < value; i++) {
            const pip = document.createElement("span");
            pip.className = "playing-card__pip";

            playingCard.appendChild(pip);
        }
    } else if (value === "A"){
        const pip = document.createElement("span");
        pip.className = "playing-card__pip";

        playingCard.appendChild(pip);
    } else {
        const picture = document.createElement("span");
        picture.className = "playing-card__picture";
        picture.textContent = value;

        playingCard.appendChild(picture);
    }

    playingCard.appendChild(index.cloneNode(true));

    return playingCard;
}

function randomFromArray(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function siStebbins({suit, value}) {
    const newSuit = suits[(suits.indexOf(suit) + 1) % suits.length];
    const newValue = values[(values.indexOf(value) + 3) % values.length];

    return {suit: newSuit, value: newValue};
}

function randomValueAndSuit() {
    const randomSuit = randomFromArray(suits);
    const randomValue = randomFromArray(values);

    if (forceCard.suit && randomSuit === forceCard.suit && forceCard.value && randomValue === forceCard.value
        || currentCard && randomSuit === currentCard.suit && randomValue === currentCard.value) {
        return randomValueAndSuit();
    } else {
        return {suit: randomSuit, value: randomValue};
    };
}

function showRandomCard() {
    currentCard = randomValueAndSuit();
    while (container.firstChild) container.firstChild.remove();
    container.appendChild(playingCard(currentCard));
}

function showForceCard() {
    while (container.firstChild) container.firstChild.remove();
    container.appendChild(playingCard(forceCard));

    forceCard = siStebbins(forceCard);

    console.log("FORCED CARD")
}

function handlePress() {
    if (!pressed) return;

    let interval = 50;

    if (millisecondsPassed > 500) showRandomCard();

    clearTimeout(timer);

    timer = setTimeout(() => {
        millisecondsPassed += interval;
        handlePress();
    }, interval)
}

function handleRelease() {
    if (millisecondsPassed > 3000 && forceCard.suit && forceCard.value) {
        showForceCard();
    } else {
        showRandomCard();
    }

    millisecondsPassed = 0;
}

function setCustomProperty() {
    document.documentElement.style.setProperty("--innerHeight", innerHeight + "px");
}

function suit(e) {
    const x = e.touches[0].clientX;
    const y = e.touches[0].clientY;

    const left = x > 0 && x < innerWidth / 2;
    const right = x > innerWidth / 2 && x < innerWidth;
    const top =  y > 0 && y < innerHeight / 2;
    const bottom =  y > innerHeight / 2 && y < innerHeight;

    if (left && top) {
        return "clubs";
    } else if (right && top) {
        return "hearts";
    } else if (left && bottom) {
        return "spades";
    } else {
        return "diamonds";
    }
}

function value(e) {
    const x = e.touches[0].clientX;
    const y = e.touches[0].clientY;

    const offsetX = container.getBoundingClientRect().left;
    const offsetY = container.getBoundingClientRect().top;
    const width = container.getBoundingClientRect().width;
    const height = container.getBoundingClientRect().height;

    const left = x > offsetX && x < offsetX + width / 3;
    const center = x > offsetX + width / 3 && x < offsetX + width / 3 * 2;
    const right = x > offsetX + width / 3 * 2 && x < offsetX + width;
    const first = y > offsetY && y < offsetY + height / 4;
    const second = y > offsetY + height / 4 && y < offsetY + height / 4 * 2;
    const third = y > offsetY + height / 4 * 2 && y <  offsetY + height / 4 * 3;
    const forth = y > offsetY + height / 4 * 3 && y < offsetY + height;

    if (left && first) {
        return "A";
    } else if (center && first) {
        return "2";
    } else if (right && first) {
        return "3";
    } else if (left && second) {
        return "4";
    } else if (center && second) {
        return "5";
    } else if (right && second) {
        return "6";
    } else if (left && third) {
        return "7";
    } else if (center && third) {
        return "8";
    } else if (right && third) {
        return "9";
    } else if (left && forth) {
        return "10";
    } else if (center && forth) {
        return "J";
    } else if (right && forth) {
        return "Q";
    } else {
        return "K";
    }
}

window.addEventListener("load", () => {
    setCustomProperty();

    showRandomCard();
});

window.addEventListener("resize", () => {
    setCustomProperty();
})

window.addEventListener("touchstart", e => {
    pressed = true;
    touchStartPos = e.touches[0].clientY;

    if (forceCard.suit === null) {
        forceCard.suit = suit(e);
    } else if (forceCard.value === null) {
        forceCard.value = value(e);
    }

    console.log(forceCard)

    handlePress();
});

window.addEventListener("touchmove", e => {
    touchEndPos = e.touches[0].clientY;
    
    if (touchEndPos - touchStartPos > innerHeight / 4) {
        container.classList.add("reset");
    } else {
        container.classList.remove("reset");
    }
})

window.addEventListener("touchend", () => {
    pressed = false;

    if (touchEndPos - touchStartPos > innerHeight / 4) {
        forceCard = {suit: null, value: null};
        
        container.classList.remove("reset");
    }

    touchEndPos = null;

    handleRelease();
});