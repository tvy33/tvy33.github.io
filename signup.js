document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signup-form');
  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirm = document.getElementById('confirm').value;

    if (password !== confirm) {
      alert('Password and Confirm Password must match.');
      return;
    }

    const user = { email, password };
    localStorage.setItem('vdcl_user', JSON.stringify(user));

    window.location.href = 'login.html';
  });
});