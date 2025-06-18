document.addEventListener('DOMContentLoaded', () => {

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

  const VALID_USER = {
    username: 'demo',
    password: 'password123'
  };

  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', event => {
      event.preventDefault();

      const enteredUsername = loginForm.querySelector('input[type="text"]').value.trim();
      const enteredPassword = loginForm.querySelector('input[type="password"]').value;

      if (enteredUsername === VALID_USER.username && enteredPassword === VALID_USER.password) {
        // Simulate successful login
        localStorage.setItem('isLoggedIn', 'true');
        window.location.href = 'home.html';
      } else {
        alert('Incorrect username or password.');
      }
    });
  }

});
