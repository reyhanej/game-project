let hardship = document.querySelector(".harditems")
let hardshipitems = hardship.querySelectorAll(".harditem")
let hardtxt = document.querySelector("#hardtxt")

hardtxt.textContent = "Medium"
for (let i = 0; i < hardshipitems.length; i++) {
    hardshipitems[i].addEventListener("click", e => {
        hardship.style.display = "none"
        hardtxt.textContent = hardshipitems[i].textContent
    })
}
const resetGame = () => {
    new Game({
        level: "#hardtxt",
        playBtn: ".play",
        timerElement: ".showTimer"
    })
}
new Game({
    level: "#hardtxt",
    playBtn: ".play",
    timerElement: ".showTimer"
})