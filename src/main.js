import "./style/index.css"
import IMask from "imask"

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

// setCardType("visa")

// coloca a função como global - pode ser executada do navegador
globalThis.setCardType = setCardType


// Adds CVV mask
// No query selector usa-se # para id e . para class
const securityCode = document.querySelector('#security-code')
const securityCodeMask = IMask(securityCode, {
    // must contain 3 digits
    mask: '000',
    lazy: false,
})

// Removes lazy when not focused
securityCode.addEventListener('focus', function() {
    securityCodeMask.updateOptions({ lazy: false });
}, true);
securityCode.addEventListener('blur', function() {
    securityCodeMask.updateOptions({ lazy: true });
    // NEXT IS OPTIONAL
    if (!securityCodeMask.masked.rawInputValue) {
        securityCodeMask.value = '';
    }
}, true);


// Adds card expirations mask
const expirationDate = document.querySelector('#expiration-date')
const momentFormat = 'MM/YY'
const yearToday = new Date().getFullYear()
const expirationDateMask = IMask(expirationDate, {
    mask: Date,
    pattern: momentFormat,
    lazy: false,
    min: new Date(),
    max: new Date(yearToday+10, 11, 31),

    // define date -> str convertion
    format: function (date) {
        var month = date.getMonth() + 1;
        var year = date.getFullYear();

        if (month < 10) month = "0" + month;

        return [month, year % 100].join('/');
    },
    // define str -> date convertion
    parse: function (str) {
        var monthYear = str.split('/');

        return new Date(Number(monthYear[1]) + 2000, Number(monthYear[0]) - 1);
    },

    blocks: {
        MM: {
            mask: IMask.MaskedRange,
            from: 1,
            to: 12,
            maxLength: 2,
        },
        YY: {
            mask: IMask.MaskedRange,
            from: (yearToday % 100),
            to: (yearToday % 100) + 10,
            maxLength: 2,
        }
    }
})


// Adds card number mask
const cardNumber = document.querySelector('#card-number')
const cardNumberMask = IMask(cardNumber, {
    mask: [
        {
            cardtype: 'visa',
            regex: /^4\d{0,15}/,
            mask: '0000 0000 0000 0000',
        },
        {
            cardtype: 'mastercard',
            regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
            mask: '0000 0000 0000 0000',
        },
        {
            cardtype: 'elo',
            regex: /^4\d{0,15}/,
            mask: '0000 0000 0000 0000',
        },
        {
            cardtype: 'default',
            mask: '0000 0000 0000 0000',
        },
    ],

    dispatch: function (appended, dynamicMasked) {
        // accepts only digits
        var number = (dynamicMasked.value + appended).replace(/\D/g, '');
        // pega apenas o atributo regex de cada item do array
        const foundMask = dynamicMasked.compiledMasks.find(({regex}) => number.match(regex));

        return foundMask;
    }
})


// Adds button to add card event listner
const addButton = document.querySelector('#button-add-card')
addButton.addEventListener('click', () => {
    alert('Card added!')
})

document.querySelector("form").addEventListener("submit", (event) => {
    // O comportamento default de um submit é recarregar a página
    event.preventDefault()
})

const cardHolder = document.querySelector('#card-holder')
cardHolder.addEventListener('input', (event) => {
    // Modifica o nome do card holder com base no que está sendo digitado
    const ccHolder = document.querySelector('.cc-holder .value')

    ccHolder.innerText = event.target.value.length === 0 ? "FULANO DA SILVA" : event.target.value
})


// verifica quando o dado digitado esta de acordo com a mascara 
securityCodeMask.on('accept', () => {
    const ccCvv = document.querySelector('.cc-security .value')
    
    ccCvv.innerText = securityCodeMask.value.length === 0 ? "123" : securityCodeMask.value
})