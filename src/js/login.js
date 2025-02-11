// login.js

console.log("login.js loaded"); // Debug: Confirm the script is loaded

const myForm = document.querySelector('#loginForm');

if (!myForm) {
  console.error("Form with id 'loginForm' not found.");
} else {
  myForm.addEventListener('submit', event => {
    event.preventDefault();

    // Getting the data from the form
    const formData = new FormData(myForm);
    const payload = {
      email: formData.get('email'),
      password: formData.get('password')
    };

    // Convert payload to JSON string
    const data = JSON.stringify(payload);
    console.log("Payload to be sent:", data);

    // Send the payload to the login.php endpoint
    fetch('http://localhost:8080/php/login.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' // Note the capital 'C' and 'T'
      },
      body: data
    })
    .then(response => {
      console.log("Response status:", response.status);
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Network response was not ok.');
      }
    })
    .then(data => {
      console.log("Response data:", data);
      // Uncomment and adjust the following based on your response structure:
      if (data.success) {
        if (data.role === "Admin") {
          localStorage.setItem("token_admin", data.token);
          window.location.href = '../html/admin/dashboard.html';
        } else if (data.role === "User") {
          localStorage.setItem("token_user", data.token);
          alert("User Login Successful!!");
          window.location.href = '../html/index.html';
          console.log("to home!");
        }
      } else {
        alert(data.message);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  });
}