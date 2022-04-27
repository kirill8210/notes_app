import tasks from './data.js';

let createdData = new Date();
let options  = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
};

let objOfTasks = tasks.filter(el => el.completed === false).reduce((acc, task) => {
    acc[task._id] = task;
    return acc;
}, {});

let objOfArchive = tasks.filter(el => el.completed === true).reduce((acc, task) => {
    acc[task._id] = task;
    return acc;
}, {});

let numberOfTasks = tasks.reduce((acc, tasks) => {
    const category = acc.find(el => el.name === tasks.category);
    if (!category) {
        return [
            ...acc,
            {
                name: tasks.category,
                totalActive: tasks.completed ? 0 : 1,
                totalArchive: tasks.completed ? 1 : 0,
            },
        ];
    }
    tasks.completed ? category.totalArchive++ : category.totalActive++;
    return acc;
}, []);

const listContainer = document.querySelector('.list_tasks');
const createTask = document.querySelector('.modal_btn');
const toggleStateTask = document.querySelector('.toggle_state');
const modalCard = document.querySelector('.card');
const titleCard = document.querySelector('.card_title');
const form = document.forms['addTask'];
const inputName = form.elements['name'];
const selectValue = document.getElementById("category");
const inputContent = form.elements['content'];
const inputDates = form.elements['dates'];
const inputItem = form.elements['itemId'];
const btn = document.getElementById("addUpdate");
const listCategory = document.querySelector('.list_tasks_category');

renderTasks(objOfTasks);
renderCategory(numberOfTasks);

form.addEventListener('submit', onFormSubmitHandler);
listContainer.addEventListener('click', onDeleteHandler);
listContainer.addEventListener('click', onEditHandler);
listContainer.addEventListener('click', onArchiveHandler);

function renderTasks(tasksList) {
    listContainer.textContent = '';
    const fragment = document.createDocumentFragment();
    Object.values(tasksList).forEach(task => {
        const div = listItemTemplate(task);
        fragment.appendChild(div);
    });
    listContainer.appendChild(fragment);
}

function renderCategory(CategoryList) {
    const fragment = document.createDocumentFragment();
    Object.values(CategoryList).forEach(task => {
        const div = listItemCategory(task);
        fragment.appendChild(div);
    });
    listCategory.appendChild(fragment);
}

function renderUpdateCategory() {
    listCategory.textContent = '';
    numberOfTasks = tasks.reduce((acc, tasks) => {
        const category = acc.find(el => el.name === tasks.category);
        if (!category) {
            return [
                ...acc,
                {
                    name: tasks.category,
                    totalActive: tasks.completed ? 0 : 1,
                    totalArchive: tasks.completed ? 1 : 0,
                },
            ];
        }
        tasks.completed ? category.totalArchive++ : category.totalActive++;
        return acc;
    }, []);

    renderCategory(numberOfTasks);
}

function renderUpdateArchive() {
    objOfArchive = tasks.filter(el => el.completed === true).reduce((acc, task) => {
        acc[task._id] = task;
        return acc;
    }, {});
}

function renderUpdateActive() {
    objOfTasks = tasks.filter(el => el.completed === false).reduce((acc, task) => {
        acc[task._id] = task;
        return acc;
    }, {});
}

function listItemCategory({name, totalActive, totalArchive} = {}) {

    const div = document.createElement("div");
    div.classList.add('tasks_total');

    const titleCategory = document.createElement('div');
    titleCategory.classList.add('tasks_name');

    const categoryImg = document.createElement('div');
    categoryImg.classList.add('category_img');

    const imgTasks = document.createElement('img');
    imgTasks.src = `img/${name}.png`;

    const nameCategory = document.createElement('div');
    nameCategory.textContent = name;

    const activeTasks = document.createElement('div');
    activeTasks.textContent = totalActive;

    const archivedTasks = document.createElement('div');
    archivedTasks.textContent = totalArchive;

    categoryImg.append(imgTasks);
    titleCategory.append(categoryImg, nameCategory);
    div.append(
        titleCategory,
        activeTasks,
        archivedTasks
    );

    return div;
}

