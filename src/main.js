import "./style/index.css"

// pega o primeiro g do primeiro nivel de g dentro de svg que está em .cc-bg
const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")


function setCardType(type) {
    const colors = {
        visa:  ["#436D99", "#2D57F2"],
        mastercard: ["#DF6F29", "#C69347"],
        elo: ["#C23C34", "#806E32"],
        default: ["black", "gray"]
    }
    
    ccBgColor01.setAttribute("fill", colors[type][0])
    ccBgColor02.setAttribute("fill", colors[type][1])

    // files in the public directory are served at the root path.
    ccLogo.setAttribute("src", `./cc-${type}.svg`)
}

setCardType("visa")

// coloca a função como global - pode ser executada do navegador
globalThis.setCardType = setCardType