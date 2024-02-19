const taskForm = document.getElementById("task-form");
const confirmCloseDialog = document.getElementById("confirm-close-dialog");
const openTaskFormBtn = document.getElementById("open-task-form-btn");
const closeTaskFormBtn = document.getElementById("close-task-form-btn");
const addOrUpdateTaskBtn = document.getElementById("add-or-update-task-btn");
const cancelBtn = document.getElementById("cancel-btn");
const discardBtn = document.getElementById("discard-btn");
const tasksContainer = document.getElementById("tasks-container");
const titleInput = document.getElementById("title-input");
const dateInput = document.getElementById("date-input");
const descriptionInput = document.getElementById("description-input");

const users = [
  { name: "Mark", tasks: JSON.parse(localStorage.getItem("Mark data")) || [] },
  { name: "Sasha", tasks: JSON.parse(localStorage.getItem("Sasha data")) || [] },
];

let selectedUser = users[0];
let currentTask = {};

const addOrUpdateTask = () => {
  addOrUpdateTaskBtn.innerText = "Add Task";
  const dataArrIndex = selectedUser.tasks.findIndex(item => item.id === currentTask.id);

  if (dataArrIndex !== -1) {
    selectedUser.tasks[dataArrIndex] = currentTask;
  } else {
    const task = {
      id: `${titleInput.value.toLowerCase().split(" ").join("-")}-${Date.now()}`,
      title: titleInput.value.trim(),
      date: dateInput.value,
      description: descriptionInput.value,
      completed: false,
    };

    selectedUser.tasks.push(task);
  }

  localStorage.setItem(`${selectedUser.name} data`, JSON.stringify(selectedUser.tasks));
  updateTaskContainer();
  reset();
};

const updateTaskContainer = () => {
  tasksContainer.innerHTML = "";

  selectedUser.tasks.forEach(({ id, title, date, description, completed }) => {
    tasksContainer.innerHTML += `
        <div class="task" id="${id}">
          <input type="checkbox" id="task-${id}-toggle" ${completed ? "checked" : ""} onclick="toggleTaskCompleted(this)">
          <label for="task-${id}-toggle">Completed</label>
          <p><strong>Title:</strong> ${title}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Description:</strong> ${description}</p>
          <button onclick="editTask(this)" type="button" class="btn">Edit</button>
          <button onclick="deleteTask(this)" type="button" class="btn">Delete</button>
        </div>
      `;
  });
};

const deleteTask = (buttonEl) => {
  const taskId = buttonEl.parentElement.id;
  selectedUser.tasks = selectedUser.tasks.filter((task) => task.id !== taskId);
  localStorage.setItem(`${selectedUser.name} data`, JSON.stringify(selectedUser.tasks));
  buttonEl.parentElement.remove();
};

const editTask = (buttonEl) => {
  const dataArrIndex = selectedUser.tasks.findIndex(item => item.id === currentTask.id);

  currentTask = { ...selectedUser.tasks[dataArrIndex] };
  console.log(currentTask);
  
  titleInput.value = currentTask.title;
  dateInput.value = currentTask.date;
  descriptionInput.value = currentTask.description;


  addOrUpdateTaskBtn.innerText = "Update Task";

  taskForm.classList.toggle("hidden");
};

const reset = () => {
  titleInput.value = "";
  dateInput.value = "";
  descriptionInput.value = "";
  taskForm.classList.toggle("hidden");
  currentTask = {};
};

if (selectedUser.tasks.length) {
  updateTaskContainer();
}

openTaskFormBtn.addEventListener("click", () =>
  taskForm.classList.toggle("hidden")
);

closeTaskFormBtn.addEventListener("click", () => {
  const formInputsContainValues = titleInput.value || dateInput.value || descriptionInput.value;
  const formInputValuesUpdated = titleInput.value !== currentTask.title || dateInput.value !== currentTask.date || descriptionInput.value !== currentTask.description;

  if (formInputsContainValues && formInputValuesUpdated) {
    confirmCloseDialog.showModal();
  } else {
    reset();
  }
});

cancelBtn.addEventListener("click", () => confirmCloseDialog.close);

discardBtn.addEventListener("click", () => {
  confirmCloseDialog.close;
  reset();
});

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  addOrUpdateTask();


});

addOrUpdateTaskBtn.addEventListener("click", (e) => { 
  currentTask.title = titleInput.value; 
  currentTask.date = dateInput.value; 
  currentTask.description = descriptionInput.value;

  if (currentTask.id === "") {
    currentTask.id = `${titleInput.value.toLowerCase().split(" ").join("-")}-${Date.now()}`;
  }

const dataArrIndex = selectedUser.tasks.findIndex(item => item.id === currentTask.id);

if (dataArrIndex !== -1) { 
  selectedUser.tasks[dataArrIndex] = currentTask; 
  } else { 
  selectedUser.tasks.push(currentTask);
  };

localStorage.setItem(`${selectedUser.name} data`, 
JSON.stringify(selectedUser.tasks));
updateTaskContainer( );
reset();
});

const userSelect = document.getElementById("user-select");

users.forEach((user) => {
  const option = document.createElement("option");
  option.value = user.name;
  option.textContent = user.name;
  userSelect.appendChild(option);
});

userSelect.addEventListener("change", (e) => {
  selectedUser = users.find((user) => user.name === e.target.value);
  updateTaskContainer();
});

const toggleTaskCompleted = (checkboxEl) => {
  if (!selectedUser || !selectedUser.tasks || selectedUser.tasks.length === 0) {
    return;
  }

  const taskId = checkboxEl.id.split("-")[1];
  const task = selectedUser.tasks.find((task) => task.id === taskId);

  if (!task) {
    return;
  }

  task.completed = !task.completed;
  localStorage.setItem(`${selectedUser.name} data`, JSON.stringify(selectedUser.tasks));
  updateTaskContainer();
};