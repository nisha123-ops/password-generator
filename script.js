// Console me print karega check karne ke liye ki JS file load ho gayi hai
console.log("smart password generator javascript connected!");

/* ========================================================
   1. HTML ELEMENTS FETCH KARNA (VARIABLES STORE KARNA)
   ======================================================== */

// Header & Dropdown menu elements
const menuBtn = document.getElementById("menuBtn"); // 3-dot menu button
const menu = document.getElementById("menu"); // Dropdown menu box
const historyBtn = document.getElementById("historyBtn"); // Dropdown ke andar ka 'History' button
const clearHistoryBtn = document.getElementById("clearHistoryBtn"); // Dropdown ke andar ka 'Delete History' button

// History Panel elements
const historyPanel = document.getElementById("historyPanel"); // Bottom/Overlay history panel
const closeHistoryBtn = document.getElementById("closeHistoryBtn"); // Top-right corner ka 'X' button
const historyList = document.getElementById("historyList"); // Container jahan passwords list honge


// History Action Buttons
const deleteSelectedBtn = document.getElementById("deleteSelectedBtn"); // Selected checkboxes ko delete karne wala button
const cancelSelectionBtn = document.getElementById("cancelSelectionBtn"); // Selection cancel karne wala button
const clearAllHistoryBtn = document.getElementById("clearAllHistoryBtn"); // Saare history ek saath clear karne wala button

// Generator Input & Button elements
const generateBtn = document.getElementById("generateBtn"); // Main 'Generate Password' button
const passwordInput = document.getElementById("password"); // Main password display box
const lengthInput = document.getElementById("length"); // Password length number input box

// Checkbox elements
const uppercaseCheckbox = document.getElementById("uppercase"); // Uppercase checkbox
const lowercaseCheckbox = document.getElementById("lowercase"); // Lowercase checkbox
const numbersCheckbox = document.getElementById("numbers"); // Numbers checkbox
const symbolsCheckbox = document.getElementById("symbols"); // Symbols checkbox

// Extra Utility elements
const strengthText = document.getElementById("strengthText"); // Password strength text show karne ke liye
const copyBtn = document.getElementById("copyBtn"); // Copy button
const togglePassword = document.getElementById("togglePassword"); // Eye icon toggle button

// Passwords ko memory me save rakhne ke liye global array
let passwordHistory = [];


/* ========================================================
   2. DROPDOWN MENU AUR HISTORY PANEL CONTROL LOGIC
   ======================================================== */

// 3-dot button click hone par dropdown menu show/hide hoga
menuBtn.addEventListener("click", function(event) {
    event.stopPropagation(); // Click event ko bahar spread hone se rokta hai
    menu.classList.toggle("show"); // CSS class 'show' add/remove karega
});

// Screen par kahin bhi bahar click karne par dropdown menu band ho jayega
document.addEventListener("click", function(event) {
    if (!menu.contains(event.target) && !menuBtn.contains(event.target)) {
        menu.classList.remove("show"); // Menu hide kar do
    }
});

// Menu ke andar 'History' button click karne par: Panel open karo aur Dropdown band karo
historyBtn.addEventListener("click", function() {
    historyPanel.style.display = "block"; // Bottom history panel show karega
    menu.classList.remove("show"); // Dropdown menu hide kar dega
});

// Right-side corner ke 'X' button par click karne par history panel close hoga
closeHistoryBtn.addEventListener("click", function() {
    historyPanel.style.display = "none"; // History panel hide ho jayega
});

// Menu ke andar 'Delete History' click karne par poori history clear ho jayegi
if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener("click", function() {
        passwordHistory = []; // Array empty kar do
        displayHistory(); // UI refresh karo
        menu.classList.remove("show"); // Menu close karo
    });
}


/* ========================================================
   3. PASSWORD GENERATION LOGIC
   ======================================================== */

generateBtn.addEventListener("click", function() {
    console.log("Generate button clicked!");
    
    // User dwara Dali gayi Length ko Number me convert kar rahe hain
    const length = Number(lengthInput.value);

    // Validation 1: Agar length 0 ya invalid hai
    if (length <= 0) {
        alert("Please enter a valid password length.");
        return;
    }

    // Available characters string build kar rahe hain
    let characters = "";
    if (uppercaseCheckbox.checked) characters += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (lowercaseCheckbox.checked) characters += "abcdefghijklmnopqrstuvwxyz";
    if (numbersCheckbox.checked) characters += "0123456789";
    if (symbolsCheckbox.checked) characters += "!@#$%^&*~/";

    // Validation 2: Agar koi bhi option check nahi kiya
    if (characters === "") {
        alert("Please select at least one password option.");
        return;
    }

    // Selected options count kar rahe hain
    let selectedOptions = 0;
    if (uppercaseCheckbox.checked) selectedOptions++;
    if (lowercaseCheckbox.checked) selectedOptions++;
    if (numbersCheckbox.checked) selectedOptions++;
    if (symbolsCheckbox.checked) selectedOptions++;

    // Validation 3: Length selected options se choti nahi ho sakti
    if (length < selectedOptions) {
        alert("Password length must be at least the number of selected options.");
        return;
    }

    let password = "";

    // Har selected type se kam se kam 1 character pakka add karo
    if (uppercaseCheckbox.checked) {
        password += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)];
    }
    if (lowercaseCheckbox.checked) {
        password += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)];
    }
    if (numbersCheckbox.checked) {
        password += "0123456789"[Math.floor(Math.random() * 10)];
    }
    if (symbolsCheckbox.checked) {
        password += "!@#$%^&*~/"[Math.floor(Math.random() * 10)];
    }

    // Baaki bachi hui length ke liye random characters fill karo
    while (password.length < length) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters[randomIndex];
    }

    // Display box me new password set karo
    passwordInput.value = password;

    // History array me save karo
    passwordHistory.push(password);

    // Agar 10 se zyada passwords ho jayein, toh sabse purana remove kar do
    if (passwordHistory.length > 10) {
        passwordHistory.shift();
    }

    // UI update aur strength check call karo
    displayHistory();
    checkPasswordStrength(password);
});


