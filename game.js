// import Modal from "./modal.js"

class Modal {
    body
    modal
    constructor(options) {
        this.options = options
        const { title, text } = this.options
        this.setModalPropeties(title, text)
        this.setStyles()
        this.setBtnSettings()
    }
    setModalPropeties(title, text) {
        const modalTitle = document.querySelector(".modal-title")
        const modalText = document.querySelector(".modal-text")
        modalTitle.textContent = title
        modalText.textContent = text
    }
    setStyles() {
        this.modal = document.querySelector(".modal")
        this.modal.style.display = "flex"
        this.body = document.querySelector("body")
        this.body.classList.add("modal-back")
    }
    setBtnSettings() {
        const yesBtn = document.querySelector("#yes")
        const noBtn = document.querySelector("#no")
        yesBtn.addEventListener("click", e => {
            this.body.classList.remove("modal-back")
            const container = document.querySelector(".container")
            container.innerHTML = ""
            this.modal.style.display = "none"
        })
        noBtn.addEventListener("click", e => {
            this.modal.style.display = "none"
            window.alert("That`s Ok , we appreciate your time . Please visit Us again.")

            setTimeout(() => {
                window.close()
            }, 1000)

        })


    }
}
class Game {
    options;
    selectedLevel;
    responseData;
    showSecs;
    pickSecs;
    rows;
    cols;
    itemCount;
    imgLoadedCounter = 0;
    activeItems = 0
    canItemsSelect = false
    pickInterval
    showInterval
    constructor(options) {
        this.options = options;
        this.initializeGame();
    }
    initializeGame() {
        const { playBtn, timerElement } = this.options;
        if (!playBtn) throw new Error("play button class name is not defined");
        const playNode = document.querySelector(playBtn);
        if (!playNode) throw new Error("Can`t find play button in your DOM ");

        if (!timerElement) throw new Error("timer element class name is not defined");
        const timerNode = document.querySelector(timerElement);
        if (!timerNode) throw new Error("Can`t find timer element in your DOM ");

        playNode.addEventListener("click", () => {
            const howToContainer = document.querySelector(".how-to-container")
            if (howToContainer) howToContainer.remove()
            const loading = document.querySelector(".loading-container")
            loading.style.display = "flex"
            if (playNode.textContent === "Play") {
                this.play();
                playNode.textContent = "Reset"
            } else {
                this.resetGame()
            }
        });
    }
    play() {
        const { level } = this.options;
        if (!level) throw new Error("level class name is not defined");
        const levelNode = document.querySelector(level);
        if (!levelNode) throw new Error("Can`t find level element in your DOM");
        this.selectedLevel = levelNode.textContent;

        this.setLevelSpecifiedProperties()
        this.createPicElements();

    }

