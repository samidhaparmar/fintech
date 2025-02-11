// register.js

const registrationForm = document.getElementById('registrationForm');

registrationForm.addEventListener('submit', (event) => {
  event.preventDefault();

  // Collect the form data
  const formData = new FormData(registrationForm);

  // Build the payload object using the new input names
  const payload = {
    first_name: formData.get('firstName'),
    last_name: formData.get('lastName'),
    phone_number: formData.get('phoneNumber'),
    dob: formData.get('dob'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirm_password: formData.get('confirmPassword'),
  };

  // Simple password match check
  if (payload.password !== payload.confirm_password) {
    alert('Passwords do not match!');
    return;
  }

  console.log('Registration payload:', payload);

  // Send the payload to register.php via POST
  fetch('../php/register.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.success) {
        alert(data.message);
        // Redirect to login or another page after successful registration
        window.location.href = 'login.html';
      } else {
        alert(data.message);
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('Registration failed, please try again.');
    });
});