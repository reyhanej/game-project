class Game {
    options;
    selectedLevel;
    responseData;
    seconds;
    rows;
    cols;
    itemCount;
    imgLoadedCounter = 0;
    activeItems = 0
    canItemsSelect = false
    constructor(options) {
        this.options = options;
        this.initializeGame();
    }
    initializeGame() {
        const { playBtn } = this.options;

        if (!playBtn) throw new Error("play button class name is not defined");
        const playNode = document.querySelector(playBtn);
        if (!playNode) throw new Error("Can`t find play button in your DOM ");
        playNode.addEventListener("click", () => {
            this.play();

        });
    }
    play() {
        const { level } = this.options;
        if (!level) throw new Error("level class name is not defined");
        const levelNode = document.querySelector(level);
        if (!levelNode) throw new Error("Can`t find level element in your DOM");
        this.selectedLevel = levelNode.textContent;

        this.createPicElements();

    }
    async createPicElements() {
        this.setRowsAndCols()
        await this.getImages()
        for (let i = 0; i < this.rows; i++) {
            const row = document.createElement("div")
            row.classList.add("row")
            for (let j = 0; j < this.cols; j++) {
                const flipCard = this.createItem()
                row.appendChild(flipCard)
            }
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
    setRowsAndCols() {
        switch (this.selectedLevel) {
            case "Medium":
                this.rows = 4;
                this.cols = 4;
                break;
            case "Hard":
                this.rows = 4;
                this.cols = 6;
                break;
            case "Easy":
                this.rows = 4;
                this.cols = 2;
                break;
            default:
                this.rows = 4;
                this.cols = 4;
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
        img.setAttribute("data-id", rndItem.id)
        flipCardBack.appendChild(img);
        flipCard.addEventListener("click", (e) => {
            if (this.canItemsSelect === false) return
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
        flipCardsInner.forEach(flipCardInner => flipCardInner.classList.remove("active"))
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
    checkActiveItems() {
        const activeImages = document.querySelectorAll(".active .flip-card-back .img")
        const ids = []
        activeImages.forEach(img => {
            const id = img.getAttribute("data-id")
            ids.push(id)
        })
        console.log(ids)
        setTimeout(() => {
            if (ids.every(v => v === ids[0])) {
                activeImages.forEach(element => {
                    element.remove()
                });
            } else
                this.deactiveStateFlip()
        }, 1000);


    }
    showPicsTimer() {
        const showTimer = document.querySelector(".showTimer");
        // showTimer.style.dispaly = "block";
        switch (this.selectedLevel) {
            case "Medium":
                this.seconds = 5;
                break;
            case "Hard":
                this.seconds = 3;
                break;
            case "Easy":
                this.seconds = 7;
                break;
            default:
                this.seconds = 5;
                break;
        }
        let timerId = setInterval(() => {
            this.seconds -= 1;
            showTimer.textContent = this.seconds;
            if (this.seconds <= 1) {
                clearInterval(timerId);
                this.deactiveStateFlip()
                this.canItemsSelect = true
            }
        }, 1000);
    }

}