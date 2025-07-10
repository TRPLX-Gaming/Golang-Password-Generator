onmessage = async e => {
    const task = e.data
    if(task.type === 'hash') {
        const data = task.value
        const result = await getHash(data)
        console.log(result)
        postMessage({
            type:task.type,
            data:result
        })
    } else if(task.type === 'generate') {
        const config = task.value
        const result = await generatePassword(
            config.length,
            config.lower,
            config.upper,
            config.numbers,
            config.symbols
        )
        console.log(result)
        postMessage({
            type:task.type,
            data:result
        })
    } else if(task.type === 'decode') {
        const data = task.value
        const result = await decodeString(data)
        console.log(result)
        postMessage({
            type:task.type,
            data:result
        })
    } else if(task.type === 'encode') {
        const data = task.value
        const result = await encodeString(data)
        console.log(result)
        postMessage({
            type:task.type,
            data:result
        })
    } else {
        postMessage('unregistered task')
    }
}

async function getHash(string) {
    try {
        const response = await fetch('/hash',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:string
        })
        return await response.text()
    } catch(err) {
        return err
    }
    
}

async function generatePassword(length,lower,upper,numbers,symbols) {
    try {
        const response = await fetch('/generate-password',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                length,
                lower,
                upper,
                numbers,
                symbols
            })
        })
        return await response.text()
    } catch(err) {
        return err
    }
}

async function encodeString(text) {
    try {
        const response = await fetch('/encode',{
            method:'POST',
            headers:{
                'Content-Type':'text/plain'
            },
            body:text
        })
        return await response.text()
    } catch(err) {
        return err
    }
}

async function decodeString(text) {
    try {
        const response = await fetch('/decode',{
            method:'POST',
            headers:{
                'Content-Type':'text/plain'
            },
            body:text
        })
        return await response.text()
    } catch(err) {
        return err
    }
}

function lineBreak(text,interval) {
    let result = ''
    for(let i = 0; i < text.length; i += interval) {
        result += text.substring(i,i + interval) + '\n'
    }
    return result.trim()
}