// This function is called when a product card is clicked.
function loadProductDetails(productId) {
    const payload = { id: productId };
    const data = JSON.stringify(payload);
  
    fetch('http://localhost:8080/php/product_detail.php', {
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
    .then(responseData => {
      // Open the modal by removing the 'hidden' class from the modal container.
      const modal = document.getElementById('productModal');
      modal.classList.remove('hidden');
  
      const modalContent = document.getElementById('modalContent');
      modalContent.innerHTML = ''; // Clear previous details
  
      // Expected response format:
      // { success: true, data: [ { product_name, description, image, interest_rate, annual_fee, eligibility, benefits, id } ] }
      if (responseData.success && responseData.data && responseData.data.length > 0) {
        const product = responseData.data[0];
  
        // Create and append the product image.
        const productImage = document.createElement('img');
        // If the image is base64 encoded, you may need: 'data:image/jpeg;base64,' + product.image
        productImage.src = 'data:image/jpeg;base64,' + product.image;
        productImage.alt = product.name || 'Image Not Available';
        // Adjust height (here h-64) as desired.
        productImage.classList.add('w-full', 'h-64', 'object-cover', 'rounded-lg', 'shadow');
        modalContent.appendChild(productImage);
  
        // Create headline container for product name and interest rate/fee.
        const headlineDiv = document.createElement('div');
        headlineDiv.classList.add('mt-4', 'flex', 'justify-between', 'items-center');
  
        const nameHeader = document.createElement('h2');
        nameHeader.classList.add('text-2xl', 'font-bold');
        // Use your field name ("product_name" or "name")
        nameHeader.textContent = product.name || product.name;
        headlineDiv.appendChild(nameHeader);
  
        const rateDiv = document.createElement('div');
        rateDiv.classList.add('text-xl', 'font-semibold', 'text-blue-600');
        // Show interest rate if available; otherwise, show fee.
        rateDiv.textContent = product.itr ? product.itr : product.fee;
        headlineDiv.appendChild(rateDiv);
        modalContent.appendChild(headlineDiv);
  
        // Create a description container.
        const descDiv = document.createElement('div');
        descDiv.classList.add('mt-4');
        const descPara = document.createElement('p');
        descPara.textContent = product.description;
        descDiv.appendChild(descPara);
        modalContent.appendChild(descDiv);
  
        // Additional details container (optional)
        const extraDiv = document.createElement('div');
        extraDiv.classList.add('mt-4', 'grid', 'grid-cols-1', 'gap-2');
        if (product.eligibility) {
          const eligibilityPara = document.createElement('p');
          eligibilityPara.innerHTML = `<strong>Eligibility:</strong> ${product.eligibility}`;
          extraDiv.appendChild(eligibilityPara);
        }
        if (product.benefits) {
          const benefitsPara = document.createElement('p');
          benefitsPara.innerHTML = `<strong>Benefits:</strong> ${product.benefits}`;
          extraDiv.appendChild(benefitsPara);
        }
        modalContent.appendChild(extraDiv);
  
        // Create "Add to Cart" button.
        const addToCartBtn = document.createElement('button');
        addToCartBtn.innerText = 'Add to Cart';
        addToCartBtn.classList.add('mt-4', 'bg-green-600', 'text-white', 'px-4', 'py-2', 'rounded', 'hover:bg-green-700', 'transition');
        addToCartBtn.addEventListener('click', () => {
          addToCart(product.id);
        });
        modalContent.appendChild(addToCartBtn);
      } else {
        modalContent.innerHTML =
          '<p class="text-center text-gray-500">No product details available.</p>';
      }
    })
    .catch(error => {
      console.error('Error fetching product details:', error);
      const modalContent = document.getElementById('modalContent');
      modalContent.innerHTML =
        '<p class="text-center text-red-500">Error loading product details.</p>';
    });
  }
  
  // Function to add product to cart
  function addToCart(productId) {
    // Retrieve token from localStorage (assumes token is stored as "token_user")
    var token = localStorage.getItem("token_user");
    var payload = { token: token, id: productId };
    var data = JSON.stringify(payload);
  
    fetch('http://localhost:8080/php/add_to_cart.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: data
    })
    .then(function(response) {
      console.log("Add to Cart response status:", response.status);
      // Instead of directly calling response.json(), get the text response
      return response.text();
    })
    .then(function(text) {
      console.log("Raw response text:", text);
      try {
        var result = JSON.parse(text);
        console.log("Parsed JSON result:", result);
        if (result.success) {
          alert(result.message);
        } else {
          alert(result.message);
        }
      } catch (err) {
        console.error("Error parsing JSON:", err);
        alert("Error processing server response.");
      }
    })
    .catch(function(error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart. Please try again.');
    });
  }