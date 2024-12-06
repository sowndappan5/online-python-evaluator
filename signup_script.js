// Mock database for user accounts
const users = [
    { email: "test@example.com", password: "12345" }, // Pre-existing user for testing
  ];
  
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const showSignup = document.getElementById('show-signup');
  const showLogin = document.getElementById('show-login');
  const loginError = document.getElementById('login-error');
  const signupError = document.getElementById('signup-error');
  
  // Toggle to Sign-Up Form
  showSignup.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.add('hidden');
    signupForm.classList.remove('hidden');
    loginError.textContent = ""; // Clear error messages
  });
  
  // Toggle to Login Form
  showLogin.addEventListener('click', (e) => {
    e.preventDefault();
    signupForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
    signupError.textContent = ""; // Clear error messages
  });
  
  // Login Form Submission
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
  
    // Check if the user exists
    const user = users.find(u => u.email === email && u.password === password);
  
    if (user) {
      // Redirect to a blank page (simulate next step)
      window.location.href = "index.html";
    } else {
      loginError.textContent = "Invalid email or password. Please try again.";
    }
  });
  
  // Sign-Up Form Submission
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
  
    // Check if the user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      signupError.textContent = "Email is already registered.";
      return;
    }
  
    // Add the new user to the database
    users.push({ email, password });
    alert("Sign-up successful! You can now log in.");
    signupForm.reset();
    signupForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
  });
  