function listItemTemplate({_id, created, name, category, content, dates} = {}) {

    const div = document.createElement("div");
    div.classList.add('tasks');
    div.setAttribute('data-task-id', _id);

    const notesName = document.createElement('div');
    notesName.classList.add('tasks_name');

    const categoryImg = document.createElement('div');
    categoryImg.classList.add('category_img');

    const imgTasks = document.createElement('img');
    imgTasks.src = `img/${category}.png`;

    const nameTasks = document.createElement('div');
    nameTasks.classList.add('tasks_title');
    nameTasks.textContent = name;

    const notesCreated = document.createElement('div');
    notesCreated.classList.add('tasks_created');
    notesCreated.textContent = created;

    const notesCategory = document.createElement('div');
    notesCategory.classList.add('tasks_category');
    notesCategory.textContent = category;

    const notesContent = document.createElement('div');
    notesContent.classList.add('tasks_content');
    notesContent.textContent = content;

    const notesDates = document.createElement('div');
    notesDates.classList.add('tasks_dates');
    notesDates.textContent = parseDates(dates);

    const notesActions = document.createElement('div');
    notesActions.classList.add('tasks_actions');

    const linkEdit = document.createElement('a');

    const imgEdit = document.createElement('img');
    imgEdit.src = 'img/edit_icon.png';
    imgEdit.classList.add('edit_btn');

    const linkArchive = document.createElement('a');

    const imgArchive = document.createElement('img');
    imgArchive.src = 'img/archive_icon.png';
    imgArchive.classList.add('archive_btn');

    const linkDelete = document.createElement('a');

    const imgDelete = document.createElement('img');
    imgDelete.src = 'img/delete_icon.png';
    imgDelete.classList.add('delete_btn');

    categoryImg.append(imgTasks);
    notesName.append(categoryImg, nameTasks);

    if(!listContainer.classList.contains('active')){
        linkEdit.append(imgEdit);
    }

    linkArchive.append(imgArchive);
    linkDelete.append(imgDelete);
    notesActions.append(linkEdit, linkArchive, linkDelete);
    div.append(
        notesName,
        notesCreated,
        notesCategory,
        notesContent,
        notesDates,
        notesActions
    );

    return div;
}

createTask.addEventListener('click', (e) =>{
    e.preventDefault();
    btn.textContent = 'Add task';
    modalCard.classList.add('card_active');
});

modalCard.addEventListener('click', (e) =>{
    const target = e.target;
    if (target === modalCard){
        form.reset();
        modalCard.classList.remove('card_active');
    }
});

toggleStateTask.addEventListener('click', (e) =>{
    e.preventDefault();
    listContainer.classList.toggle('active');

    if (listContainer.classList.contains('active')){
        toggleStateTask.textContent = 'Active';
        createTask.classList.add('hidden_btn');
        listContainer.textContent = '';
        renderTasks(objOfArchive);
    } else {
        toggleStateTask.textContent = 'Archive';
        createTask.classList.remove('hidden_btn');
        listContainer.textContent = '';
        renderTasks(objOfTasks);
    }

});

