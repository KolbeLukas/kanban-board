let tasksBacklog = [];
let tasksBoard = [];

/**
 * load data from backend.
 * 
 */
async function loadBacklog() {
    await downloadFromServer();
    tasksBacklog = JSON.parse(backend.getItem('newTask')) || [];
    tasksBoard = JSON.parse(backend.getItem('tasksBoard')) || [];
    loadTaskToBacklog();
}

/**
 * loads data from each single task and renders a single box for each.
 * 
 */
function loadTaskToBacklog() {
    let backlog = document.getElementById('bl-content');
    backlog.innerHTML = '';
    if (tasksBacklog.length > 0) {
        tasksBacklog.forEach((task, i) => {
            backlog.innerHTML += renderBacklogTask(task, i);
            setCategoryColor(task, i);
        });
    } else {
        backlog.innerHTML = renderEmptyBacklog();

    }
}


/**
 * sets the color from the task at the left side of the box.
 * @param {data from one added task} task 
 * @param {index from a single task} i 
 *
 */
function setCategoryColor(task, i) {
    background = document.getElementById(`bl-category${i}`);
    if (task.categorie == 'Product') {
        background.classList.add('Product')
    }
    if (task.categorie == 'Marketing') {
        background.classList.add('Marketing')
    }
    if (task.categorie == 'Sale') {
        background.classList.add('Sale')
    }
}

/**
 * adds the task from the backlog to the board
 * @param {index of the task} i 
 * 
 */
async function addTaskToBoard(i) {
    tasksBoard.push(tasksBacklog[i]);
    await backend.setItem('tasksBoard', JSON.stringify(tasksBoard));
    tasksBacklog.splice(i, 1);
    await backend.setItem('newTask', JSON.stringify(tasksBacklog));
    loadTaskToBacklog();
}


/**
 * renders all task with all current parameters
 * @param {data from one added task} task 
 * @param {index from a single task} i 
 * @returns html code
 * 
 */
function renderBacklogTask(task, i) {
    return /*html*/ `
    <div id="bl-category${i}" class="bl-task-box">
        <div class="content-bg d-flex flex-row card border-0 mb-3 px-2 py-3 rounded-end rounded-0">
            <div class="row g-0" style="width: 99%">
                <div class="col-md-4 bl-w-50 d-flex align-items-center">
                    <div class="d-flex align-items-center bl-w-75">
                        <div class="d-flex flex-column w-100">
                            <span>${task.SelectedEmployee}</span>
                            <a class="overflow-hidden text-nowrap text-overflow" href="mailto:${task.SelectedEmployeeEmail}">${task.SelectedEmployeeEmail}</a>
                        </div>
                    </div>
                    <div class="d-flex justify-content-center bl-w-25">
                        <span>${task.categorie}</span>
                    </div>
                </div>
                <div class="col-md-8 bl-w-50 rs-mt pl">
                    <span>${task.description}</span>
                </div>
            </div>
            <button onclick="addTaskToBoard(${i})" class="btn btn-primary">+</button>
        </div>
    </div>`;
}

function renderEmptyBacklog() {
    return /*html*/`
    <div class="d-flex justify-content-center align-items-center w-100 h-50">
        <span class="fs-2">There are no open Tasks!</span>
    </div>`;
}