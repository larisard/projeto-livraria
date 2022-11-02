// import axios from "axios"

// const { default: axios } = require("axios")

// import axios from "axios"

// function getBooks(){
//
//     axios.get(URL_GET)
// }
const APP_URL = "https://livraria-janeausten.herokuapp.com";
const URL_LOCAL = "http://localhost:4000";
const URL_LOGIN = `${APP_URL}/signin`;
const URL_SIGNUP = `${APP_URL}/signup`;
const URL_GET_BOOKS = "https://www.googleapis.com/books/v1/volumes?q=coraline";
let books = [];


function hideSection(hide, show, alsoHide) {
  if (alsoHide != null) {
    const section = document.querySelector(`.${alsoHide}`);
    section.classList.add("hidden");
    console.log("tb escondi ", section)
  }
  const sectionLogin = document.querySelector(`.${hide}`);
  sectionLogin.classList.add("hidden");
  console.log("escondi ", sectionLogin);
  const sectionSign = document.querySelector(`.${show}`);
  sectionSign.classList.remove("hidden");
  console.log("mostrei ", sectionSign);
}

function login(screen) {
  const inputName = document.getElementsByName("username");
  let name = inputName[0].value;
  const inputPass = document.getElementsByName("pass");
  let password = inputPass[0].value;

  const body = { name, password };
  axios
    .post(URL_LOGIN, body)
    .then((response) => {
      console.log(response.data);
      getBooks(screen);
    })
    .catch((err) => {
      alert(err.response.data);
      console.log(err.response);
    });
}

function signup(screen) {
  const inputName = document.getElementsByName("username");
  let name = inputName[1].value;
  const inputPass = document.getElementsByName("pass");
  let password = inputPass[1].value;
  let confirmPassword = inputPass[2].value;

  const body = { name, password, confirmPassword };
  axios
    .post(URL_SIGNUP, body)
    .then((response) => {
      console.log(response.data);
      getBooks(screen);
    })
    .catch((err) => {
      alert(err.response.data);
      console.log(err.response);
    });
}

function getBooks(screen) {
  if (screen == "cadastro") {
    hideSection("cadastro", "login", 'books');
    return;
  }
  hideSection("login", "books", "books");


}

function displayBooks() {
  const input = document.getElementsByName("book-title");
  console.log(input)
  let booktitle = input[0].value;
  let booktitleLast = ""
  let bookBox = document.querySelector(".book-container")
  const search = document.querySelector(".search-icon")
  callInput(booktitle,booktitleLast,bookBox)
 
}
function callInput(booktitle,booktitleLast,bookBox) {
  console.log(booktitle)
    booktitle =  booktitle.split(" ").join("+")
    console.log(booktitle)
  
    axios
    .get(`https://www.googleapis.com/books/v1/volumes?q=${booktitle}&maxResults=12&startIndex=0`)
    .then((res) => {
      console.log(res.data);
      books = res.data.items;
      booktitleLast = booktitle
      console.log(booktitleLast)
      renderbook(bookBox)
        });
        console.log(books)

}

function renderbook(bookBox){
  bookBox.innerHTML = ``
  for(let i=0; i<books.length; i++) {
    console.log("to no looping ",books[i].volumeInfo.title, i)
    bookBox.innerHTML+=`
   <div class="book-single" >
   <p> ${ books[i].volumeInfo.title} </p>
    <img onclick="openModal('${ books[i].volumeInfo.description}', '${books[i].volumeInfo.imageLinks.smallThumbnail}')" src="${books[i].volumeInfo.imageLinks.smallThumbnail}" alt="">
   </div>
    
  `
 }
}

function openModal( description, cover){
  const modal = document.querySelector('.modal-container')
  hideSection('books', 'modal-container', null)
  modal.classList.add('fade')
  modal.innerHTML = `
  <div class = "modal" id = "modal" >
  <img src = "${cover}" >
  <p>
  ${description}
  </p>
  <button onclick = closeModal() class="close-modal">close</button>
  </div>
  `


}

function closeModal(){
  hideSection('modal-container', 'books', null)
  // const books = document.querySelector('.books')
  // books.classList.remove('fade')
 
}