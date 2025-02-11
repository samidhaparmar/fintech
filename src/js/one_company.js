document.addEventListener('DOMContentLoaded', function () {
    // Get all elements with class 'fe-box-brands'
    var categoryBoxes = document.querySelectorAll('.fe-box-brands');
  
    categoryBoxes.forEach(function (box) {
      box.addEventListener('click', async function () {
        // Extract the category name from the <h6> inside the box
        var categoryName = box.querySelector('h6').innerText;
        console.log("Selected Category:", categoryName);
  
        // Update the title element to show the selected category
        const titleEl = document.getElementById("title").getElementsByTagName("h2")[0];
        titleEl.innerText = categoryName + " Products";
  
        // Clear any previous product listings and details
        const productContainer = document.querySelector('.pro-container');
        productContainer.innerHTML = '';
        const detailsContainer = document.getElementById('product-details');
        detailsContainer.innerHTML = '';
  
        // Load products for this category
        await loadProductsForCategory(categoryName);
      });
    });
  });
  
  // Function to load products for a specific category from the backend
  function loadProductsForCategory(category) {
    const payload = { category: category };
    const data = JSON.stringify(payload);
  
    fetch('http://localhost:8080/php/one_company.php', {
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
      .then(data => {
        const container = document.querySelector('.pro-container');
        container.innerHTML = ''; // Clear container
  
        const products = data.data;
        console.log("products", products);
        if (products && products.length > 0) {
          products.forEach(product => {
            // Create a product card container
            const productCard = document.createElement('div');
            productCard.classList.add('pro', 'bg-white', 'rounded-lg', 'shadow', 'p-4', 'cursor-pointer');
  
            // Attach click event handler to load product details
            clickerProduct(productCard, product);
  
            // Create image element
            const productImage = document.createElement('img');
            productImage.src = 'data:image/jpeg;base64,' + product.image;
            productImage.alt = product.name || 'Image Not Available';
            productImage.classList.add('w-full', 'h-48', 'object-cover', 'rounded');
  
            // Create a container for the product name
            const descriptionContainer = document.createElement('div');
            descriptionContainer.classList.add('mt-4');
            const nameHeader = document.createElement('h5');
            nameHeader.classList.add('font-bold', 'text-xl');
            nameHeader.textContent = product.name;
            descriptionContainer.appendChild(nameHeader);
  
            // Assemble the product card
            productCard.appendChild(productImage);
            productCard.appendChild(descriptionContainer);
  
            // Append the product card to the main container
            container.appendChild(productCard);
          });
        } else {
          container.innerHTML = '<p class="text-center text-gray-500">No products available for this category.</p>';
        }
      })
      .catch(error => console.error('Error fetching products:', error));
  }
  
  // Function to attach a click event to each product card
  function clickerProduct(container, product) {
    container.addEventListener('click', function () {
      // Update the title to show the selected product name
      const titleEl = document.getElementById("title").getElementsByTagName("h2")[0];
      titleEl.innerText = product.product_name;
  
      // Clear the previous product details
      const detailsContainer = document.getElementById('product-details');
      detailsContainer.innerHTML = '';
  
      // Load the detailed information for the selected product
      loadProductDetails(product.id);
    });
  }