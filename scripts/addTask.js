let task;
let newTask = [];
let SelectedEmployee;
let SelectedEmployeeEmail;


async function loadData() {
    await downloadFromServer();
    employeePicker();
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
function employeePicker() {
    document.getElementById('NameFromEmployess').innerHTML = '';
    document.getElementById('NameFromEmployess').innerHTML = /*html*/`
        <option disabled selected value> -- select an employee -- </option>`;
    for (let i = 0; i < users.length; i++) {
        let user = decrypt('salt', users[i]['name']);
        document.getElementById('NameFromEmployess').innerHTML += /*html*/ `
            <option value="${user}">${user}</option>`;
    }
}


/**
 * 
 * @param {the name that is selected in the options} selectedEmployee 
 * @returns the decrypted name
 */
function getEmailAdress(selectedEmployee) {
    for (let i = 0; i < users.length; i++) {
        const user = users[i]['name'];
        if (decrypt('salt', user) == selectedEmployee) {
            return decrypt('salt', users[i]['email']);
        }
    }
}

/**
 * this function creates a new task with the specified information
 * 
 */
function createdTask() {
    getTaskData();
    document.getElementById('createdButton').disabled = true;
    addTask();
}


/**
 * get all the data from the input fields for the new task
 */
function getTaskData() {
    let selectedEmployee = document.getElementById('NameFromEmployess').value;
    let selectedEmployeeEmail = getEmailAdress(selectedEmployee);

    task = {
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
    };
    checkIfForbidenSign();
}


function checkIfForbidenSign() {
    if (task.title.includes('<') && task.title.includes('>')) {
        task.title = task.title.replaceAll('<', "&lt;");
        task.title = task.title.replaceAll('>', "&gt;");
    }
    if (task.description.includes('<') && task.description.includes('>')) {
        task.description = task.description.replaceAll('<', "&lt;");
        task.description = task.description.replaceAll('>', "&gt;");
    }
}


/**
 * This function is for better readability. It only executes the functions.
 * 
 */
async function addTask() {
    await taskPushToNewTask();
    blankForm();
    openBacklog();
}


/**
 * This function adds "task" to  "allTask".
 * 
 */
async function taskPushToNewTask() {
    newTask.push(task)
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