/* ========================================================
   4. CHECKBOXES AUR HISTORY RENDER LOGIC
   ======================================================== */

// Screen par History list aur Checkboxes render karne ka function
function displayHistory() {
    historyList.innerHTML = ""; // Container clear karo

    // History items ko loop karke HTML element bana rahe hain
    passwordHistory.forEach(function(password, index) {

        // Single row container div
        const historyItem = document.createElement("div");
        historyItem.classList.add("history-item");

        // Har password ke aage Checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.dataset.index = index; // Array index position save kar rahe hain

        // Checkbox click hone par delete button check karo
        checkbox.addEventListener("change", checkSelectedItems);

        // Password Text span tag
        const passwordText = document.createElement("span");
        passwordText.textContent = password;

        // Elements ko append karo
        historyItem.appendChild(checkbox);
        historyItem.appendChild(passwordText);
        historyList.appendChild(historyItem);
    });

    // Checkbox buttons visibility update karo
    checkSelectedItems();
}

// Check karega ki koi checkbox select hua hai ya nahi
function checkSelectedItems() {
    const checkedBoxes = historyList.querySelectorAll("input[type='checkbox']:checked");
    
    // Agar kam se kam 1 checkbox tick hai, toh 'Delete' aur 'Cancel' button dikhao
    if (checkedBoxes.length > 0) {
        if (deleteSelectedBtn) deleteSelectedBtn.style.display = "inline-block";
    } else {
        if (deleteSelectedBtn) deleteSelectedBtn.style.display = "none";
    }
}

// ONLY SELECTED Checkboxes wale passwords delete karne ka button
if (deleteSelectedBtn) {
    deleteSelectedBtn.addEventListener("click", function() {
        // Ticked checkboxes fetch karo
        const checkedBoxes = historyList.querySelectorAll("input[type='checkbox']:checked");
        
        // Indexes nikaal kar descending order (bade se chota) me sort karo
        const indexesToDelete = Array.from(checkedBoxes)
            .map(cb => Number(cb.dataset.index))
            .sort((a, b) => b - a);

        // Array se selected items remove karo
        indexesToDelete.forEach(function(index) {
            passwordHistory.splice(index, 1);
        });

        // History UI wapas refresh karo
        displayHistory();
    });
}

// Checkbox selections cancel karne ka button
if (cancelSelectionBtn) {
    cancelSelectionBtn.addEventListener("click", function() {
        const checkboxes = historyList.querySelectorAll("input[type='checkbox']");
        checkboxes.forEach(cb => cb.checked = false); // Sab uncheck kar do
        checkSelectedItems(); // Buttons hide kar do
    });
}

// SAARE Passwords ek saath Clear karne ka button
if (clearAllHistoryBtn) {
    clearAllHistoryBtn.addEventListener("click", function() {
        passwordHistory = []; // Memory se saare password hata do
        displayHistory(); // UI empty kar do
    });
}

/* ========================================================
   5. STRENGTH CHECKER, COPY & EYE TOGGLE LOGIC
   ======================================================== */

// Password kitna strong hai check karne ka function
function checkPasswordStrength(password) {
    let score = 0;
    
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[!@#$%^&*~/]/.test(password)) score++;

    if (score <= 2) {
        strengthText.textContent = "Weak";
    } else if (score <= 4) {
        strengthText.textContent = "Medium";
    } else {
        strengthText.textContent = "Strong";
    }
}

// Clipboard me Copy karne ka logic
copyBtn.addEventListener("click", function() {
    navigator.clipboard.writeText(passwordInput.value);
    copyBtn.textContent = "Copied";
    
    setTimeout(function() {
        copyBtn.textContent = "Copy";
    }, 2000);
});

// Password Show / Hide toggle karne ka eye button
togglePassword.addEventListener("click", function() {
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
    } else {
        passwordInput.type = "password";
    }
});