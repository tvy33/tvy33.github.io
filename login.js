// login.js
// Xử lý toggling mật khẩu và đăng nhập “cứng”

document.addEventListener('DOMContentLoaded', () => {

  // --- Toggle hiện/ẩn mật khẩu ---
  const toggleBtn = document.querySelector('.toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', e => {
      const pwInput = toggleBtn.previousElementSibling;
      if (pwInput && pwInput.type === 'password') {
        pwInput.type = 'text';
      } else if (pwInput) {
        pwInput.type = 'password';
      }
    });
  }

  // --- Định nghĩa tài khoản cố định ---
  const VALID_USER = {
    username: 'demo',
    password: 'password123'
  };

  // --- Xử lý form login ---
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', event => {
      event.preventDefault();

      const enteredUsername = loginForm.querySelector('input[type="text"]').value.trim();
      const enteredPassword = loginForm.querySelector('input[type="password"]').value;

      // Kiểm tra thông tin
      if (enteredUsername === VALID_USER.username && enteredPassword === VALID_USER.password) {
        // Lưu trạng thái đã đăng nhập
        localStorage.setItem('isLoggedIn', 'true');
        // Chuyển hướng về trang home.html
        window.location.href = 'home.html';
      } else {
        alert('Sai tên đăng nhập hoặc mật khẩu');
      }
    });
  }

});
