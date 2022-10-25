// import axios from "axios"

// function getBooks(){
//     
//     axios.get(URL_GET)
// }
 const APP_URL =  "https://livraria-janeausten.herokuapp.com"
 const URL_LOGIN = `${APP_URL}/signin`
 const URL_SIGNIN = `${APP_URL}/signup`
 const URL_GET_BOOKS = "https://www.googleapis.com/books/v1/volumes?q=coraline"

function hideSection(hide,show, alsoHide){
   if (alsoHide!=null){
    const section = document.querySelector(`.${alsoHide}`)
    section.classList.add("hidden")
   }
    const sectionLogin = document.querySelector(`.${hide}`)
    sectionLogin.classList.add("hidden")
    console.log("escondi ",sectionLogin)
    const sectionSign = document.querySelector(`.${show}`)
    sectionSign.classList.remove("hidden")
    console.log("mostrei ",sectionSign)
}

function login(){
    const inputName = document.getElementsByName("username")
    let name = inputName[0].value
    const inputPass = document.getElementsByName("pass")
    let password = inputPass[0].value

    const body = {name,password}
    axios.post(URL_LOGIN,body).then(response=>{
    console.log(response.data)
    getBooks()
    }).catch(err=>{
        alert(err.response.data)
        console.log(err.response)
    })
    
    

}

function signup(){
    
}


function getBooks(){
    hideSection("login", "books")
    hideSection("login", "header-books")

}