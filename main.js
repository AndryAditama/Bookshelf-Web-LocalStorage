document.addEventListener('DOMContentLoaded', function () {

    // cek browser yang support local storage
    if (typeof Storage === undefined) {  // jika browser tidak support local storage
        alert("Browser anda tidak mendukung local storage");
        const error = document.createElement('div');
        error.classList.add('error');
        error.innerText = 'Silahkan ganti browser yang support local storage';
        document.body.appendChild(error);
        document.body.style.overflow = 'hidden';
    } else { // jika browser support local storage
        const formNewBook = document.getElementById('form-add-book');
        const submitFormNewBook = document.querySelector('#btn-submit-new-book');
        const incompleteBookshelfList = document.getElementById('book-list-incomplete');
        const completeBookshelfList = document.getElementById('book-list-complete');

        // get nama user dari localStorage
        const name = localStorage.getItem('name');

        // Cek apakah ada nama user dari localStorage
        if (!name) {
            const username = prompt('Masukkan nama anda');  // set nama user dan simpan ke localStorage
            if (username) {
                localStorage.setItem('name', username);
                document.querySelector('.username').innerText = `Hi, ${username}`;  

            } else if (username.charAt(0) === '') {
                localStorage.setItem('name', 'User');  // set nama user default
            }
        } else {
            document.querySelector('.username').innerText = `Hi, ${name}`;
        };

        // Edit nama user dari localStorage
        const editUsername = document.querySelector('.edit-username');
        editUsername.addEventListener('click', function () {
            const username = prompt('Masukkan nama anda');
            if (username) {
                localStorage.setItem('name', username);
                document.querySelector('.username').innerText = `Hi, ${username}`;             
            }
        });


        // tempat data buku
        let bookLists = [];

        // Memeriksa apakah ada data buku di localStorage
        const storedBooks = localStorage.getItem('bookLists');
        if (storedBooks) {
            bookLists = JSON.parse(storedBooks);
        };

        // Fungsi untuk menyimpan data buku ke localStorage
        function saveBooksToLocalStorage() {
            localStorage.setItem('bookLists', JSON.stringify(bookLists));
            deleteForm();
        };

        // Submit form untuk menambahkan buku
        formNewBook.addEventListener('submit', function (e) {
            e.preventDefault();

            // Mendapatkan nilai dari input form
            const newBookTitle = document.getElementById('input-title').value;
            const newAuthor = document.getElementById('input-author').value;
            const newYear = Number(document.getElementById('input-year').value);
            const newIsCompleteCheck = document.getElementById('input-isComplete-checker').checked;

            // Cek judul buku yang sama
            const isDuplicate = bookLists.some(book => book.title == newBookTitle);

            if (isDuplicate) {
                alert('Buku sudah ada dalam daftar.');
            } else {
                // Membuat objek buku baru
                const book = {
                    id: new Date().getTime(),
                    title: newBookTitle,
                    author: newAuthor,
                    year: newYear,
                    isComplete: newIsCompleteCheck,
                };
                
                // Menambahkan buku ke daftar dan menyimpan ke localStorage
                bookLists.push(book);
                saveBooksToLocalStorage();
                // Menampilkan rak buku
                showAllBooks();
            }
        });

        // Fungsi untuk menampilkan rak buku
        function showAllBooks() {
            incompleteBookshelfList.innerHTML = '';
            completeBookshelfList.innerHTML = '';

            for (const book of bookLists) {
                const bookItem = createBookItem(book);
                if (!book.isComplete) {
                    incompleteBookshelfList.appendChild(bookItem);
                } else {
                    completeBookshelfList.appendChild(bookItem);
                }
            }

            BooksCounter();
        };

        // Fungsi untuk menghitung data buku
        function BooksCounter() {
            const jumlahBuku = document.querySelector('.all-book');
            jumlahBuku.innerText = bookLists.length;

            const incompleteBook = document.querySelector('.incomplete-book');
            let incompleteCount = bookLists.filter(book => !book.isComplete);
            incompleteBook.innerText = incompleteCount.length;

            const completeBook = document.querySelector('.complete-book');
            let completeCount = bookLists.filter(book => book.isComplete);
            completeBook.innerText = completeCount.length;
        };


        // Fungsi untuk membuat elemen item buku dalam daftar
        function createBookItem(book) {
            const bookItem = document.createElement('div'); //wrapper item buku
            bookItem.className = 'book-item';
            bookItem.style.margin = '10px';

            const description = document.createElement('div'); //wrapper deskripsi buku
            description.className = 'item-description';

            const buttonsWrapper = document.createElement('div'); //wrapper tombol aksi
            buttonsWrapper.className = 'buttons-wrapper';

            const title = document.createElement('h3'); //judul buku
            title.classList.add('title');
            title.textContent = `Judul Buku : ${book.title}`;

            const author = document.createElement('p');       //penulis buku
            author.textContent = `Penulis : ${book.author}`;

            const year = document.createElement('p');        //tahun terbit buku
            year.textContent = `Tahun Terbit : ${book.year}`;

            // membuat tombol hapus dan menjalankan fungsi hapus buku
            const removeButton = createActionButton('', 'btn-remove', function () {
                deleteBook(book.id);
            });
            const img = document.createElement('img');
                img.src = 'img/icon-trash.png';
                removeButton.appendChild(img);

            // membuat tombol edit dan menjalankan fungsi edit buku
            let toggleButton;
            if (book.isComplete) {
                toggleButton = createActionButton('', 'btn-complete', function () {
                    toOtherShelf(book.id);
                });
                const img = document.createElement('img');
                img.src = 'img/icon-repeat.png';
                toggleButton.appendChild(img);

            } else {
                toggleButton = createActionButton('', 'btn-incomplete', function () {
                    toOtherShelf(book.id);
                });
                const img = document.createElement('img');
                img.src = 'img/icon-check.png';
                toggleButton.appendChild(img);

            }
            
            buttonsWrapper.appendChild(toggleButton);
            buttonsWrapper.appendChild(removeButton);

            bookItem.appendChild(description);
            bookItem.appendChild(buttonsWrapper);

            description.appendChild(title);
            description.appendChild(author);
            description.appendChild(year);

            return bookItem;
        };

        // Fungsi untuk membuat elemen tombol aksi
        function createActionButton(text, className, clickHandler) {
            const button = document.createElement('button');
            button.textContent = text;
            button.classList.add(className);
            button.addEventListener('click', clickHandler);
            return button;
        };

        // menjalankan fungsi untuk menampilkan semua data buku
        showAllBooks();


        //fungsi untuk menghapus form input
        function deleteForm() {
            document.getElementById('input-title').value = '';
            document.getElementById('input-author').value = '';
            document.getElementById('input-year').value = '';
            document.getElementById('input-isComplete-checker').checked = false;
        };

        // melakukan pencarian data buku
        document.getElementById("cari-buku").addEventListener("keyup", function () {
            const inputValue = document.getElementById("cari-buku").value;
            const listBooks = document.querySelectorAll(".book-item");

            for (let i = 0; i < listBooks.length; i++) {
                if (!inputValue || listBooks[i].textContent.toLowerCase().indexOf(inputValue) > -1) {
                listBooks[i].style.display = "flex";
                
                } else {
                listBooks[i].style.display = "none";
                }
            }
        });

        // fungsi untuk memindahkan buku ke rak yang sudah selesai dibaca
        function toOtherShelf(id) {
            const book = bookLists.find(b => b.id === id);
            book.isComplete =!book.isComplete;
            saveBooksToLocalStorage();
            showAllBooks();
        };

        // fungsi untuk menghapus buku
        function deleteBook(id) {
            bookLists = bookLists.filter(b => b.id!== id);
            saveBooksToLocalStorage();
            showAllBooks();
        };


        //script untuk menampilkan tombol to top saat user melakukan scroll
        let toTop = document.querySelector('.to-top'); 
        window.addEventListener('scroll', function () { 
            if (document.body.scrollTop > 20  || document.documentElement.scrollTop > 20) { 
                toTop.style.display = 'block'; 
            } else { 
                toTop.style.display = 'none'; 
            } 
        });

        //script untuk mengarahkan ke top page setelah menekan tombol to top
        toTop.addEventListener('click', function() {
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        });

        //event untuk mereset semua data buku & username
        const resetButton = document.querySelector('.reset');
        resetButton.addEventListener('click', function () {
            const deleteAll = confirm('Apakah anda yakin ingin mereset semua data?');
            
            if (deleteAll) {
                bookLists = [];
                localStorage.removeItem('name');
                localStorage.removeItem('bookLists');
                window.location.reload();
            }
        });

    }

});