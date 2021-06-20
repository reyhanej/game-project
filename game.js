class Game {
    options
    selectedLevel
    responseData
    secends
    rows
    cols
    itemCount
    constructor(options) {
        this.options = options
        this.initializeGame()
    }
    initializeGame() {
        const { playBtn } = this.options

        if (!playBtn) throw new Error("play button class name is not defined")
        const playNode = document.querySelector(playBtn)
        if (!playNode) throw new Error("Can`t find play button in your DOM ")
        playNode.addEventListener("click", this.play)
    }
    play() {
        console.log(this.options)
        const { level } = this.options
        if (!level) throw new Error("level class name is not defined")
        const levelNode = document.querySelector(level)
        if (!levelNode) throw new Error("Can`t find level element in your DOM")
        this.selectedLevel = levelNode.textContent

        this.createPicElements()
        this.showPicsTimer()

    }
    createPicElements() {
        switch (this.selectedLevel) {
            case "Medium":
                this.rows = 4
                this.cols = 4
                break;
            case "Hard":
                this.rows = 4
                this.cols = 6
                break;
            case "Easy":
                this.rows = 4
                this.cols = 2
                break;
            default:
                this.rows = 4
                this.cols = 4
                break;
        }

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.getImages()
                this.createItem()
            }
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
                if (!response.data) throw new Error("can not get images")
                this.responseData = response.data
                this.createItem()
            })
            .catch((e) => console.log(e))


    }

    createItem() {

        const flipCard = document.createElement("div")
        flipCard.classList.add("flip-card")
        document.querySelector("body").appendChild(flipCard)
        const flipCardInner = document.createElement("div")
        flipCardInner.classList.add("flip-card-inner")
        flipCard.appendChild(flipCardInner)
        const flipCardFront = document.createElement("div")
        flipCardFront.classList.add("flip-card-front")
        flipCardInner.appendChild(flipCardFront)
        const flipCardBack = document.createElement("div")
        flipCardBack.classList.add("flip-card-back")
        flipCardInner.appendChild(flipCardBack)
        const img = document.createElement("img")
        img.setAttribute("src", this.getRandomItemUrl())
        flipCardBack.appendChild(img)

    }
    getRandomItemUrl() {
        const randomNum = Math.floor(Math.random() * this.itemCount)
        return this.responseData[randomNum].download_url


    }
    showPicsTimer() {
        const showTimer = document.querySelector(".showTimer")
        showTimer.style.dispaly = "block"
        switch (this.selectedLevel) {
            case "Medium":
                this.secends = 7
                break;
            case "Hard":
                this.secends = 4
                break;
            case "Easy":
                this.secends = 10
                break;
            default:
                this.secends = 7
                break;
        }
        let timerId = setInterval(() => {
            this.secends -= 1
            showTimer.textContent = this.secends
            if (this.secends <= 1) clearInterval(timerId)
        }, 1000)
    }

}