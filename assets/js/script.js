let books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKSHELF_APPS';

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted
  };
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function isStorageExist() {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
  }
}

function loadDataFromStorage() {
  const serializeData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializeData);

  if(data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function clearFromData() {
  const inputTitle = document.querySelector('.judul');
  const inputAuthor = document.querySelector('.penulis');
  const inputYear = document.querySelector('.tahun');
  const checkbox = document.querySelector('.status');
  const spanText = document.querySelector('.type');

  inputTitle.value = '';
  inputAuthor.value = '';
  inputYear.value = '';
  checkbox.checked = false;
  spanText.innerText = 'Belum selesai dibaca';
}

function makeBook(bookObject) {
  const {id, title, author, year, isCompleted} = bookObject;

  const textTitle = document.createElement('h1');
  textTitle.innerText = title;

  const textAuthor = document.createElement('p');
  textAuthor.innerText = author;
  
  const textYear = document.createElement('p');
  textYear.innerText = year;

  const textContainer = document.createElement('div');
  textContainer.classList.add('book_content');
  textContainer.append(textTitle, textAuthor, textYear);

  const container = document.createElement('div');
  container.classList.add('book_card');
  container.append(textContainer);
  container.setAttribute('id', `book-${id}`);

  const editButton = document.createElement('button');
  editButton.classList.add('btnEdit');
  editButton.innerText = 'Edit buku';
  editButton.addEventListener('click', function() {
    const container = document.querySelector('main');

    const headerTitle = document.createElement('h1');
    headerTitle.innerText = 'Edit Buku Anda';

    const headerContainer = document.createElement('div');
    headerContainer.classList.add('form_header');
    headerContainer.append(headerTitle);

    const titleLabel = document.createElement('label');
    titleLabel.innerText = 'Judul';

    const inputTitle = document.createElement('input');
    inputTitle.setAttribute('type', 'text');
    inputTitle.classList.add('judul', 'modal_judul');

    const authorLabel = document.createElement('label');
    authorLabel.innerText = 'Penulis';
    
    const inputAuthor = document.createElement('input');
    inputAuthor.setAttribute('type', 'text');
    inputAuthor.classList.add('penulis', 'modal_penulis');

    const yearLabel = document.createElement('label');
    yearLabel.innerText = 'Tahun';
    
    const inputYear = document.createElement('input');
    inputYear.setAttribute('type', 'number');
    inputYear.classList.add('tahun', 'modal_tahun');

    const checkboxLabel = document.createElement('label');
    checkboxLabel.innerText = 'Selesai dibaca';

    const inputCheckbox = document.createElement('input');
    inputCheckbox.setAttribute('type', 'checkbox');
    inputCheckbox.classList.add('status', 'modal_status');

    const buttonSubmit = document.createElement('button');
    buttonSubmit.classList.add('btnSubmit', 'btnModalSubmit');
    buttonSubmit.innerText = 'Edit Buku';

    const buttonClose = document.createElement('button');
    buttonClose.classList.add('btnClose', 'btnModalClose');
    buttonClose.innerText = 'Batal';

    const inputContainer = document.createElement('div');
    inputContainer.classList.add('input');
    inputContainer.append(titleLabel, inputTitle, authorLabel, inputAuthor, yearLabel, inputYear);

    const statusContainer = document.createElement('div');
    statusContainer.classList.add('status_buku');
    statusContainer.append(checkboxLabel, inputCheckbox);

    const formModal = document.createElement('form');
    formModal.classList.add('form_input');
    formModal.append(inputContainer, statusContainer, buttonSubmit, buttonClose);

    const contentContainer = document.createElement('section');
    contentContainer.classList.add('section_input');
    contentContainer.append(headerContainer, formModal);

    const modalContainer = document.createElement('div');
    modalContainer.classList.add('modal_content');
    modalContainer.append(contentContainer);
    
    const modalForm = document.createElement('div');
    modalForm.classList.add('modal_form');
    modalForm.append(modalContainer);

    container.appendChild(modalForm)

    editBook(id);
  });

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('btnHapus');
  deleteButton.innerText = 'Hapus buku';
  deleteButton.addEventListener('click', function() {
    if (confirm('Yakin ingin menghapus buku?')) {
      deleteBook(id);
    }
  });

  if (isCompleted) {
    const toggleButton = document.createElement('button');
    toggleButton.classList.add('btnStatus');
    toggleButton.innerText = 'Belum selesai dibaca';
    toggleButton.addEventListener('click', function() {
      toggleBookStatus(id);
    });

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('action');
    buttonContainer.append(toggleButton, editButton, deleteButton);
  
    container.append(buttonContainer);
  } else {
    const toggleButton = document.createElement('button');
    toggleButton.classList.add('btnStatus');
    toggleButton.innerText = 'Selesai dibaca';
    toggleButton.addEventListener('click', function() {
      toggleBookStatus(id);
    });

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('action');
    buttonContainer.append(toggleButton, editButton, deleteButton);
  
    container.append(buttonContainer);
  }

  return container;
}

function searchBook() {
  const searchText = document.querySelector('.search').value;
  const localStorageItem = JSON.parse(localStorage.getItem(STORAGE_KEY));

  const result = localStorageItem.filter(function(book) {
    return book.title.toLowerCase().includes(searchText);
  })

  if (searchText === '') {
    books = [];
    loadDataFromStorage();
  } else if (result.length === 0) {
    alert('Data buku tidak ditemukan');
  } else {
    books = [];
    for(const res of result) {
      books.push(res);
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
  }
}

function addBook() {
  const bookTitle = document.querySelector('.judul').value;
  const bookAuthor = document.querySelector('.penulis').value;
  const bookYear = document.querySelector('.tahun').value;
  const bookStatus = document.querySelector('.status').checked;

  const generatedId = generateId();
  const bookObject = generateBookObject(generatedId, bookTitle, bookAuthor, bookYear, bookStatus);
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function toggleBookStatus(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  if (bookTarget.isCompleted === true) {
    bookTarget.isCompleted = false;
  } else {
    bookTarget.isCompleted = true;
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function editBook(bookId) {
  const modalForm = document.querySelector('.modal_form');
  const inputTitle = document.querySelector('.modal_judul');
  const inputAuthor = document.querySelector('.modal_penulis');
  const inputYear = document.querySelector('.modal_tahun');
  const checkboxStatus = document.querySelector('.modal_status');
  const btnSubmit = document.querySelector('.btnModalSubmit');
  const btnClose = document.querySelector('.btnModalClose');

  const book = findBook(bookId);

  inputTitle.value = book.title;
  inputAuthor.value = book.author;
  inputYear.value = book.year;
  checkboxStatus.checked = book.isCompleted;
  btnSubmit.innerText = 'Edit buku';

  btnSubmit.addEventListener('click', function(event) {
    event.preventDefault();
    updateBook(book);
    modalForm.remove();
    document.dispatchEvent(new Event(RENDER_EVENT));
  });

  btnClose.addEventListener('click', function() {
    modalForm.remove();
    document.dispatchEvent(new Event(RENDER_EVENT));
  });
}

function updateBook(book) {
  const inputTitle = document.querySelector('.modal_judul').value;
  const inputAuthor = document.querySelector('.modal_penulis').value;
  const inputYear = document.querySelector('.modal_tahun').value;
  const checkboxStatus = document.querySelector('.modal_status').checked;

  book.title = inputTitle;
  book.author = inputAuthor;
  book.year = inputYear;
  book.isCompleted = checkboxStatus;

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function deleteBook(bookId) {
  const bookTarget = findBookIndex(bookId);
  
  if (bookTarget === -1) return;
  
  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

document.addEventListener('DOMContentLoaded', function() {
  const submitForm = document.querySelector('#form_input');
  const submitSearch = document.querySelector('#form_search');

  submitForm.addEventListener('submit', function(event) {
    event.preventDefault();
    addBook();
    clearFromData();
  });

  submitSearch.addEventListener('submit', function(event) {
    event.preventDefault();
    searchBook();
  });

  if (isStorageExist) {
    loadDataFromStorage();
  }
})

document.addEventListener(SAVED_EVENT, () => {
  console.log('Data berhasil disimpan');
});

document.addEventListener(RENDER_EVENT, function() {
  const uncompletedBookList = document.querySelector('#uncompletedBook');
  const completedBookList = document.querySelector('#completedBook');
  const bookStatus = document.querySelector('.status');
  const spanText = document.querySelector('.type');

  bookStatus.addEventListener('change', function() {
    if (this.checked) {
      spanText.innerText = 'Selesai dibaca';
    } else {
      spanText.innerText = 'Belum selesai dibaca';
    }
  })

  uncompletedBookList.innerHTML = '';
  completedBookList.innerHTML = '';

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);

    if (bookItem.isCompleted) {
      completedBookList.appendChild(bookElement);
    } else {
      uncompletedBookList.appendChild(bookElement);
    }
  }
});