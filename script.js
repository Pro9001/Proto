let timer;
let coinBalance = 0.00;
let mining = false;
let timeLeft = 24 * 60 * 60; // 24 hours in seconds

// Load saved progress
window.onload = function() {
    const savedCoinBalance = localStorage.getItem('coinBalance');
    const savedTimeLeft = localStorage.getItem('timeLeft');
    const currentUser = localStorage.getItem('currentUser');

    if (currentUser) {
        showMiningPage();
        if (savedCoinBalance !== null) {
            coinBalance = parseFloat(savedCoinBalance);
            document.getElementById('coin-balance').innerText = coinBalance.toFixed(2);
        }

        if (savedTimeLeft !== null) {
            timeLeft = parseInt(savedTimeLeft);
            updateTimerDisplay();
        }
    } else {
        document.getElementById('signup-form').style.display = 'block';
    }
}

function toggleForm() {
    const signupForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');
    signupForm.style.display = signupForm.style.display === 'none' ? 'block' : 'none';
    loginForm.style.display = loginForm.style.display === 'none' ? 'block' : 'none';
}

function signUp() {
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;
    const signupError = document.getElementById('signup-error');

    if (!username || !password) {
        signupError.style.display = 'block';
        return;
    }

    localStorage.setItem('user_' + username, JSON.stringify({ username, password, coinBalance: 10 }));
    localStorage.setItem('currentUser', username);
    coinBalance = 10;
    localStorage.setItem('coinBalance', coinBalance.toFixed(2));
    signupError.style.display = 'none';
    showMiningPage();
}

function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const loginError = document.getElementById('login-error');

    if (!username || !password) {
        loginError.style.display = 'block';
        return;
    }

    const user = JSON.parse(localStorage.getItem('user_' + username));
    if (user && user.password === password) {
        localStorage.setItem('currentUser', username);
        coinBalance = user.coinBalance;
        localStorage.setItem('coinBalance', coinBalance.toFixed(2));
        loginError.style.display = 'none';
        showMiningPage();
    } else {
        loginError.innerText = 'Invalid username or password';
        loginError.style.display = 'block';
    }
}

function showMiningPage() {
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('mining-container').style.display = 'block';
}

function startMining() {
    if (mining) return;
    mining = true;

    document.getElementById('restart-message').style.display = 'none';
    document.getElementById('mining-started-message').style.display = 'block';
    document.getElementById('coin-balance').style.color = '#32CD32'; // Parrot Green color

    timer = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timer);
            mining = false;
            document.getElementById('coin-balance').style.color = 'red';
            document.getElementById('restart-message').style.display = 'block';
            document.getElementById('mining-started-message').style.display = 'none';
            return;
        }

        timeLeft--;
        updateTimerDisplay();

        coinBalance += 0.01;
        document.getElementById('coin-balance').innerText = coinBalance.toFixed(2);

        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            const user = JSON.parse(localStorage.getItem('user_' + currentUser));
            user.coinBalance = coinBalance;
            localStorage.setItem('user_' + currentUser, JSON.stringify(user));
        }

        // Save progress
        localStorage.setItem('coinBalance', coinBalance.toFixed(2));
        localStorage.setItem('timeLeft', timeLeft);
    }, 1000);
}

function updateTimerDisplay() {
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;
    document.getElementById('timer').innerText = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function withdraw() {
    window.location.href = "https://pro9001.github.io/Protocol-/";
}

function openWhitepaper() {
    window.location.href = "https://pro9001.github.io/Whitepaper-PRTCL/";
}
