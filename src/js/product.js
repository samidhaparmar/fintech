document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
  
    // Attach modal close functionality
    const modalClose = document.getElementById('modalClose');
    modalClose.addEventListener('click', closeModal);
    
    // Also close modal when clicking outside the modal content
    document.getElementById('productModal').addEventListener('click', (e) => {
      if(e.target.id === 'productModal'){
        closeModal();
      }
    });
  });
  
  function fetchProducts() {
    fetch('http://localhost:8080/php/products.php')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        const container = document.querySelector('.pro-container');
        container.innerHTML = ''; // Clear container
  
        // Expected data structure: { data: [ { id, product_name, image, ... }, ... ] }
        const products = data.data;
        if (products && products.length > 0) {
          products.forEach(product => {
            // Create a product card
            const productCard = document.createElement('div');
            productCard.classList.add('pro', 'bg-white', 'rounded-lg', 'shadow', 'p-4', 'cursor-pointer');
  
            // Instead of redirecting, open the modal with product details
            productCard.addEventListener('click', () => {
              openProductModal(product.id);
            });
  
            // Create image element
            const productImage = document.createElement('img');
            productImage.src = 'data:image/jpeg;base64,' + product.image; 
            productImage.alt = product.product_name || 'Image Not Available';
            productImage.classList.add('w-full', 'h-48', 'object-cover', 'rounded');
  
            // Create a container for the product name
            const descriptionContainer = document.createElement('div');
            descriptionContainer.classList.add('mt-4');
            const nameHeader = document.createElement('h5');
            nameHeader.classList.add('font-bold', 'text-xl');
            nameHeader.textContent = product.product_name || product.name;
            descriptionContainer.appendChild(nameHeader);
  
            // Assemble the product card
            productCard.appendChild(productImage);
            productCard.appendChild(descriptionContainer);
  
            // Append the product card to the main container
            container.appendChild(productCard);
          });
        } else {
          container.innerHTML = '<p class="text-center text-gray-500">No products available.</p>';
        }
      })
      .catch(error => console.error('Error fetching products:', error));
  }
  
  // Function to open the modal and load product details
  function openProductModal(productId) {
    // Display the modal
    const modal = document.getElementById('productModal');
    modal.classList.remove('hidden');
  
    // Load the product details into the modal content
    loadProductDetails(productId);
  }
  
  // Function to close the modal
  function closeModal() {
    const modal = document.getElementById('productModal');
    modal.classList.add('hidden');
    // Optionally, clear the modal content:
    document.getElementById('modalContent').innerHTML = '';
  }