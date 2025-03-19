// document.addEventListener("DOMContentLoaded", function() {
//     checkUserSession();
//     loadBooks();
//     loadBorrowedBooks();
// });

// function signIn() {
//     let username = document.getElementById("username").value.trim();
//     if (username === "") {
//         alert("Please enter your name");
//         return;
//     }

//     localStorage.setItem("libraryUser", username);

//     // Load existing borrowed books if they exist, else set an empty array
//     if (!localStorage.getItem(`borrowedBooks_${username}`)) {
//         localStorage.setItem(`borrowedBooks_${username}`, JSON.stringify([]));
//     }

//     updateAuthUI(username);
//     loadBorrowedBooks();
// }


// function signOut() {
//     localStorage.removeItem("libraryUser");
//     updateAuthUI(null);
//     document.getElementById("borrowed-books").innerHTML = "";
// }

// function updateAuthUI(username) {
//     let welcomeMessage = document.getElementById("welcome-message");
//     let signOutButton = document.querySelector("#auth-section button:nth-of-type(2)");
//     let signInInput = document.getElementById("username");
//     let signInButton = document.querySelector("#auth-section button:nth-of-type(1)");

//     if (username) {
//         welcomeMessage.textContent = `Welcome, ${username}`;
//         welcomeMessage.style.display = "block";
//         signOutButton.style.display = "inline";
//         signInInput.style.display = "none";
//         signInButton.style.display = "none";
//     } else {
//         welcomeMessage.style.display = "none";
//         signOutButton.style.display = "none";
//         signInInput.style.display = "inline";
//         signInButton.style.display = "inline";
//     }
// }

// function checkUserSession() {
//     let username = localStorage.getItem("libraryUser");
//     updateAuthUI(username);
//     loadBorrowedBooks();
// }

// function loadBooks() {
//     let books = [
//         { title: "Book 1", author: "Author A" },
//         { title: "Book 2", author: "Author B" },
//         { title: "Book 3", author: "Author C" }
//     ];
//     let bookList = document.getElementById("book-list");
//     bookList.innerHTML = "";
//     books.forEach((book, index) => {
//         let li = document.createElement("li");
//         li.textContent = `${book.title} by ${book.author}`;
//         let borrowButton = document.createElement("button");
//         borrowButton.textContent = "Borrow";
//         borrowButton.onclick = function() { borrowBook(index, book); };
//         li.appendChild(borrowButton);
//         bookList.appendChild(li);
//     });
// }

// function loadBorrowedBooks() {
//     let username = localStorage.getItem("libraryUser");
//     if (!username) return;
//     let borrowedBooks = JSON.parse(localStorage.getItem(`borrowedBooks_${username}`)) || [];
//     let borrowedList = document.getElementById("borrowed-books");
//     borrowedList.innerHTML = "";
//     borrowedBooks.forEach((book, index) => {
//         let li = document.createElement("li");
//         li.textContent = `${book.title} (Due: ${book.dueDate})`;
//         let returnButton = document.createElement("button");
//         returnButton.textContent = "Return";
//         returnButton.onclick = function() { returnBook(index); };
//         li.appendChild(returnButton);
//         borrowedList.appendChild(li);
//     });
// }

// function borrowBook(index, book) {
//     let username = localStorage.getItem("libraryUser");
//     if (!username) {
//         alert("Please sign in first");
//         return;
//     }
//     let borrowedBooks = JSON.parse(localStorage.getItem(`borrowedBooks_${username}`)) || [];
//     if (borrowedBooks.length >= 3) {
//         alert("You cannot borrow more than 3 books at a time.");
//         return;
//     }
//     let dueDate = new Date();
//     dueDate.setDate(dueDate.getDate() + 14);
//     book.dueDate = dueDate.toDateString();
//     borrowedBooks.push(book);
//     localStorage.setItem(`borrowedBooks_${username}`, JSON.stringify(borrowedBooks));
//     loadBorrowedBooks();
// }

// function returnBook(index) {
//     let username = localStorage.getItem("libraryUser");
//     if (!username) return;
//     let borrowedBooks = JSON.parse(localStorage.getItem(`borrowedBooks_${username}`));
//     borrowedBooks.splice(index, 1);
//     localStorage.setItem(`borrowedBooks_${username}`, JSON.stringify(borrowedBooks));
//     loadBorrowedBooks();
// }
// */

