// myaccount.js

document.addEventListener('DOMContentLoaded', () => {
    loadUserInfo();
  });
  
  function loadUserInfo() {
    // Example: fetch user data from an endpoint
    // e.g., GET /api/user/me
    // For now, let's do a placeholder
    console.log('Fetching user data...');
  
    // fetch('/api/user/me', { credentials: 'include' })
    //   .then(res => res.json())
    //   .then(data => renderUserInfo(data))
    //   .catch(err => console.error(err));
  
    // Placeholder data
    const fakeUser = {
      first_name: 'Samidha',
      last_name: 'Parmar',
      email: 'samidha@example.com',
      photoUrl: '' // if you had a stored user photo
    };
  
    renderUserInfo(fakeUser);
  }
  
  function renderUserInfo(user) {
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    const userPhoto = document.getElementById('userPhoto');
  
    userName.textContent = `${user.first_name} ${user.last_name}`;
    userEmail.textContent = user.email;
    
    if (user.photoUrl) {
      userPhoto.src = user.photoUrl;
    }
  }


