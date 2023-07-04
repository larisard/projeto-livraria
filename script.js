const URL_LOCAL = "http://localhost:4000";
const URL_LOGIN = `${URL_LOCAL}/signin`;
const URL_SIGNUP = `${URL_LOCAL}/signup`;
let books = [];
  const usuarioCadastrado = {username:"Larissard",password:"lari123+", cpf:"13824396793"}
  const usuarioCadastrado2 = {username:"Admin",password:"admin123!", cpf:"13824396793"}
  const usuarioCadastrado3 = {username:"Usuario",password:"user123!", cpf:"13824396793"}


function hideSection(hide, show, alsoHide) {
  if (alsoHide != null) {
    const section = document.querySelector(`.${alsoHide}`);
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
    hideSection(`cadastro`,`login`, 'books')
  })
  const cadastroBottom = document.querySelector("#cadastro-bottom")
  cadastroBottom.addEventListener("click", ()=>{
    hideSection(`login`,`cadastro`, 'books')
  })

  const loginHeader = document.querySelector(".login-header")
  loginHeader.addEventListener("click", ()=>{
    hideSection(`cadastro`, `login`, `books`)
  })
  const bookHeader = document.querySelector(".books-header")
  bookHeader.addEventListener("click", ()=>{
    hideSection(`cadastro`, `books`, `login`)
  })
  const loginBtn = document.querySelector("#login-bottom")
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
   
};

class Pessoa {
  constructor(nome, senha, tipo) {
    this.nome = nome[tipo].value;
    this.senha = senha[tipo];
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

    const user = { username : this.nome, password: this.senha.value};
    console.log("no login, ", user, " senha ", this.senha, "  ", )
    if(user.username==usuarioCadastrado.username && user.password==usuarioCadastrado.password ){
        const books = new Books()
        books.displayBooks()
        books.getBooks(screen)
    }
    else if(user.username==usuarioCadastrado2.username && user.password==usuarioCadastrado2.password){
        const books = new Books()
        books.displayBooks()
        books.getBooks(screen)
    }
    else if(user.username==usuarioCadastrado3.username && user.password==usuarioCadastrado3.password){
        const books = new Books()
        books.displayBooks()
        books.getBooks(screen)
    }
    else {
    
      alert("Usuário não cadastrado")
    }

  }
  cadastro(screen) {
    let confirmPassword = "admin";
    let email= "admin@gmail.com"
    console.log("conf", confirmPassword, " email ", email)
    const body = { name: this.nome, email, password: "admin", confirmPassword };
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
    <button class="close-modal">close</button>
    <button class="close-modal" id="carrinho">carrinho</button>
    </div>
    `;
    let carrinhoBtn = document.querySelector("#carrinho")
    carrinhoBtn.addEventListener("click", ()=>{
        hideSection("modal-container", "carrinho", "books")

    })
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
    let booktitleLast = "";
    let bookBox = document.querySelector(".book-container");
    this.callInput(bookBox);
  }
  callInput(bookBox){

  
    axios
      .get(
        `http://localhost:4000/allbooks`
      )
      .then((res) => {
        console.log(res.data)
        books = res.data;
        console.log(books)
        this.renderbook(bookBox)
        
      });
  }
  
  renderbook(bookBox) {
    console.log(bookBox)
    bookBox.innerHTML = ``;
    for (let i = 0; i < books.length; i++) {
      bookBox.innerHTML += `
     <div class="book-single" >
     <p> ${books[i].titulo} </p>
      <img  src="${books[i].capa}" alt="">
     </div>
      
    `; 
    }
    let modal = new Modal()
    let bookinho = document.querySelectorAll(".book-single")
    for (let i=0; i<books.length; i++){
     bookinho.item(i).addEventListener("click", ()=>{
      modal.openModal(books[i].descricao, books[i].capa)
     })
    } 
   
  }
  
}
