fetch('http://localhost:8080/php/admin/car/creditcard.php', {
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
    ferrari = data.data;
    console.log(data.message);
    console.log(ferrari);
    if(carnum != 'no data'){
        const ferraricontainer = document.getElementById('ferrari');
        ferraricontainer.innerText = ferrari;
    }
})
.catch(error => console.error('Error fetching data:', error));


fetch('http://localhost:8080/php/admin/car/loan.php', {
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
    lamborghini = data.data;
    console.log(data.message);
    console.log(lamborghini);
    if(carnum != 'no data'){
        const lambocontainer = document.getElementById('lamborghini');
        lambocontainer.innerText = lamborghini;
    }
})
.catch(error => console.error('Error fetching data:', error));


fetch('http://localhost:8080/php/admin/car/insurance.php', {
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
    maserati = data.data;
    console.log(data.message);
    console.log(maserati);
    if(carnum != 'no data'){
        const maseraticontainer = document.getElementById('maserati');
        maseraticontainer.innerText = maserati;
    }
})
.catch(error => console.error('Error fetching data:', error));

fetch('http://localhost:8080/php/admin/car/invest.php', {
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
    mclaren = data.data;
    console.log(data.message);
    console.log(mclaren);
    if(carnum != 'no data'){
        const mccontainer = document.getElementById('mclaren');
        mccontainer.innerText = mclaren;
    }
})
.catch(error => console.error('Error fetching data:', error));

