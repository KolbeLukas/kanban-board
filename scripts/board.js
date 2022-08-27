setURL('https://gruppe-289.developerakademie.net/Join/smallest_backend_ever');

let tasksBoard = [];
let currentDraggedElement;


/**
* Loads all tasks that have been created.
* @function loadBoard()
* @function downloadFromServer()
* @function loadAllFilter()
* 
*/
async function loadBoard() {
    await downloadFromServer();
    tasksBoard = JSON.parse(backend.getItem('tasksBoard')) || [];
    loadAllFilter();
}


/**
* Here all the Tasks that have been created are filtered according to the state.
* After that all containers with the id="todo, inProgress, testing, done" will be emptied.
* Finally, the parameters are passed on to the respective functions.
* 
* @function filterTodoTask() 
* @param {string} curentToDo
* 
* @function filterInProgress() 
* @param {string} currenInProgress
* 
* @function filterTesting() 
* @param {string} currentTesting
* 
* @function filterDone() 
* @param {string} currentDone
* 
*/
function loadAllFilter() {
    let currentToDo = tasksBoard.filter(t => t['state'] == 'todo');
    let currenInProgress = tasksBoard.filter(t => t['state'] == 'inProgress');
    let currentTesting = tasksBoard.filter(t => t['state'] == 'testing');
    let currentDone = tasksBoard.filter(t => t['state'] == 'done');
    document.getElementById('todo').innerHTML = '';
    document.getElementById('inProgress').innerHTML = '';
    document.getElementById('testing').innerHTML = '';
    document.getElementById('done').innerHTML = '';
    filterTodoTask(currentToDo);
    filterInProgress(currenInProgress);
    filterTesting(currentTesting);
    filterDone(currentDone);
}


/**
* In this four filter functions all parameters are read out and assigned to the correct Id.
* @function htmlTicket() 
* @param {string} index
* @param {number} i 
* 
* The function trashClose() makes the Icons with the respective Id's invisible.
* Id's = 'todo' 'inProgress' 'testing' // With the id 'done' the icons are displayed.
* @function trashClose() 
* @param {string} index
* @param {number} i
* 
*/
function filterTodoTask(currentToDo) {
    for (let i = 0; i < currentToDo.length; i++) {
        let index = currentToDo[i];
        document.getElementById('todo').innerHTML += htmlTicket(i, index);
        trashClose(i, index);
    }
}


function filterInProgress(currenInProgress) {
    for (let i = 0; i < currenInProgress.length; i++) {
        let index = currenInProgress[i];
        document.getElementById('inProgress').innerHTML += htmlTicket(i, index);
        trashClose(i, index);
    }
}


function filterTesting(currentTesting) {
    for (let i = 0; i < currentTesting.length; i++) {
        let index = currentTesting[i];
        document.getElementById('testing').innerHTML += htmlTicket(i, index);
        trashClose(i, index);
    }

}


function filterDone(currentDone) {
    for (let i = 0; i < currentDone.length; i++) {
        let index = currentDone[i];
        document.getElementById('done').innerHTML += htmlTicket(i, index);
        trashOpen(i, index);
    }
}


/**
* The function deleteTaskOnBoard() finds out all parameters in allTask. At the position .createdAt is tested.
* If the test passes, the array is deleted at exactly the right place, at the first place.
* @function deleteTaskOnBoard()
* @param {number} i
* 
* With the line '' the array is deleted on the backend.
* After that everything is filtered again and rendered with the function loadAllFilter().
* @function loadAllFilter()
* 
* The pushAllTask() function will update everything that was changed again.
* @function pushAllTask()
* 
*/
async function deleteTaskOnBoard(i) {
    let deleteTask = tasksBoard.findIndex(obj => obj.createdAt == i);
    tasksBoard.splice(deleteTask, 1);
    await backend.deleteItem('tasksBoard');
    loadAllFilter();
    saveUserOnTheBord();
}


