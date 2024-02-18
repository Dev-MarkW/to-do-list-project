document.addEventListener('DOMContentLoaded', () => {
  const passwordInput = document.getElementById("password-input");
  const usernameInput = document.getElementById("username-input");
  const loginBtn = document.getElementById("login-btn");
  const tasksContainer = document.getElementById("tasks-container");
  const taskForm = document.getElementById("task-form");
  const closeTaskFormBtn = document.getElementById("close-task-form-btn");
  const saveTaskBtn = document.getElementById("save-task-btn");
  const addTaskBtn = document.getElementById("add-task-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const titleInput = document.getElementById("title-input");
  const dateInput = document.getElementById("date-input");
  const descriptionInput = document.getElementById("description-input");
  const taskIdInput = document.getElementById("task-id-input");
  let currentUserPassword;

  const users = JSON.parse(localStorage.getItem("user")) || [
    { username: "user1", password: "password1" },
    { username: "user2", password: "password2" }
  ];

  localStorage.setItem("user", JSON.stringify(users));

  const getUser = (username, password) => users.find(user => user.username === username && user.password === password);

  const getTasks = (password) => {
    const user = getUser('', password); // Get the user by their password
    return user ? JSON.parse(localStorage.getItem(user.id)) || [] : [];
  };

  const saveTasks = (tasks, password) => {
    const user = getUser('', password); // Get the user by their password
    if (user) {
      localStorage.setItem(user.id, JSON.stringify(tasks));
    }
  };

  const showTasks = (tasks) => {
    tasksContainer.innerHTML = "";
    tasks.forEach(({ id, title, date, description }) => {
      tasksContainer.innerHTML += `<div class="task">
                                  <h2>${title}</h2>
                                  <p>${date}</p>
                                  <p>${description}</p>
                              </div>`;
    });
  };

  const addTask = (tasks, title, date, description) => {
    tasks.push({
      id: new Date().getTime(),
      title: title,
      date: date,
      description: description,
    });
    saveTasks(tasks, currentUserPassword);
    showTasks(tasks);
  };

  const handleLogin = () => {
    const username = usernameInput.value;
    const password = passwordInput.value;

    const user = users.find((user) => user.username === username && user.password === password);

    if (user) {
      currentUserPassword = password;
      const tasks = getTasks(password);
      showTasks(tasks);
    } else {
      alert("Invalid username or password");
    }
  };

  const handleSaveTask = () => {
    if (currentUserPassword) {
      if (titleInput.value && dateInput.value && descriptionInput.value) {
        addTask(getTasks(currentUserPassword), titleInput.value, dateInput.value, descriptionInput.value);
        taskForm.reset();
      } else {
        alert("Please fill in all fields");
      }
    } else {
      alert("Please login first");
    }
  };

  const handleCloseTaskForm = () => taskForm.reset();

  const handleAddTask = () => {
    if (titleInput.value || dateInput.value || descriptionInput.value) {
      taskForm.reset();
      taskForm.style.display = "block";
    } else {
      alert("Please add a task");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    tasksContainer.innerHTML = "";
    taskForm.reset();
    taskForm.style.display = "none";
  };

  loginBtn.addEventListener("click", handleLogin);
  saveTaskBtn.addEventListener("click", handleSaveTask);
  closeTaskFormBtn.addEventListener("click", handleCloseTaskForm);
  addTaskBtn.addEventListener("click", handleAddTask);
  logoutBtn.addEventListener("click", handleLogout);

  taskForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const taskIdInput = document.getElementById("task-id-input");
    const taskId = taskIdInput.value;

    if (currentUserPassword) {
      if (titleInput.value || dateInput.value || descriptionInput.value) {
        if (taskId) {
          // Update the task with the given ID
          const tasks = getTasks(currentUserPassword);
          const taskIndex = tasks.findIndex((task) => task.id === parseInt(taskId));
          tasks[taskIndex] = {
            ...tasks[taskIndex],
            title: titleInput.value,
            date: dateInput.value,
            description: descriptionInput.value,
          };
          saveTasks(tasks, currentUserPassword);
          taskForm.reset();
          taskForm.style.display = "none";
        } else {
          // Create a new task with the given title, date, and description
          addTask(getTasks(currentUserPassword), titleInput.value, dateInput.value, descriptionInput.value);
          taskForm.reset();
          showTasks(getTasks(currentUserPassword));
        }
      } else {
        alert("Please fill in all fields");
      }
    } else {
      alert("Please login first");
    }
  });
});