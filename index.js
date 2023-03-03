let table = document.createElement("table");
let tableDiv = document.createElement("div");
tableDiv.className = "table-div"
table.className = "table";
let tBody = document.createElement("tbody");
tBody.className = "tbody";
table.appendChild(tBody);
let submitButton = document.getElementById("submitButton");
let updateButton = document.getElementById("updateButton");
let empHeader = {
    id: "ID", firstName: "FIRST NAME", lastName: "LAST NAME", technology: "TECHNOLOGY"
}

//create THead 
let tHead = document.createElement("thead");
tHead.className = "thead";
table.appendChild(tHead);
let headRow = document.createElement("tr");
tHead.appendChild(headRow);
for (const key in empHeader) {
    let th = document.createElement('th');
    let thText = document.createTextNode(empHeader[key]);
    th.appendChild(thText);
    headRow.appendChild(th);
}
let action = document.createElement('th');
let actionText = document.createTextNode('ACTION');
action.appendChild(actionText);
headRow.appendChild(action);


//send data on server
function sendData() {
    let fname = document.getElementById("firstName").value;
    let lname = document.getElementById("lastName").value;
    let technology = document.getElementById("technology").value;

    let request = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            firstName: fname,
            lastName: lname,
            technology: technology,
        }),
    };
    fetch('http://localhost:3000/employee', request)
        .catch(error => console.error(error));
}

//Get data form server
function getData() {
    tBody.innerHTML = " ";
    fetch('http://localhost:3000/employee')
        .then(response => response.json())
        .then(data => {
            // //TBody
            for (const iterator of data) {
                let bodyRow = document.createElement("tr");
                tBody.appendChild(bodyRow);
                for (const key in empHeader) {
                    let td = document.createElement('td');
                    let thText = document.createTextNode(iterator[key]);
                    td.appendChild(thText);
                    bodyRow.appendChild(td);
                }
                let td = document.createElement('td');
                let deleteButton = document.createElement('button');
                let deleteText = document.createTextNode('Delete');
                deleteButton.appendChild(deleteText);
                deleteButton.className = "deleteButton";
                deleteButton.addEventListener("click", (event) => {
                    event.preventDefault();
                    deleteEmpolyee(iterator.id);
                    table.deleteRow(bodyRow.rowIndex);
                });
                td.appendChild(deleteButton);

                let editButton = document.createElement('button');
                let editText = document.createTextNode('Edit');
                editButton.appendChild(editText);
                editButton.className = "editButton";
                editButton.addEventListener("click", (event) => {
                    event.preventDefault();
                    editEmployee(iterator)
                }
                )
                td.appendChild(editButton);
                bodyRow.appendChild(td);
            }
        }).catch(error => console.error(error));

}


//To Delete Employee
function deleteEmpolyee(id) {
    fetch(`http://localhost:3000/employee/${id}`, { method: 'DELETE' })
        .catch(error => console.error(error));
}

//To Update Employee
function editEmployee(empData) {
    let firstName = document.getElementById('firstName');
    let lastName = document.getElementById('lastName');
    let technology = document.getElementById('technology');

    firstName.value = empData.firstName;
    lastName.value = empData.lastName;
    technology.value = empData.technology;

    updateButton.removeAttribute("disabled");
    submitButton.setAttribute("disabled", "disabled");

    updateButton.addEventListener('click', (e) => {
        e.preventDefault();
        let updatedEmpData = {
            firstName: firstName.value,
            lastName: lastName.value,
            technology: technology.value,
        };
        fetch(`http://localhost:3000/employee/${empData.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedEmpData)
        }).catch(error => console.error(error));
        getData();
    });
}

submitButton.addEventListener("click", (e) => {
    e.preventDefault();
    sendData();
    getData();
})

window.addEventListener('load', (event) => {
    event.preventDefault();
    getData();
});



//for filter
 function populateTable() {
        // Clear the existing table rows

        tBody.innerHTML = " ";
        // Get the current filter value
        const filterValue = filterSelect.value;
        console.log(filterValue);

        // Fetch the JSON data from JSON-Server using the Fetch API
        fetch('http://localhost:3000/employee')
            .then(response => response.json())
            .then(data => {

                // let newdata = filterValue === 'all' ? data : data.filter(item => item.technology == filterValue)
                for (const iterator of data) {
                    if (filterValue === 'all' || iterator.technology === filterValue) {
                        let bodyRow = document.createElement("tr");
                        tBody.appendChild(bodyRow);
                        for (const key in empHeader) {
                            let td = document.createElement('td');
                            let thText = document.createTextNode(iterator[key]);
                            td.appendChild(thText);
                            bodyRow.appendChild(td);
                        }
                        let td = document.createElement('td');
                        let deleteButton = document.createElement('button');
                        let deleteText = document.createTextNode('Delete');
                        deleteButton.appendChild(deleteText);
                        deleteButton.className = "deleteButton";
                        deleteButton.addEventListener('click', () => {
                            deleteEmpolyee(iterator.id);
                            table.deleteRow(bodyRow.rowIndex);
                        });
                        td.appendChild(deleteButton);

                        let editButton = document.createElement('button');
                        let editText = document.createTextNode('Edit');
                        editButton.appendChild(editText);
                        editButton.className = "editButton";
                        editButton.addEventListener('click', () => {
                            editEmployee(iterator);
                        });
                        td.appendChild(editButton);
                        bodyRow.appendChild(td);
                    }
                }
            })
            .catch(error => {
                console.error('Error fetching JSON data:', error);
            });
    }

//add optiins to filter dropdown
    function addOptions() {

        fetch('http://localhost:3000/employee')
            .then(response => response.json())
            .then(data => {
                let newData = data.map(item => item.technology);
                let newSet = new Set(newData);
                let a = [...newSet];
                console.log(a);
                a.forEach(element => {
                    let option = document.createElement("option");
                    let text = document.createTextNode(element);
                    option.appendChild(text);
                    filterSelect.appendChild(option)
                });
            })
    }
    window.addEventListener('load', () => {
        populateTable();
        addOptions();
    })

// Add on change
    filterSelect.addEventListener('change',
        (e) => {
            // e.preventDefault(),
            populateTable()
        })

let body = document.querySelector("body");
let container = document.querySelector(".container");
tableDiv.appendChild(table);
container.appendChild(tableDiv);