/**
* The two functions trashOpen and trashClose read the correct parameters out of the array allTask.
* The parameters are then passed to the Id trashAktiv. 
* @function trashOpen()
* @function trashClose()
* @param {string} index
* @param {number} i
* 
* Finally, the icons are added or removed from exactly the right tickets.
* @classList .remove(`d-none`)
* @classList .add(`d-none`)
* 
*/
function trashOpen(i, index) {
    document.getElementById(`trashAktiv ${i} ${index['state']}`).classList.remove('d-none');
}


function trashClose(i, index) {
    document.getElementById(`trashAktiv ${i} ${index['state']}`).classList.add('d-none');
}


/**
* In AllTask all parameters in the .createdAt area are compared with currentDraggedElement.  
* If the test passes, the Id's are passed from the 'board.html' file with the moveto() function.
* @function ondrop="moveto()"
* @param {number} i = z.b The Id 'inProgress
*
*/
function moveto(i) {
    let array = tasksBoard.find(t => t.createdAt === currentDraggedElement);
    array['state'] = i;
    loadAllFilter();
    saveUserOnTheBord();
}


async function saveUserOnTheBord() {
    await backend.setItem('tasksBoard', JSON.stringify(tasksBoard));
}


/**
* The function startdragging() fetches with the ondragstart="" method
* on the htmlTicket() template to get the correct parameter (Index['createdAt']). 
* @function startdragging()
* @param {number} id = .createdAt
*/
function startdragging(id) {
    currentDraggedElement = id;
}


/**
* allowDrop() gives the possibility to move the elements.
* @function allowDrop()
* @function preventDefault()
* @param {ev} 
*/
function allowDrop(ev) {
    ev.preventDefault();
}


/**
* Renders all tickets with all current parameters.
* @function htmlTicket()
* @function ondragstart="startdragging()"
* @function onclick="deleteTaskOnBoard()"
* @param {number} currentDraggedElement
* @param {number} i 
* @param {string} index 
* @returns 
*/
function htmlTicket(i, index) {
    return /*html*/`
        <div id="${i} ${index['state']}" draggable="true" ondragstart="startdragging(${index['createdAt']})" class="${index['categorie']} ticket-color cursorMove">
            <div class="ticket word-wrap">
                <div class="d-flex justify-content-between">
                    <div class="d-flex align-center">
                        <div>
                            <img class="mr-10 img-25" src="img/icons8-calendar-150.png" alt="">
                        </div>
                        <span>
                            ${index['date']}
                        </span>
                    </div>
                    <div>
                        <svg id="trashAktiv ${i} ${index['state']}" onclick="deleteTaskOnBoard(${index['createdAt']})" class="trash-img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                            <!--! Font Awesome Pro 6.1.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
                            <path 
                                d="M135.2 17.69C140.6 6.848 151.7 0 163.8 0H284.2C296.3 0 307.4 6.848 312.8 17.69L320 32H416C433.7 32 448 46.33 448 64C448 81.67 433.7 96 416 96H32C14.33 96 0 81.67 0 64C0 46.33 14.33 32 32 32H128L135.2 17.69zM394.8 466.1C393.2 492.3 372.3 512 346.9 512H101.1C75.75 512 54.77 492.3 53.19 466.1L31.1 128H416L394.8 466.1z"/>
                        </svg>
                    </div>
                </div>
                <div class="mt-10">
                    <b>
                        ${index['title']}
                    </b>
                </div>
                <span>
                    ${index['description']}
                </span>
                <div class="section-bottum">
                    <div class="d-flex">
                        <div class="category-board word-wrap bg-blue mr-10">
                            <span>
                                ${index['categorie']}
                            </span>
                        </div>
                        <div class="category-board word-wrap bg-blue">
                            <span>
                                ${index['prio']}
                            </span>
                        </div>
                    </div>
                    <div class="eamMembers-div">
                        <span>
                            <b>
                                Created by:
                            </b> 
                            ${index['creator']}
                        </span>
                        <span>
                            <b>
                                Teammembers:
                            </b> 
                            ${index['SelectedEmployee']}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    `;
}



