const APP_URL = "https://livraria-janeausten.herokuapp.com";
const URL_LOCAL = "http://localhost:5500";
const URL_LOGIN = `${APP_URL}/signin`;
const URL_SIGNUP = `${APP_URL}/signup`;
let books = [];

function hideSection(hide, show, alsoHide, alsoHide2) {
  if (alsoHide != null) {
    const section = document.querySelector(`.${alsoHide}`);
    section.classList.add("hidden");
  }
  if (alsoHide2 != null) {
    const section = document.querySelector(`.${alsoHide2}`);
    section.classList.add("hidden");
  }
  const sectionLogin = document.querySelector(`.${hide}`);
  sectionLogin.classList.add("hidden");
  const sectionSign = document.querySelector(`.${show}`);
  sectionSign.classList.remove("hidden");
}

window.onload = () => {
  const loginBottom = document.querySelector("#login-bottom")
  loginBottom.addEventListener("click", ()=>{
    hideSection(`cadastro`,`login`, 'books','sobre')
  })
  const cadastroBottom = document.querySelector("#cadastro-bottom")
  cadastroBottom.addEventListener("click", ()=>{
    hideSection(`login`,`cadastro`, 'books','sobre')
  })
  const cadastroHeader = document.querySelector(".cadastro-header")
  cadastroHeader.addEventListener("click", ()=>{
    hideSection(`login`, `cadastro`, `books`,`sobre`)
  })
  const loginHeader = document.querySelector(".login-header")
  loginHeader.addEventListener("click", ()=>{
    hideSection(`cadastro`, `login`, `books`,`sobre`)
  })
  const sobreHeader = document.querySelector(".sobre-header")
  sobreHeader.addEventListener("click", ()=>{
    hideSection(`cadastro`,`sobre`,`login`, `books`)
  })
  const booksHeader = document.querySelector(".books-header")
  booksHeader.addEventListener("click", ()=>{
    hideSection(`cadastro`,`books`,`login`, `sobre`)
  })
  
  
  const loginBtn = document.querySelector("#log")
  loginBtn.addEventListener("click", ()=>{
    const pessoa = new Pessoa(
      document.getElementsByName("username"),
      document.getElementsByName("pass"),
      0
    );
    pessoa.chamada()
  })
  const cadastroBtn = document.querySelector("#cad")
  cadastroBtn.addEventListener("click", ()=>{
    const pessoa = new Pessoa(
      document.getElementsByName("username"),
      document.getElementsByName("pass"),
      1
    );
    pessoa.chamada()
  })
  const searchBtn = document.querySelector(".search-icon")
  searchBtn.addEventListener("click", ()=>{
    const books = new Books()
    books.displayBooks()
  } )
};

class Pessoa {
  constructor(nome, senha, tipo) {
    this.nome = nome[tipo].value;
    this.senha = senha;
    this.tipo = tipo
  }


  chamada() {
    if (this.tipo == 0) {
      return this.login('login');
    } else {
      return this.cadastro('cadastro');
    }
  }
  login(screen) {
    const body = { name: this.nome, password: this.senha };
    axios
      .post(URL_LOGIN, body)
      .then((response) => {
        const books= new Books()
        books.getBooks(screen)
      })
      .catch((err) => {
        alert(err.response.data);
        console.log(err.response);
      });
  }
  cadastro(screen) {
    let confirmPassword = this.senha[2].value;
    console.log("conf", confirmPassword)
    const body = { name: this.nome, password: this.senha[this.tipo].value, confirmPassword };
    axios
      .post(URL_SIGNUP, body)
      .then((response) => {
        const books= new Books()
        books.getBooks(screen)
      })
      .catch((err) => {
        alert(err.response.data);
        console.log(err.response);
      });
  }
}


class Modal{
  constructor(){}
  openModal(description, cover) {
    const modal = document.querySelector(".modal-container");
    hideSection("books", "modal-container", null);
    modal.classList.add("fade");
    modal.innerHTML = `
    <div class = "modal" id = "modal" >
    <img src = "${cover}" >
    <p>
    ${description}
    </p>
    <p>
    <button class="close-modal">X</button></p>
    </div>
    `;

    let btn = document.querySelector(".close-modal")
    btn.addEventListener("click", ()=>{
      hideSection("modal-container", "books", null);
    })
  }

}

class Books {
  constructor(){
   
  }
  getBooks(screen) {
    if (screen == "cadastro") {
      hideSection("cadastro", "login", "books");
      return;
    }
    hideSection("login", "books", "books");
  }
  displayBooks() {
    const input = document.getElementsByName("book-title");
    let booktitle = input[0].value;
    let booktitleLast = "";
    let bookBox = document.querySelector(".book-container");
    this.callInput(booktitle, booktitleLast, bookBox);
  }
  callInput(booktitle, booktitleLast, bookBox){

    booktitle = booktitle.split(" ").join("+");
  
    axios
      .get(
        `https://www.googleapis.com/books/v1/volumes?q=${booktitle}&maxResults=20&startIndex=0`
      )
      .then((res) => {
        books = res.data.items;
        booktitleLast = booktitle;
        this.renderbook(bookBox);
      });
  }
  
  renderbook(bookBox) {
    bookBox.innerHTML = ``;
    for (let i = 0; i < books.length; i++) {
      bookBox.innerHTML += `
     <div class="book-single" >
     <p center> ${books[i].volumeInfo.title} </p>
      <img  src="${books[i].volumeInfo.imageLinks.smallThumbnail}" alt="">
     </div>
      
    `; 
    }
    let modal = new Modal()
    let bookinho = document.querySelectorAll(".book-single")
    for (let i=0; i<books.length; i++){
     bookinho.item(i).addEventListener("click", ()=>{
      modal.openModal(books[i].volumeInfo.description, books[i].volumeInfo.imageLinks.smallThumbnail)
     })
    }
   
  }
  
}

