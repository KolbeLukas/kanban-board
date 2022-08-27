let newTask = [];
let SelectedEmployee;
let SelectedEmployeeEmail;


async function loadData() {
    await downloadFromServer();
    newTask = JSON.parse(backend.getItem('newTask')) || [];
    EmployeePicker();
}

function loadNewDate() {
    let date = document.getElementById('date');
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;
    date.value = today;
}


/**
 * This function creates all employees to assign the task to you.
 * 
 */
function EmployeePicker() {
    document.getElementById('NameFromEmployess').innerHTML = '';
    document.getElementById('NameFromEmployess').innerHTML = /*html*/`
        <option disabled selected value> -- select an employee -- </option>`;
    for (let i = 0; i < users.length; i++) {
        let user = decrypt('salt', users[i]['name']);
        document.getElementById('NameFromEmployess').innerHTML += /*html*/ `
            <option value="${user}">${user}</option>`;
    }
}


function stop(event) {
    event.stopPropagation();
    console.log('stop')
}


function getEmailAdress(selectedEmployee) {
    for (let i = 0; i < users.length; i++) {
        const user = users[i]['name'];
        if (decrypt('salt', user) == selectedEmployee){
            return decrypt('salt', users[i]['email']);
        }
    }
}

/**
 * this function creates a new task with the specified information
 * 
 */
async function createdTask() {
    let selectedEmployee = document.getElementById('NameFromEmployess').value;
    let selectedEmployeeEmail = getEmailAdress(selectedEmployee);
    let task = {
        'title': document.getElementById('title').value,
        'date': document.getElementById('date').value,
        'categorie': document.getElementById('categorie').value,
        'prio': document.getElementById('prio').value,
        'description': document.getElementById('description').value,
        'creator': currentUser[0]['name'],
        'creatorEmail': currentUser[0]['email'],
        'createdAt': new Date().getTime(),
        'state': 'todo',
        'SelectedEmployee': selectedEmployee,
        'SelectedEmployeeEmail': selectedEmployeeEmail
    }
    await addTask(task);
}


/**
 * This function is for better readability. It only executes the functions.
 * @param {*} task - Task is the task you just created.
 * 
 */
function addTask(task) {
    taskPushToNewTask(task);
    blankForm();
    openBacklog();
}


/**
 * This function adds "task" to  "allTask".
 * @param {string} task  - Task is the task you just created.
 * 
 */
async function taskPushToNewTask(task) {
    newTask.push(task);
    await backend.setItem('newTask', JSON.stringify(newTask));
}


/**
 * This function redirects you to the board.html after creating a new task.
 * 
 */
function openBacklog() {
    window.location.replace('backlog.html');
}


/**
 * This function empties the form after creating a new task.
 * 
 */
function blankForm() {
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
}