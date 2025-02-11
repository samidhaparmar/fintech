document.addEventListener('DOMContentLoaded', () => {
  loadCart();
});

const token = localStorage.getItem("token_user");
const cartPayload = { token: token };
const cartData = JSON.stringify(cartPayload);

function loadCart() {
  fetch('http://localhost:8080/php/cart.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: cartData
  })
  .then(response => {
    if (!response.ok) {
      throw new Error("HTTP error! Status: " + response.status);
    }
    return response.json();
  })
  .then(data => {
    console.log("data", data.data);
    // Get the <tbody> element in the table
    const tableBody = document.getElementById('cartTableBody');
    tableBody.innerHTML = ''; // Clear any previous rows

    const products = data.data;
    let total = 0;
    if (products && products.length > 0) {
      products.forEach(product => {
        const tr = document.createElement('tr');

        // --- Product Name Column ---
        const productTd = document.createElement('td');
        productTd.classList.add('border', 'px-4', 'py-2');
        // Use product.product_name or product.name (depending on your backend)
        productTd.textContent = product.product_name || product.name;
        tr.appendChild(productTd);

        // --- Category Column ---
        const categoryTd = document.createElement('td');
        categoryTd.classList.add('border', 'px-4', 'py-2');
        categoryTd.textContent = product.category; 
        tr.appendChild(categoryTd);

        // --- Rate/Info Column ---
        const infoTd = document.createElement('td');
        infoTd.classList.add('border', 'px-4', 'py-2');
        let infoText = "";
        if (product.itr) {
          infoText += "Interest Rate: " + product.itr + "%";
        }
        if (product.fee) {
          if (infoText !== "") infoText += " | ";
          infoText += "Fee: $" + product.fee;
        }
        infoTd.textContent = infoText;
        tr.appendChild(infoTd);

        const actionsTd = document.createElement('td');
        actionsTd.classList.add('border', 'px-4', 'py-2');

        // Remove Button
        const removeBtn = document.createElement('button');
        removeBtn.classList.add('bg-red-500', 'text-white', 'px-2', 'py-1', 'rounded', 'mr-2');
        removeBtn.textContent = "Remove";
        removeBtn.addEventListener('click', function() {
          deleteFromCart(product.id);
        });
        actionsTd.appendChild(removeBtn);

        // Buy Button
        const buyBtn = document.createElement('button');
        buyBtn.classList.add('bg-green-500', 'text-white', 'px-2', 'py-1', 'rounded');
        buyBtn.textContent = "Buy";
        buyBtn.addEventListener('click', function() {
          proceedToCheckout(product.id);
        });
        actionsTd.appendChild(buyBtn);

        tr.appendChild(actionsTd);

        tableBody.appendChild(tr);

        // Sum up total price if product has a price field
        if (product.price) {
          total += parseFloat(product.price);
        }
      });

      // Update total price display if an element with id "total" exists
      const totalEl = document.getElementById('total');
      if (totalEl) {
        totalEl.textContent = "$ " + total.toFixed(2);
      }
    } else {
      tableBody.innerHTML = '<tr><td colspan="4" class="border px-4 py-2 text-center text-gray-500">No products in cart.</td></tr>';
    }
  })
  .catch(error => console.error('Error fetching cart data:', error));
}

function deleteFromCart(productId) {
  const payload_delete = {
    product_id: productId,
    token: token
  };
  const data_delete = JSON.stringify(payload_delete);
  console.log("dlete", data_delete);

  fetch('http://localhost:8080/php/delete_from_cart.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: data_delete
  })
  .then(response => {
    console.log("Delete response status:", response.status);
    if (!response.ok) {
      throw new Error("Network response was not ok. Status: " + response.status);
    }
    return response.json();
  })
  .then(result => {
    console.log(result);
    if (result.success) {
      alert(result.message);
      // Reload the cart data after deletion
      loadCart();
    } else if (result.reason === "token") {
      alert("Login required to manage cart.");
      window.location.href = '../html/login.html';
    } else {
      alert(result.message);
    }
  })
  .catch(error => {
    console.error('Error deleting from cart:', error);
  });
}

function proceedToCheckout(productId) {
  const payload = {
    product_id: productId,
    token: token
  };
  const data = JSON.stringify(payload);
  console.log("dlete", data);

  fetch('http://localhost:8080/php/check_out.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: data
  })
  .then(response => {
    if (!response.ok) {
      throw new Error("HTTP error! Status: " + response.status);
    }
    return response.json();
  })
  .then(data => {
    console.log("Checkout response:", data);
    if (data.success) {
      alert(data.message);
      window.location.href = '../html/index.html';
    } else {
      alert(data.message);
    }
  })
  .catch(error => {
    console.error('Error during checkout:', error);
  });
}