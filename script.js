const URL_LOCAL = "http://localhost:4000";
const URL_LOGIN = ` ${URL_LOCAL}/signin`;
const URL_SIGNUP = `${URL_LOCAL}/signup`;
let books = [];

function hideSection(hide, show, alsoHide, alsoHide2, alsoHide3, alsoHide4) {
  if (alsoHide != null) {
    const section = document.querySelector(`.${alsoHide}`);
    section.classList.add("hidden");
  }
  if (alsoHide2 != null) {
    const section = document.querySelector(`.${alsoHide2}`);
    section.classList.add("hidden");
  }
  if (alsoHide3 != null) {
    const section = document.querySelector(`.${alsoHide3}`);
    section.classList.add("hidden");
  }
  if (alsoHide4 != null) {
    const section = document.querySelector(`.${alsoHide4}`);
    section.classList.add("hidden");
  }
  const sectionLogin = document.querySelector(`.${hide}`);
  sectionLogin.classList.add("hidden");
  const sectionShow = document.querySelector(`.${show}`);
  sectionShow.classList.remove("hidden");
}

window.onload = () => {
  const loginBottom = document.querySelector("#login-bottom")
  loginBottom.addEventListener("click", ()=>{
    hideSection(`cadastro`,`consulta`, 'books','sobre',`login`,`cadastro_livro`)
  })

  const cadastroBottom = document.querySelector("#cadastro-bottom")
  cadastroBottom.addEventListener("click", ()=>{
    hideSection(`login`,`cadastro`, 'books','sobre',`consulta`,`cadastro_livro`)
  })

  const loginHeader = document.querySelector(".login-header")
  loginHeader.addEventListener("click", ()=>{
    hideSection(`cadastro`, `login`, `books`,`sobre`,`consulta`, `cadastro_livro`)
  })

  const cadastro_livroHeader = document.querySelector(".cadastro_livro-header")
  cadastro_livroHeader.addEventListener("click", ()=>{
    hideSection(`cadastro`,`cadastro_livro`,`login`, `books`,`sobre`,`consulta`)
  })

  const booksHeader = document.querySelector(".books-header")
  booksHeader.addEventListener("click", ()=>{
    hideSection(`cadastro`,`books`,`login`, `sobre`,`consulta`, `cadastro_livro`)
  })

  const consultaHeader = document.querySelector(".consulta-header")
 consultaHeader.addEventListener("click", ()=>{
    hideSection(`login`, `consulta`, `books`,`sobre`)
  })

  const sobreHeader = document.querySelector(".sobre-header")
  sobreHeader.addEventListener("click", ()=>{
    hideSection(`cadastro`,`sobre`,`login`, `books`, `cadastro_livro`, `consulta`)
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
      document.getElementsByName("email"),
      document.getElementsByName("username"),
      document.getElementsByName("pass"),
      document.getElementsByName("telefone"),
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
  constructor(email, nome, senha, telefone, tipo) {
    this.email = email[tipo].value;
    this.nome = nome[tipo].value;
    this.senha = senha[tipo].value;
    this.telefone = telefone[tipo].value;
    this.tipo = tipo;
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
        console.log("login")
        const books= new Books()
        books.getBooks(screen)
      })
      .catch((err) => {
        alert(err.response.data);
        console.log(err.response);
        console.log("login erro")
      });
  }
  cadastro(screen) {
    let confirmPassword = this.senha[2].value;
    console.log("conf", confirmPassword)
    const body = { email: this.email, name: this.nome, password: this.senha, confirmPassword, telefone: this.telefone};
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
     <p><u> ${books[i].volumeInfo.title} </u></p>
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

