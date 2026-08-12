/* =========================================
   ADMIN PANEL JS - TJKT 3
   ========================================= */

const CORRECT_PIN = "030308";

// PIN Input Functions
function addPin(num) {
    const input = document.getElementById('pinInput');
    if (input.value.length < 6) {
        input.value += num;
        document.getElementById('login-error').innerText = '';
        input.classList.remove('error');
    }
}

function clearPin() {
    const input = document.getElementById('pinInput');
    input.value = '';
    document.getElementById('login-error').innerText = '';
    input.classList.remove('error');
}

function submitPin() {
    const input = document.getElementById('pinInput');
    const errorMsg = document.getElementById('login-error');
    const loadingBar = document.getElementById('loadingBarLogin');
    const loginOverlay = document.getElementById('login-overlay');
    const dashboard = document.getElementById('admin-dashboard');
    
    const enteredPin = input.value;
    
    if (enteredPin === CORRECT_PIN) {
        // PIN BENAR
        errorMsg.innerText = '';
        input.classList.remove('error');
        input.disabled = true;
        
        // Tampilkan loading bar
        loadingBar.classList.add('active');
        
        // Disable semua tombol keypad
        document.querySelectorAll('.pin-keypad button').forEach(btn => {
            btn.disabled = true;
            btn.style.opacity = '0.5';
        });
        
        // Tunggu 3 detik lalu pindah ke dashboard
        setTimeout(() => {
            loginOverlay.classList.add('hidden');
            dashboard.style.display = 'block';
            document.body.style.overflow = 'auto';
        }, 3000);
        
    } else {
        // PIN SALAH
        errorMsg.innerText = '❌ PIN SALAH! AKSES DITOLAK!';
        input.classList.add('error');
        input.value = '';
        
        // Getarkan input
        input.style.animation = 'none';
        input.offsetHeight;
        input.style.animation = 'shake 0.5s ease';
        
        // Fokus kembali ke input
        setTimeout(() => {
            input.focus();
        }, 500);
    }
}

// Enter key support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const input = document.getElementById('pinInput');
        if (document.activeElement === input) {
            submitPin();
        }
    }
});

// Logout
function logout() {
    if (confirm('Yakin ingin logout? Anda harus memasukkan PIN lagi untuk mengakses admin.')) {
        window.location.href = 'admin.html';
    }
}

// Back to home
function goHome() {
    if (confirm('Kembali ke halaman utama?')) {
        window.location.href = '../index.html';
    }
}

// Smooth scroll untuk menu admin
document.querySelectorAll('.admin-menu a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            
            // Update active state
            document.querySelectorAll('.admin-menu a').forEach(a => a.classList.remove('active'));
            this.classList.add('active');
        }
    });
});