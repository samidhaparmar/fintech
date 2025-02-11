const token = localStorage.getItem("token_admin");
const cartArrayData = {
    "token" : token,
};
//converting array to JSON object
var data = JSON.stringify(cartArrayData);

fetch('http://localhost:8080/php/admin/usernum.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
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
    usernum = data.data;
    console.log(data.message);
    console.log(usernum);
    if(usernum != 'no data'){
        const container = document.getElementById('usernum');
        container.innerText = usernum;
    }
})
.catch(error => console.error('Error fetching data:', error));



