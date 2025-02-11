const token2 = localStorage.getItem("token_admin");
const Data = {
    "token" : token2,
};
//converting array to JSON object
var jsondata = JSON.stringify(Data);

fetch('http://localhost:8080/php/admin/all_orders.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: jsondata
})
.then(response => {
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
})
.then(data => {
    console.log(data);
    const table = document.getElementById('recent_orders');

    users = data.data;
    users.forEach(user => {
        const userContainer = document.createElement('tr');

        const cont = document.createElement('td');
        const name = document.createElement('p');
        name.textContent = user.name + " " + user.surname;
        cont.appendChild(name);
        userContainer.appendChild(cont);

        const model = document.createElement('td');
        model.innerText = user.model;
        userContainer.appendChild(model);

        table.appendChild(userContainer);
    });
})
.catch(error => console.error('Error fetching data:', error));



fetch('http://localhost:8080/php/admin/order_num.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: jsondata
})
.then(response => {
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
})
.then(data => {
    order_num = data.data;
    console.log(data.message);
    console.log(order_num);
    if(order_num != 'no data'){
        const container = document.getElementById('order_num');
        container.innerText = order_num;
    }
})
.catch(error => console.error('Error fetching data:', error));