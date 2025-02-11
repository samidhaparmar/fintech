
// Function to handle logout
function logout() {
    const token1 = localStorage.getItem("token_user");
    const arrayData = {
        "token" : token1,
    };
    //converting array to JSON object
    var data = JSON.stringify(arrayData);

    fetch('http://localhost:8080/php/log_out.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: data,
    })
    .then(response => {
        if (response.ok) {
            return response.json(); // assuming the server responds with JSON
        } else {
            throw new Error('Logout request failed.');
        }
    })
    .then(data => {
        if (data.success === true) {
            // Clear the token from local storage
            localStorage.setItem("token_user", data.token);
            // Redirect to the login page or any other page you prefer
            console.log("Logout successful");
            window.location.href = '../html/index.html';
        } else {
            alert("Logout failed!");
        }
    })
    .catch(error => console.error('Error during logout:', error));
}
