// dom
const hashInput = document.querySelector('.input')
const hashBtn = document.querySelector('.hash-btn')
const hashResult = document.querySelector('.hash-result')
const passwordLength = document.querySelector('.password-input')
const addLower = document.querySelector('.lower-check')
const addUpper = document.querySelector('.upper-check')
const addNumber = document.querySelector('.number-check')
const addSymbol = document.querySelector('.symbol-check')
const generateBtn = document.querySelector('.generate-btn')
const generateResult = document.querySelector('.generate-result')
const baseInput = document.querySelector('.base64-input')
const encodeBtn = document.querySelector('.encode-btn')
const decodeBtn = document.querySelector('.decode-btn')
const baseResult = document.querySelector('.base64-result')

// extra
const worker = new Worker('worker.js')

// event listeners
hashBtn.addEventListener('click',()=>{
    if(hashInput.value === '') {
        alert('empty ')
        return
    }
    hash(hashInput.value)
    startHashLoader()
})

generateBtn.addEventListener('click',()=>{
    if(passwordLength.value === '') {
        alert('empty ')
        return
    }
    let length
    try {
        length = parseInt(passwordLength.value)
    } catch(err) {
        alert('invalid password length, expected integer')
        return
    }
    
    generate(length)
    startGenLoader()
})

encodeBtn.addEventListener('click',()=>{
    if(baseInput.value === '') {
        alert('empty ')
        return
    }
    encode(baseInput.value)
    startBaseLoader()
})

decodeBtn.addEventListener('click',()=>{
    if(baseInput.value === '') {
        alert('empty ')
        return
    }
    decode(baseInput.value)
    startBaseLoader()
})

const hash = str => {
    worker.postMessage({
        type:'hash',
        value:str
    })
}

const generate = length => {
    worker.postMessage({
        type:'generate',
        value:{
            length,
            lower:addLower.checked,
            upper:addUpper.checked,
            numbers:addNumber.checked,
            symbols:addSymbol.checked
        }
    })
}

const encode = text => {
    worker.postMessage({
        type:'encode',
        value:text
    })
}

const decode = text => {
    worker.postMessage({
        type:'decode',
        value:text
    })
}

// worker comm
worker.onmessage = e => {
    const result = e.data
    if(result.type === 'hash') {
        endHashLoader(result.data)
    } else if(result.type === 'generate') {
        endGenLoader(result.data)
    } else if(result.type === 'encode') {
        endBaseLoader(result.data)
    } else if(result.type === 'decode') {
        endBaseLoader(result.data)
    } else {
        console.log(result)
    }
}

// util functs
function startHashLoader() {
    hashResult.style.width = `${80}px`
    hashResult.style.height = `${80}px`
    hashResult.style.opacity = '1'
    hashResult.textContent = ''
    hashResult.style.border = '4px solid cyan'
    hashResult.style.borderRadius = '50%'
    hashResult.style.borderTopColor = 'transparent'
    hashResult.style.animation = 'spin 1.4s linear infinite'
}

function endHashLoader(result) {
    hashResult.style.width = `${100}%`
    hashResult.style.border = 'none'
    hashResult.style.borderRadius = '0'
    hashResult.style.height = `${160}px`
    hashResult.style.animation = 'none'
    hashResult.textContent = `${result}`
}

function startGenLoader() {
    generateResult.style.width = `${80}px`
    generateResult.style.height = `${80}px`
    generateResult.textContent = ''
    generateResult.style.opacity = '1'
    generateResult.style.border = '4px solid cyan'
    generateResult.style.borderRadius = '50%'
    generateResult.style.borderTopColor = 'transparent'
    generateResult.style.animation = 'spin 1.4s linear infinite'
}

function endGenLoader(result) {
    generateResult.style.width = `${100}%`
    generateResult.style.border = 'none'
    generateResult.style.borderRadius = '0'
    generateResult.style.height = `${240}px`
    generateResult.style.animation = 'none'
    generateResult.textContent = `${result}`
}

function startBaseLoader() {
    baseResult .style.width = `${80}px`
    baseResult .style.height = `${80}px`
    baseResult .style.opacity = '1'
    baseResult .textContent = ''
    baseResult .style.border = '4px solid cyan'
    baseResult .style.borderRadius = '50%'
    baseResult .style.borderTopColor = 'transparent'
    baseResult .style.animation = 'spin 1.4s linear infinite'
}

function endBaseLoader(result) {
    baseResult .style.width = `${100}%`
    baseResult .style.border = 'none'
    baseResult .style.borderRadius = '0'
    baseResult .style.height = `${160}px`
    baseResult .style.animation = 'none'
    baseResult .textContent = `${result}`
}