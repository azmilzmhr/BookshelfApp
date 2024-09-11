const bookStorageKey = "BOOKSHELF_APP";

document.addEventListener("DOMContentLoaded", () => {
    const bookForm = document.getElementById("bookForm");
    const searchBookForm = document.getElementById("searchBookForm");

    bookForm.addEventListener("submit", handleAddBook);
    searchBookForm.addEventListener("submit", handleSearchBook);

    loadBooksFromStorage();
});

function handleAddBook(event) {
    event.preventDefault();
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const year = parseInt(document.getElementById("year").value);
    const isComplete = document.getElementById("isComplete").checked;

    const book = {
        id: Date.now(),
        title,
        author,
        year,
        isComplete
    };

    saveBook(book);
    renderBooks();
    document.getElementById("bookForm").reset();
}

function saveBook(book) {
    let books = getBooksFromStorage();
    books.push(book);
    localStorage.setItem(bookStorageKey, JSON.stringify(books));
}

function getBooksFromStorage() {
    return JSON.parse(localStorage.getItem(bookStorageKey)) || [];
}

function loadBooksFromStorage() {
    renderBooks();
}

function renderBooks() {
    const incompleteBookshelf = document.getElementById("incompleteBookshelfList");
    const completeBookshelf = document.getElementById("completeBookshelfList");

    incompleteBookshelf.innerHTML = "";
    completeBookshelf.innerHTML = "";

    const books = getBooksFromStorage();
    books.forEach(book => {
        const bookElement = createBookElement(book);
        if (book.isComplete) {
            completeBookshelf.appendChild(bookElement);
        } else {
            incompleteBookshelf.appendChild(bookElement);
        }
    });
}

function createBookElement(book) {
    const bookItem = document.createElement("div");
    bookItem.classList.add("book-item");
    bookItem.setAttribute("data-bookid", book.id);
    bookItem.setAttribute("data-testid", "bookItem");

    bookItem.innerHTML = `
        <h3 data-testid="bookItemTitle">${book.title}</h3>
        <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
        <p data-testid="bookItemYear">Tahun: ${book.year}</p>
        <div>
            <button data-testid="bookItemIsCompleteButton">${book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca"}</button>
            <button data-testid="bookItemDeleteButton">Hapus</button>
        </div>
    `;

    bookItem.querySelector('[data-testid="bookItemIsCompleteButton"]').addEventListener("click", () => {
        toggleBookStatus(book.id);
    });

    bookItem.querySelector('[data-testid="bookItemDeleteButton"]').addEventListener("click", () => {
        deleteBook(book.id);
    });

    return bookItem;
}

function toggleBookStatus(bookId) {
    const books = getBooksFromStorage();
    const bookIndex = books.findIndex(book => book.id == bookId);
    books[bookIndex].isComplete = !books[bookIndex].isComplete;
    localStorage.setItem(bookStorageKey, JSON.stringify(books));
    renderBooks();
}

function deleteBook(bookId) {
    let books = getBooksFromStorage();
    books = books.filter(book => book.id != bookId);
    localStorage.setItem(bookStorageKey, JSON.stringify(books));
    renderBooks();
}

function handleSearchBook(event) {
    event.preventDefault();
    const searchTerm = document.getElementById("searchBook").value.toLowerCase();
    const books = getBooksFromStorage();

    const filteredBooks = books.filter(book => book.title.toLowerCase().includes(searchTerm));
    renderFilteredBooks(filteredBooks);
}

function renderFilteredBooks(filteredBooks) {
    const incompleteBookshelf = document.getElementById("incompleteBookshelfList");
    const completeBookshelf = document.getElementById("completeBookshelfList");

    incompleteBookshelf.innerHTML = "";
    completeBookshelf.innerHTML = "";

    filteredBooks.forEach(book => {
        const bookElement = createBookElement(book);
        if (book.isComplete) {
            completeBookshelf.appendChild(bookElement);
        } else {
            incompleteBookshelf.appendChild(bookElement);
        }
    });
}
