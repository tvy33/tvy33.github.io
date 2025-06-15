// Lưu thông tin người dùng vào localStorage và chuyển sang trang login

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signup-form');
  form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Lấy giá trị từ form
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirm = document.getElementById('confirm').value;

    // Kiểm tra mật khẩu
    if (password !== confirm) {
      alert('Password and Confirm Password must match.');
      return;
    }

    // Lưu user vào localStorage
    const user = { email, password };
    localStorage.setItem('vdcl_user', JSON.stringify(user));

    // Chuyển tự động sang login
    window.location.href = 'login.html';
  });
});