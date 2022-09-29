const books = document.querySelector('.cards');
const modal = document.querySelector('.modal');
const add = document.querySelector('#add-book');
const span = document.querySelector('.close');
const addBookForm = document.querySelector('.add-book-form');
let myLibrary = [];


function Book(title, author, year, pages, read){
    this.title = title;
    this.author = author;
    this.year = year;
    this.pages = pages;
    this.read = read;
    this.id = Math.floor(Math.random() * 100000000);
}

function addBookToLibrary(title, author, year, pages, read){    
    myLibrary.push(new Book(title, author, year, pages, read));
    saveRenderBooks();
}

function fillOutEditForm(book){
    modal.style.display = "block";
    document.querySelector('.form-title').textContent = "Edit Book";
    document.querySelector('.add-button').textContent = "Edit";
    document.querySelector('.add-book-form').setAttribute("id", book.id);
    document.querySelector('#title').value = book.title;
    document.querySelector('#author').value = book.author;
    document.querySelector('#year').value = book.year;
    document.querySelector('#pages').value = book.pages;
    document.querySelector('#read').checked = book.read;
}

addBookForm.addEventListener('submit', (e) => {
    e.preventDefault();
   const data = new FormData(e.target);
   let newBook = {};
   for(let [name, value] of data){
    if(name === 'read'){
        newBook["read"] = true;
    }else{
        newBook[name] = value;
    }
   }

   if(!newBook["read"]){
        newBook["read"] = false;
    }
    if(document.querySelector('.form-title').textContent === "Edit Book"){
        let id = e.target.id; 
        let editBook = myLibrary.filter(book => book.id = id)[0];
        editBook.title = newBook["title"];
        editBook.author = newBook["author"];
        editBook.year = newBook["year"];
        editBook.pages = newBook["pages"];
        editBook.read = newBook["read"];
        saveRenderBooks();
    }else{
        addBookToLibrary(
            newBook["title"], 
            newBook["author"], 
            newBook["year"], 
            newBook["pages"], 
            newBook["read"]);
    }
  

   addBookForm.reset();
   modal.style.display = "none";

});



span.addEventListener('click', () => {
    modal.style.display = "none";
})

add.addEventListener('click', () => {
    modal.style.display = "block";
});

function addLocalStorage(){    
    myLibrary = JSON.parse(localStorage.getItem("library")) // [];
    saveRenderBooks();
}


function createBookElement(el, content, className){
    const element = document.createElement(el);
    element.textContent = content;
    element.setAttribute('class', className);
    return element;
}
//this funcion allow to create element without class
function createBookInside(el, content){
    const elem = document.createElement(el);
    elem.textContent = content;
    return elem;
}

function deleteBook(index){
    myLibrary.splice(index, 1);
    saveRenderBooks();
 }

 
function createBookItem(book, index){
    const bookItem = document.createElement('div');
    bookItem.setAttribute('id',index);
    bookItem.setAttribute('key', index);
    bookItem.setAttribute('class', "card");

    const cardTitle = createBookElement('div', null, 'card-title');
    cardTitle.appendChild(createBookInside("h3", `${book.title}`));

    const cardText1 = createBookElement('div', null, 'card-text');
    cardText1.appendChild(createBookInside("p", `Author: ${book.author}`));
    cardText1.appendChild(createBookInside("p", `Annee: ${book.year}`));
    cardText1.appendChild(createBookInside("p", `Pages: ${book.pages}`));
    const rd = `${book.read}`;
    if (rd === "true") {
        cardText1.appendChild(createBookInside("p", "Read: Already"))
    }
    else{
        cardText1.appendChild(createBookInside("p", "Read: Not yet"))
    }

    const cardFooter = createBookElement('div', null, 'card-footer');

    const but = createBookElement('button', 'Edit', 'edit-book');
    const button = createBookElement('button', 'Remove', 'remove-book');
    //const check = createBookCheck(cardFooter,book);

   // cardFooter.appendChild(check);
   cardFooter.appendChild(but);
    cardFooter.appendChild(button);
    
   
    
    bookItem.appendChild(cardTitle);
    bookItem.appendChild(cardText1);
    bookItem.appendChild(cardFooter);
    
    bookItem.querySelector('.remove-book').addEventListener('click', (e) => {
        if(e.target.textContent === 'Remove'){
            deleteBook(index);
        }
    });

    bookItem.querySelector('.edit-book').addEventListener('click', () => {
        fillOutEditForm(book);
    })
   
  
    books.insertAdjacentElement("afterbegin",bookItem);
}

function renderBooks(){
    books.textContent = "";
    myLibrary.map((book, index) => {
        createBookItem(book, index)
    });    
}

function saveRenderBooks(){    
        localStorage.setItem('library', JSON.stringify(myLibrary));
        renderBooks();
}

addLocalStorage();
