document.addEventListener('DOMContentLoaded', () => {
  // Retrieve token from localStorage (this token should be set upon login)
  const token = localStorage.getItem("token_user");
  const payload = { token: token };
  const data = JSON.stringify(payload);

  // Fetch profile details from your backend PHP endpoint
  fetch('http://localhost:8080/php/profile.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: data
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(profile => {
    console.log("profile", profile);
    profile = profile.data;
    // Expected profile object keys: first_name, last_name, email, phone_number, dob
    const container = document.getElementById('profileDetails');
    container.innerHTML = `
      <div class="text-center">
        <h2 class="text-2xl font-bold mb-2">${profile.first_name} ${profile.last_name}</h2>
        <p class="text-gray-600 mb-2"><strong>Email:</strong> ${profile.email}</p>
        <p class="text-gray-600 mb-2"><strong>Phone:</strong> ${profile.phone_number}</p>
        <p class="text-gray-600 mb-2"><strong>Date of Birth:</strong> ${profile.dob}</p>
      </div>
    `;
  })
  .catch(error => {
    console.error('Error fetching profile:', error);
    const container = document.getElementById('profileDetails');
    container.innerHTML = `<p class="text-center text-red-500">Error loading profile details.</p>`;
  });
});