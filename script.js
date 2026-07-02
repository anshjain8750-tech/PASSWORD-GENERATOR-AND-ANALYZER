// ELEMENTS
const passwordDisplay = document.getElementById('password-display');
const lengthSlider = document.getElementById('length');
const lengthVal = document.getElementById('length-val');
const uppercaseCb = document.getElementById('uppercase');
const numbersCb = document.getElementById('numbers');
const symbolsCb = document.getElementById('symbols');
const generateBtn = document.getElementById('generate-btn');
const copyBtn = document.getElementById('copy-btn');
const clearBtn = document.getElementById('clear-btn');
const saveBtn = document.getElementById('save-btn');
const warningText = document.getElementById('warning-text');
const strengthBar = document.querySelector('.strength-bar');
const strengthText = document.getElementById('strength-text');
const crackTimeText = document.getElementById('crack-time');

// STRENGTH LOGIC
function updateStrengthMeter(password) {
    if (!strengthBar) return;
    if (password.length === 0) {
        strengthBar.style.width = '0%';
        if (strengthText) strengthText.innerText = 'Strength: --';
        if (crackTimeText) crackTimeText.innerText = 'Estimated Crack Time: --';
        return;
    }
    let pool = 26; 
    if (/[A-Z]/.test(password)) pool += 26;
    if (/[0-9]/.test(password)) pool += 10;
    if (/[^a-zA-Z0-9]/.test(password)) pool += 32;
    const entropy = password.length * Math.log2(pool);
    const percentage = Math.min((entropy / 120) * 100, 100);
    strengthBar.style.width = percentage + '%';
    if (percentage < 33) {
        strengthBar.style.backgroundColor = '#ff0055';
        if (strengthText) strengthText.innerText = 'Strength: WEAK';
    } else if (percentage < 66) {
        strengthBar.style.backgroundColor = '#ffaa00';
        if (strengthText) strengthText.innerText = 'Strength: MEDIUM';
    } else {
        strengthBar.style.backgroundColor = '#00ffcc';
        if (strengthText) strengthText.innerText = 'Strength: STRONG';
    }
    if (crackTimeText) crackTimeText.innerText = entropy > 80 ? "Estimated Crack Time: Centuries" : "Estimated Crack Time: Fast";
}

// GENERATE
generateBtn.addEventListener('click', () => {
    let chars = "abcdefghijklmnopqrstuvwxyz";
    if (uppercaseCb.checked) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (numbersCb.checked) chars += "0123456789";
    if (symbolsCb.checked) chars += "!@#$%^&*()_+~`|}{[]:;?><,./-=";
    let pass = "";
    let len = parseInt(lengthSlider.value);
    for (let i = 0; i < len; i++) pass += chars[Math.floor(Math.random() * chars.length)];
    passwordDisplay.value = pass;
    passwordDisplay.maxLength = len;
    warningText.style.display = "none";
    updateStrengthMeter(pass);
});

// INPUT (Scrub + Length Limit)
passwordDisplay.addEventListener('input', (e) => {
    const len = parseInt(lengthSlider.value);
    if (e.target.value.length > len) e.target.value = e.target.value.substring(0, len);
    let allowed = "abcdefghijklmnopqrstuvwxyz";
    if (uppercaseCb.checked) allowed += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (numbersCb.checked) allowed += "0123456789";
    if (symbolsCb.checked) allowed += "!@#$%^&*()_+~`|}{[]:;?><,./-=";
    let val = e.target.value;
    let filtered = [...val].filter(c => allowed.includes(c)).join('');
    if (val !== filtered) e.target.value = filtered;
    updateStrengthMeter(e.target.value);
});

// LENGTH SLIDER
lengthSlider.addEventListener('input', () => {
    const len = parseInt(lengthSlider.value);
    lengthVal.innerText = len;
    passwordDisplay.maxLength = len;
    if (passwordDisplay.value.length > len) {
        passwordDisplay.value = passwordDisplay.value.substring(0, len);
        updateStrengthMeter(passwordDisplay.value);
    }
});

// BUTTONS
copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value) {
        navigator.clipboard.writeText(passwordDisplay.value)
            .then(() => alert("Password copied!"))
            .catch(() => alert("Failed to copy."));
    }
});

clearBtn.addEventListener('click', () => { 
    passwordDisplay.value = ""; 
    updateStrengthMeter(""); 
    warningText.style.display = "none"; 
});

saveBtn.addEventListener('click', () => {
    let pass = passwordDisplay.value;
    if (!pass) return;
    let db = JSON.parse(localStorage.getItem('myKeys') || '[]');
    if (!db.includes(pass)) {
        db.push(pass);
        localStorage.setItem('myKeys', JSON.stringify(db));
        warningText.innerText = "SAVED!";
        warningText.style.display = "block";
    }
});