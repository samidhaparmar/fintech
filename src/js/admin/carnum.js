const token1 = localStorage.getItem("token_admin");
const arrayData = {
    "token" : token1,
};
//converting array to JSON object
var data = JSON.stringify(arrayData);

fetch('http://localhost:8080/php/admin/carnum.php', {
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
    carnum = data.data;
    console.log(data.message);
    console.log(carnum);
    if(carnum != 'no data'){
        const container = document.getElementById('carnum');
        container.innerText = carnum;
    }
})
.catch(error => console.error('Error fetching data:', error));



