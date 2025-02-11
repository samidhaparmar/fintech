// main.js (or update_navbar.js)

document.addEventListener('DOMContentLoaded', () => {
    // Retrieve token from localStorage
    const token1 = localStorage.getItem("token_user");
    const payload = { token: token1 };
    const data = JSON.stringify(payload);
  
    // Function to update the navbar based on login status
    function updateNavigationBar(isLoggedIn) {
      const navbar = document.getElementById('navbar');
      if (!navbar) {
        console.error("Navbar element with id 'navbar' not found.");
        return;
      }
  
      // If the user is logged in, remove the public links (Register and Login)
      // and add new links (Profile, Cart, and Logout)
      if (isLoggedIn) {
        // Remove Register and Login links
        const registerLink = document.querySelector('a[href="register.html"]');
        const loginLink = document.querySelector('a[href="login.html"]');
        if (registerLink && registerLink.parentElement) {
          registerLink.parentElement.remove();
        }
        if (loginLink && loginLink.parentElement) {
          loginLink.parentElement.remove();
        }
  
        // Create new nav items for logged-in users
        const profileItem = document.createElement('li');
        profileItem.innerHTML = '<a href="profile.html" class="text-gray-700 hover:text-blue-600 transition">Profile</a>';
  
        const cartItem = document.createElement('li');
        cartItem.innerHTML = '<a href="cart.html" class="text-gray-700 hover:text-blue-600 transition">Cart</a>';
  
        const logoutItem = document.createElement('li');
        logoutItem.innerHTML = '<a href="#" id="logoutBtn" class="text-gray-700 hover:text-blue-600 transition">Logout</a>';
  
        // Append new nav items
        navbar.appendChild(profileItem);
        navbar.appendChild(cartItem);
        navbar.appendChild(logoutItem);
  
        // Attach logout event handler
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
          logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem("token_user");
            // Reload page to revert to public navbar
            window.location.href = '../html/index.html';
          });
        }
      }
      // Optionally, if not logged in, you could ensure that public links remain
    }
  
    // Make the POST request to check token validity
    fetch('http://localhost:8080/php/test_token.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
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
      .then(responseData => {
        console.log("Response data:", responseData);
        // If the backend indicates success, update the navbar accordingly.
        if (responseData.success) {
          updateNavigationBar(true);
          console.log("nav updated");
        } else {
          updateNavigationBar(false);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        // In case of error, default to not logged in
        updateNavigationBar(false);
      });
  });

  document.addEventListener('DOMContentLoaded', () => {
    // Extract the current file name from the URL, stripping any query string
    let currentFile = window.location.pathname.split('/').pop();
    currentFile = currentFile.split('?')[0] || "index.html";
    console.log("Current file:", currentFile);
  
    // Select all nav links within the navbar (ensure your nav <ul> has id="navbar")
    const navLinks = document.querySelectorAll('#navbar a');
  
    navLinks.forEach(link => {
      // Get the href attribute from the link
      const linkPath = link.getAttribute('href').split('?')[0]; // remove any query strings
      console.log("Link path:", linkPath);
  
      // If the link's href exactly matches the current file, mark it as active
      if (linkPath === currentFile) {
        link.classList.add('text-blue-600', 'font-semibold');
      } else {
        link.classList.remove('text-blue-600', 'font-semibold');
      }
    });
  });