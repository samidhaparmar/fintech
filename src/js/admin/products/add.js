const myForm = document.querySelector('.form');
const token1 = localStorage.getItem("token_admin");
console.log(token1);

myForm.addEventListener('submit', event =>{
    //to prevent default event of refrecing page while submitting the form
    event.preventDefault();
    //now getting the data from the form
    const formData = new FormData(myForm);
    const arrayData = {
        "token" : token1,
        "product" : formData.get('pr'),
        "category" : formData.get('category'),
        "itr" : formData.get('itr'),
        "fee" : formData.get('fee'),
        "eligibility" : formData.get('el'),
        "description" : formData.get('des'),
        "benefits" : formData.get('be'),
    };
    //converting array to jason object
    var data = JSON.stringify(arrayData);

    console.log('product data', data);

    fetch('http://localhost:8080/php/admin/products/add.php', {
        method : 'POST',
        headers : {
            'content-Type' : 'application/json'
        },
        body : data
    })
    .then(response => {
        console.log(response.status); // Log the status code
        return response.json(); // or response.json() if you want to see the entire response
    })
    .then(data => {
        console.log(data);
        // Log the parsed JSON response
        console.log(data);

        // Check if registration was successful
        if (data.success) {
            // Redirect to the login page
            alert("Product Added Successfuly!!!!!");
            window.location.href = '../../../html/admin/products/add.html';
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});