document.addEventListener("DOMContentLoaded", function() {
    checkUserSession();
    loadBooks();
    loadBorrowedBooks();
    const darkModeToggle = document.getElementById("dark-mode-toggle");
    // Function to toggle dark mode
    function toggleDarkMode() {
        document.body.classList.toggle("dark-mode");

        // Save user preference in localStorage
        const isDarkMode = document.body.classList.contains("dark-mode");
        localStorage.setItem("darkMode", isDarkMode);
        console.log("Dark mode set to:", isDarkMode);
    }

    // Load dark mode setting from localStorage
    function loadTheme() {
        try {
            const isDarkMode = localStorage.getItem("darkMode") === "true";
            console.log("Dark mode from storage:", isDarkMode);
            if (isDarkMode) {
                document.body.classList.add("dark-mode");
            } else {
                document.body.classList.remove("dark-mode");
            }
        } catch (error) {
            console.error("Error loading theme:", error);
        }
    }

    // Event listener for dark mode toggle
    darkModeToggle.addEventListener("click", toggleDarkMode);

    // Apply theme on page load
    loadTheme();
});

function signIn() {
    let username = document.getElementById("username").value.trim();
    if (username === "") {
        alert("Please enter your name");
        return;
    }

    localStorage.setItem("libraryUser", username);

    // Load existing borrowed books if they exist, else set an empty array
    if (!localStorage.getItem(`borrowedBooks_${username}`)) {
        localStorage.setItem(`borrowedBooks_${username}`, JSON.stringify([]));
    }

    updateAuthUI(username);
    loadBorrowedBooks();
}

function signOut() {
    localStorage.removeItem("libraryUser");
    updateAuthUI(null);
    document.getElementById("borrowed-books").innerHTML = "";
}

function updateAuthUI(username) {
    let welcomeMessage = document.getElementById("welcome-message");
    let signOutButton = document.querySelector("#auth-section button:nth-of-type(2)");
    let signInInput = document.getElementById("username");
    let signInButton = document.querySelector("#auth-section button:nth-of-type(1)");

    if (username) {
        welcomeMessage.textContent = `Welcome, ${username}`;
        welcomeMessage.style.display = "block";
        signOutButton.style.display = "inline";
        signInInput.style.display = "none";
        signInButton.style.display = "none";
    } else {
        welcomeMessage.style.display = "none";
        signOutButton.style.display = "none";
        signInInput.style.display = "inline";
        signInButton.style.display = "inline";
    }
}

function checkUserSession() {
    let username = localStorage.getItem("libraryUser");
    updateAuthUI(username);
    loadBorrowedBooks();
}

function loadBooks() {
    let books = [
        { title: "Book 1", author: "Author A" },
        { title: "Book 2", author: "Author B" },
        { title: "Book 3", author: "Author C" }
    ];
    let bookList = document.getElementById("book-list");
    bookList.innerHTML = "";
    books.forEach((book, index) => {
        let li = document.createElement("li");
        li.textContent = `${book.title} by ${book.author}`;
        let borrowButton = document.createElement("button");
        borrowButton.textContent = "Borrow";
        borrowButton.onclick = function() { borrowBook(index, book); };
        li.appendChild(borrowButton);
        bookList.appendChild(li);
    });
}

function loadBorrowedBooks() {
    let username = localStorage.getItem("libraryUser");
    if (!username) return;
    let borrowedBooks = JSON.parse(localStorage.getItem(`borrowedBooks_${username}`)) || [];
    let borrowedList = document.getElementById("borrowed-books");
    borrowedList.innerHTML = "";
    borrowedBooks.forEach((book, index) => {
        let li = document.createElement("li");
        li.textContent = `${book.title} (Due: ${book.dueDate})`;
        let returnButton = document.createElement("button");
        returnButton.textContent = "Return";
        returnButton.onclick = function() { returnBook(index); };
        li.appendChild(returnButton);
        borrowedList.appendChild(li);
    });
}

function borrowBook(index, book) {
    let username = localStorage.getItem("libraryUser");
    if (!username) {
        alert("Please sign in first");
        return;
    }
    let borrowedBooks = JSON.parse(localStorage.getItem(`borrowedBooks_${username}`)) || [];
    if (borrowedBooks.length >= 3) {
        alert("You cannot borrow more than 3 books at a time.");
        return;
    }
    let dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);
    book.dueDate = dueDate.toDateString();
    borrowedBooks.push(book);
    localStorage.setItem(`borrowedBooks_${username}`, JSON.stringify(borrowedBooks));
    loadBorrowedBooks();
}

function returnBook(index) {
    let username = localStorage.getItem("libraryUser");
    if (!username) return;
    let borrowedBooks = JSON.parse(localStorage.getItem(`borrowedBooks_${username}`));
    borrowedBooks.splice(index, 1);
    localStorage.setItem(`borrowedBooks_${username}`, JSON.stringify(borrowedBooks));
    loadBorrowedBooks();
}



