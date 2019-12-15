const page = document.querySelector('main');
const userSearch = document.querySelector('#user-search');
const usersUrl = 'https://randomuser.me/api/?results=12&nat=us,gb';
let focusBox = document.createElement('div');
let employees = {};
console.log(userSearch.value)
fetchData(usersUrl)
.then(generateHTML(JSON.parse(localStorage.employees)))
.then(filterEmployees(JSON.parse(localStorage.employees)))
.then(allowFocus(JSON.parse(localStorage.employees)))

//Functions
function fetchData(url){
    return fetch(url)
        .then(checkStatus)
        .then(res => res.json())
        .then(data => {
            localStorage.employees = JSON.stringify(data.results);
            employees = JSON.parse(localStorage.employees);
            // return data;
        })
        // .then(data=> console.log(data.results))
        .catch(err => console.error('The following problem occurred: ', err));
}

function checkStatus(response) {
    if (response.ok) {
        return Promise.resolve(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}

function generateHTML(data) {
    let pageCards = "";
    data.map((employee, i ) => {
        pageCards +=
        `
        <div class = "card ${i}"id = "${employee.name.first} ${employee.name.last}" >
            <img src=${employee.picture.medium}>
            <div >
                <h2 id="card-name">${employee.name.first} ${employee.name.last}</h2>
                <p>${employee.email}</p>
                <p>${employee.location.city}</p>
            </div>
        </div>
        `;
    });
    page.innerHTML = pageCards;
    return data;
}

function allowFocus(data){
    if (userSearch.value.length == 0 ){
        data.forEach(employee => employee.inLoop = true);
        localStorage.employees = JSON.stringify(employees);
    }
    var employee;
    var focusIndex;
    document.addEventListener('click', (e)=>{
        
        if (e.target.className.includes('card') && !e.target.className.includes('blurred')){
            focusIndex = e.target.className.slice(-2);
            focusIndex = focusIndex.replace(/ /g, '');
            // console.log(focusIndex);
            employee = data[focusIndex];
            fillBox(employee);
            document.querySelectorAll('.card').forEach(card => card.classList.add('blurred'));
            page.classList.add('blurred');

        } else if (e.target.id == 'previous'){
            if (page.className.includes('fresh')){
                removeFocus();
            } else 
            do {
                removeFocus();
            }
            while (!JSON.parse(localStorage.employees)[focusIndex].inLoop);
            console.log(data[focusIndex].inLoop)
            page.removeChild(focusBox);
            fillBox(data[focusIndex]);
        } else if (e.target.id == 'next') {
            console.log(JSON.parse(localStorage.employees)[focusIndex]);
            if (page.className.includes('fresh')) {
                addFocus();
            } else
            do {
                addFocus();
            }
            while (!JSON.parse(localStorage.employees)[focusIndex].inLoop);
            page.removeChild(focusBox);
            fillBox(data[focusIndex]);
        } else if (e.target.id === "close-button" || e.target.className.includes("blurred")) {
            removeBox();
            document.querySelectorAll('.card').forEach(card => card.classList.remove('blurred'));
            page.classList.remove('blurred');
        }

        function addFocus() {
            focusIndex++;
            if (focusIndex == data.length) {
                focusIndex = 0;
            }
            
        }
        function removeFocus(){
            focusIndex--;
            if (focusIndex < 0) {
                focusIndex = data.length - 1;
            }
        }


    });
}


function fillBox(employee) {
    let birthday = employee.dob.date;
    birthday = convertBirthday(birthday);
    // console.log(birthday);
    
    focusBox.className = 'focussed';
    focusBox.innerHTML = `
            <button id="close-button">&#x2716;</button>
            <div class="img-holder">
                <button id="previous"><</button>    
                <img src=${employee.picture.medium}>
                <button id="next">></button>
            </div>
            <div>
                <h2>${employee.name.first} ${employee.name.last}</h2>
                <p>${employee.email}</p>
                <p>${employee.location.city}</p>
            </div>
            <div>
                <p>${employee.cell}</p>
                <p>${employee.location.street.number} ${employee.location.street.name} ${employee.location.city}, ${employee.location.state} ${employee.location.postcode}</p>
                <p>Birthday: ${birthday}</p>
            </div>
                `;
    page.appendChild(focusBox);
}

function convertBirthday(oldDate){
    let yr = oldDate.slice(2, 4);
    let mth = oldDate.slice(5, 7);
    let dy = oldDate.slice(8, 10);
    let newDate =  mth+"/"+dy+"/"+yr;
    return newDate;
}

function removeBox(){
    page.removeChild(focusBox);
}
 



//Event Listeners


function filterEmployees(data){
    userSearch.addEventListener('keyup', ()=>{
        page.classList.remove('fresh');
        document.querySelectorAll('.card').forEach(card => card.classList.remove('hideMe'));
        console.log(userSearch.value);
        let employees = data;
        employees.forEach(employee => employee.inLoop = true);
        localStorage.employees = JSON.stringify(employees);
        let search = userSearch.value.toUpperCase();
        document.querySelectorAll('.card').forEach(card => {
            if (card.id.toUpperCase().indexOf(search) == -1) {
                let i = card.className.slice(-2).replace(/ /g, '');
                card.classList.add('hideMe');
                
                employees[i].inLoop = false;
            } return employees;
        });
        localStorage.employees = JSON.stringify(employees);
    });
}   