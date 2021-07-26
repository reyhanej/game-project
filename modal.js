 class Modal {
     body
     modal
     constructor(title) {
         this.title = title
         this.setModalPropeties(title)
         this.setStyles()
         this.setBtnSettings()
     }
     setModalPropeties(title) {
         const modalTitle = document.querySelector(".modal-title")
         const modalText = document.querySelector(".modal-text")
         modalTitle.textContent = title
         modalText.textContent = `You ${title} this game!`
     }
     setStyles() {
         this.modal = document.querySelector(".modal")
         modal.style.display = "flex"
         this.body = document.querySelector("body")
         body.classList.add("modal-back")
     }
     setBtnSettings() {
         const okBtn = document.querySelector("#ok")
         okBtn.addEventListener("click", (e) => {
             this.modal.style.display = "none"
             this.body.classList.remove("modal-back")
                 // Game.resetGame()
         })


     }
 }