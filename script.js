const URL_LOCAL = "http://localhost:4000";
const URL_LOGIN = ` ${URL_LOCAL}/signin`;
const URL_SIGNUP = `${URL_LOCAL}/signup`;
let books = [];

function hideSection(hide, show, alsoHide, alsoHide2, alsoHide3, alsoHide4,alsoHide5) {
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
  if (alsoHide5 != null) {
    const section = document.querySelector(`.${alsoHide5}`);
    section.classList.add("hidden");
  }
  const sectionLogin = document.querySelector(`.${hide}`);
  sectionLogin.classList.add("hidden");
  const sectionShow = document.querySelector(`.${show}`);
  sectionShow.classList.remove("hidden");
}

window.onload = () => {
  const cadastroBottom = document.querySelector("#cadastro-bottom")
  cadastroBottom.addEventListener("click", ()=>{
    hideSection(`login`,`cadastro`, 'books','sobre',`carrinho`,`cadastro_livro`,`menu`)
  })

  const loginBottom = document.querySelector("#log")
  loginBottom.addEventListener("click", ()=>{
    hideSection(`login`,`menu`, 'books','sobre',`carrinho`,`cadastro_livro`,`cadastro`)
  })

  const adminBottom = document.querySelector("#admin")
  adminBottom.addEventListener("click", ()=>{
    hideSection(`login`,`cadastro_livro`, 'books','sobre',`carrinho`,`menu`,`cadastro`)
  })

  const clienteBottom = document.querySelector("#cliente")
  clienteBottom.addEventListener("click", ()=>{
    hideSection(`login`,`carrinho`, 'books','sobre',`cadastro_livro`,`menu`,`cadastro`)
  })

  const loginHeader = document.querySelector(".login-header")
  loginHeader.addEventListener("click", ()=>{
    hideSection(`cadastro`, `login`, `books`,`sobre`,`carrinho`, `cadastro_livro`,`menu`)
  })

  const cadastroHeader = document.querySelector(".cadastro-header")
  cadastroHeader.addEventListener("click", ()=>{
    hideSection(`cadastro_livro`,`cadastro`,`login`, `books`,`sobre`,`carrinho`,`menu`)
  })

  const booksHeader = document.querySelector(".books-header")
  booksHeader.addEventListener("click", ()=>{
    hideSection(`cadastro`,`books`,`login`, `sobre`,`carrinho`, `cadastro_livro`,`menu`)
  })

  const sobreHeader = document.querySelector(".sobre-header")
  sobreHeader.addEventListener("click", ()=>{
    hideSection(`cadastro`,`sobre`,`login`, `books`, `cadastro_livro`, `carrinho`,`menu`)
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
      document.getElementsByName("tipouser"),
      1
    );
    pessoa.chamada()

    const cadastroLivroBtn = document.querySelector("#cad-book")
    cadastroLivroBtn.addEventListener("click", ()=>{
      const pessoa = new Livro(
        document.getElementsByName("ibsn"),
        document.getElementsByName("titulo"),
        document.getElementsByName("autor"),
        document.getElementsByName("descricao"),
        document.getElementsByName("edicao"),
        document.getElementsByName("editora"),
        document.getElementsByName("valor"),
        document.getElementsByName("quantidade")
      );
      livro.chamada()

    })
  })

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
        hideSection(`cadastro`,`menu`, 'books','sobre',`login`,`cadastro_livro`,`carrinho`)
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
    const body = { email: this.email, name: this.nome, password: this.senha, confirmPassword, tipouser: this.tipouser};
    axios
      .post(URL_SIGNUP, body)
      .then((response) => {
        hideSection(`cadastro`,`login`, 'books','sobre',`carrinho`,`cadastro_livro`)
      })
      .catch((err) => {
        alert(err.response.data);
        console.log(err.response);
      });
  }
}

//tela de busca, precisa pegar livros já cadastrados e renderizar na tela


class Livro {
  constructor(isbn, titulo, autor, descricao, edicao, editora, valor, quantidade) {
    this.isbn = isbn.value;
    this.titulo = titulo.value;
    this.autor = autor.value;
    this.descricao = descricao.value;
    this.edicao = edicao.value;
    this.editora = editora.value;
    this.valor = valor.value;
    this.quantidade = quantidade.value
  }

  getBusca(screen) {
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
