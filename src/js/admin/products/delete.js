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
        "product" : formData.get('product'),
        "category" : formData.get('category')
    };
    //converting array to jason object
    var data = JSON.stringify(arrayData);

    fetch('http://localhost:8080/php/admin/products/delete.php', {
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : data
    })
    .then(response => {
        console.log(response.status);

        if(response.ok){
            return response.json();
        }else{
            throw new Error('Network response was not ok.');
        }
    })
    .then(data => {
        // Log the parsed JSON response
        console.log(data);
        // Check if registration was successful
        if (data.success) {
            // Redirect to the login page
            alert("User Deleted Successfuly!!!!!");
            window.location.href = '../../../html/admin/users/delete.html';
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});