    async createPicElements() {
        await this.getImages()
        for (let i = 0; i < this.rows; i++) {
            const row = document.createElement("div")
            row.classList.add("row")
            for (let j = 0; j < this.cols; j++) {
                const flipCard = this.createItem()
                row.appendChild(flipCard)
            }
            document.querySelector(".container").style.display = "grid"
            document.querySelector(".container").appendChild(row)
        }
        const checkInterval = setInterval(() => {
            this.imagLoaded()
            if (this.imgLoadedCounter == this.rows * this.cols) {
                clearInterval(checkInterval);
                setTimeout(() => {
                    this.setActiveStateFlip();
                    this.showPicsTimer();
                }, 1000);
            }
        }, 500);
    }
    setLevelSpecifiedProperties() {
        switch (this.selectedLevel) {
            case "Hard":
                this.rows = 6;
                this.cols = 4;
                this.showSecs = 5
                this.pickSecs = 40
                break;
            case "Easy":
                this.rows = 3;
                this.cols = 4;
                this.showSecs = 5
                this.pickSecs = 50
                break;
            case "Iran":
                this.rows = 8;
                this.cols = 6;
                this.showSecs = 4
                this.pickSecs = 30
                break;
            case "Medium":
            default:
                this.rows = 4;
                this.cols = 4;
                this.showSecs = 5
                this.pickSecs = 45
                break;
        }

    }
    async getImages() {
        this.itemCount = (this.rows * this.cols) / 2;
        await axios
            .get(`https://picsum.photos/v2/list?page=1&limit=${this.itemCount}`, {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": "application/json",
                },
            })
            .then((response) => {
                if (!response.data) throw new Error("can not get images");
                this.responseData = response.data;
                this.responseData.forEach(res => {
                    res.counter = 0
                })
            })
            .catch((e) => console.log(e));
    }

    createItem() {
        const flipCard = document.createElement("div");
        flipCard.classList.add("flip-card");
        const flipCardInner = document.createElement("div");
        flipCardInner.classList.add("flip-card-inner");
        flipCard.appendChild(flipCardInner);
        const flipCardFront = document.createElement("div");
        flipCardFront.classList.add("flip-card-front");
        flipCardInner.appendChild(flipCardFront);
        const flipCardBack = document.createElement("div");
        flipCardBack.classList.add("flip-card-back");
        flipCardInner.appendChild(flipCardBack);
        const img = document.createElement("img");
        img.classList.add("img")
        const rndItem = this.getRandomItem()
        img.setAttribute("src", rndItem.download_url);
        flipCardBack.appendChild(img);
        flipCardInner.setAttribute("data-id", rndItem.id)

        flipCard.addEventListener("click", (e) => {
            if (this.canItemsSelect === false) return
            if (flipCard.classList.contains("active")) return

            flipCardInner.classList.add("active")
            this.activeItems++
                if (this.activeItems < 2) return
            this.checkActiveItems()

        })
        return flipCard
    }
    imagLoaded() {
        const images = document.querySelectorAll(".img")
        images.forEach(img => {
            if (img.complete && img.naturalHeight !== 0)
                this.imgLoadedCounter++
        })
    }
    setActiveStateFlip() {
        const flipCardsInner = document.querySelectorAll(".flip-card-inner")

        flipCardsInner.forEach((flipCardInner, index) => {
            setTimeout(() => {
                flipCardInner.classList.add("active")
            }, 10 * index);
        })
    }
    deactiveStateFlip() {
        const flipCardsInner = document.querySelectorAll(".flip-card-inner")
        flipCardsInner.forEach(flipCardInner => {
            flipCardInner.classList.remove("active")
        })
        this.activeItems = 0
    }
    getRandomItem() {
        const randomNum = Math.floor(Math.random() * this.itemCount);
        const randomItem = this.responseData[randomNum];
        if (randomItem.counter < 2) {
            randomItem.counter++
                return randomItem
        }
        this.responseData.splice(randomNum, 0)
        return this.getRandomItem()
    }

    showPicsTimer() {
        const { timerElement } = this.options
        const showTimer = document.querySelector(timerElement)
        showTimer.style.visibility = "visible"
        const loading = document.querySelector(".loading-container")
        loading.style.display = "none"
        this.showInterval = setInterval(() => {
            this.showSecs -= 1;
            showTimer.textContent = `Hint Time : ${this.showSecs}`;
            if (this.showSecs < 1) {
                showTimer.style.visibility = "hidden"
                clearInterval(this.showInterval);
                this.deactiveStateFlip()
                this.canItemsSelect = true
                this.runGameTimer()
            }

        }, 1000);


    }
    showModal(title, text) {
        const newModal = new Modal({ title, text })

    }
    runGameTimer() {
        const { timerElement } = this.options
        const showTimer = document.querySelector(timerElement)
        showTimer.style.visibility = "visible"
        this.pickInterval = setInterval(() => {
            const flipCards = document.querySelectorAll(".flip-card-inner")
            showTimer.textContent = `Remained Time : ${this.pickSecs}`
            this.pickSecs -= 1
            if (flipCards.length > 0 && this.pickSecs > 0) return

            if (flipCards.length < 1 && this.pickSecs > 1) {
                this.showModal('You Won!', 'You have won the game , Want to play again?')
            } else {
                this.showModal('You Lost!', "You have lost the game , Want to play again?")

            }
            clearInterval(this.pickInterval)
            showTimer.style.visibility = "hidden"

        }, 1000)
    }
    checkActiveItems() {
        const actives = document.querySelectorAll(".active")
        const ids = []
        actives.forEach(item => {
            const id = item.getAttribute("data-id")
            ids.push(id)
        })

        setTimeout(() => {
            if (ids.every(v => v === ids[0])) {

                actives.forEach(element => {
                    element.remove()
                    this.activeItems--
                })

            } else {
                this.deactiveStateFlip()
            }
        }, 1000);

    }
    resetGame() {
        const container = document.querySelector(".container")
        container.innerHTML = ""
        this.selectedLevel = null;
        this.responseData = null;
        this.showSecs = null;
        this.rows = null;
        this.cols = null;
        this.showSecs = null
        this.pickSecs = null
        this.itemCount = null;
        this.imgLoadedCounter = 0;
        this.activeItems = 0
        this.canItemsSelect = false
        if (this.pickInterval) clearInterval(this.pickInterval)
        if (this.showInterval) clearInterval(this.showInterval)
        this.play()
    }
}