function onFormSubmitHandler(e) {
    e.preventDefault();
    const nameValue = inputName.value;
    const createdValue = createdData.toLocaleString('en-US', options);
    const categoryValue = selectValue.options[selectValue.selectedIndex].text;
    const contentValue = inputContent.value;
    const datesValue = inputDates.value;
    const edit = inputItem.value;

    if (!nameValue || !categoryValue || !contentValue ){
        alert('Enter data');
        return;
    }

    if (edit){
        let objIndex = tasks.findIndex((obj => obj._id === edit));
        tasks[objIndex].name = nameValue;
        tasks[objIndex].category = categoryValue;
        tasks[objIndex].content = contentValue;
        tasks[objIndex].dates = datesValue;


        renderTasks(objOfTasks);

        // if(tasks[objIndex].completed === false){
        //     listContainer.textContent = '';
        //     //renderEdit();
        //     renderTasks(objOfTasks);
        // } else {
        //     //renderEdit();
        //     renderTasks(objOfArchive);
        // }

        form.reset();
        modalCard.classList.remove('card_active');

        //listCategory.textContent = '';
        renderUpdateCategory();


    } else{
        const task = createNewTask(nameValue, createdValue, categoryValue, contentValue, datesValue);
        const listItem = listItemTemplate(task);
        listContainer.insertAdjacentElement("beforeend", listItem);
        form.reset();
        modalCard.classList.remove('card_active');

        function createNewTask(name, created, category, content, dates) {
            const newTask = {
                name, created, category, content, dates,
                completed: false,
                _id: `task-${Math.random()}`,
            };
            objOfTasks[newTask._id] = newTask;

            tasks.push(newTask);
            renderUpdateCategory();

            return { ...newTask};
        }
    }
}

function deleteTask(id) {
    const {name} = objOfTasks[id];
    const isConfirm = confirm(`Точно удалить задачу: ${name}?`);
    if (!isConfirm) return isConfirm;
    delete objOfTasks[id];

    const taskId = tasks.findIndex((el) => el._id === id);
    tasks.splice(taskId, 1);

    renderUpdateCategory();

    return isConfirm;
}

function deleteArchiveTask(id) {
    const {name} = objOfArchive[id];
    const isConfirm = confirm(`Точно удалить задачу: ${name}?`);
    if (!isConfirm) return isConfirm;
    delete objOfArchive[id];

    const taskId = tasks.findIndex((el) => el._id === id);
    tasks.splice(taskId, 1);

    //renderAll(objOfArchive);
    renderUpdateCategory();

    return isConfirm;
}

function deleteTaskFromHtml(confirmed, el) {
    if (!confirmed) return;
    el.remove();
}

function editTask(id) {
    const {name, category, content, dates} = objOfTasks[id];
    const idItem = objOfTasks[id]._id;
    inputName.value = name;
    selectValue.value = category;
    inputContent.value = content;
    inputDates.value = dates;
    inputItem.value = idItem;
    titleCard.textContent = `Edit task "${name}"`;
    btn.textContent = 'Edit task';
    modalCard.classList.add('card_active');
}

function onDeleteHandler({target}) {
    if (target.classList.contains('delete_btn')){
        const parent = target.closest('[data-task-id]');
        const id = parent.dataset.taskId;
        const ifArchive = target.closest('.active');
        if(ifArchive === null){
            const confirmed = deleteTask(id);
            deleteTaskFromHtml(confirmed, parent);
        } else{
            const confirmed = deleteArchiveTask(id);
            deleteTaskFromHtml(confirmed, parent);
        }

    }
}

function onEditHandler({target}) {
    if (target.classList.contains('edit_btn')){
        const parent = target.closest('[data-task-id]');
        const id = parent.dataset.taskId;
        editTask(id);
    }
}

function onArchiveHandler({target}) {
    if (target.classList.contains('archive_btn')){
        const parent = target.closest('[data-task-id]');
        const id = parent.dataset.taskId;
        let taskId = tasks.findIndex(el => el._id === id);
        tasks[taskId].completed = !tasks[taskId].completed;
        parent.remove();
        renderUpdateActive();
        renderUpdateArchive();
        renderUpdateCategory();
    }
}

function parseDates(tasksDates){
    let datesValue = '';
    let dataReg = /(\d{1,2}\/\d{1,2}\/\d{4})/g;
    let dates = tasksDates.match(dataReg);
    switch (true) {
        case dates === null: {
            break;
        }
        case dates.length === 1: {
            datesValue = dates[0];
            break;
        }
        case dates.length > 1: {
            datesValue = dates.join(', ');
            break;
        }

        default:
            break;
    }

    return datesValue;
}




