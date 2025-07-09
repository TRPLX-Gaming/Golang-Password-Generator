const input = document.querySelector('.input')
const hashBtn = document.querySelector('.hash-btn')

const hash = async str => {
    try {
        const response = await fetch('/hash',{
		method:'POST',
		headers:{
			'Content-Type':'text/plain'
		},
		body:str
	})
        const result = await response.text()
        
        alert(`Your password is ${result}`)
    } catch(err) {
        console.error(err)
        alert('error occured')
    }
}

hashBtn.addEventListener('click',()=>{
    if(input.value === '') {
        alert('empty ')
        return
    }
    
    hash(input.value)
})
