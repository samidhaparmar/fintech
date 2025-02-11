const token2 = localStorage.getItem("token_admin");
const Data = {
    "token" : token2,
};
//converting array to JSON object
var jsondata = JSON.stringify(Data);

fetch('http://localhost:8080/php/admin/recent_user.php', {
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
    const table = document.getElementById('recent_user');

    users = data.data;
    users.forEach(user => {
        const userContainer = document.createElement('tr');

        const cont = document.createElement('td');
        const name = document.createElement('p');
        name.textContent = user.name + " " + user.surname;
        cont.appendChild(name);
        userContainer.appendChild(cont);

        const date = document.createElement('td');
        date.innerText = user.register_date;
        userContainer.appendChild(date);
        table.appendChild(userContainer);
    });
})
.catch(error => console.error('Error fetching data:', error));