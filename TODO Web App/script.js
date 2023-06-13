window.addEventListener("load", () => {
  //! when load
  const form = document.querySelector("#new-task-form");
  const input = document.querySelector("#new-task-input");
  const listElement = document.querySelector("#tasks");

  form.addEventListener("submit", (e) => {
    e.preventDefault(); //prevent reload

    const task = input.value;
    if (!task) {
      alert("You must add task!");
      return;
    }

    const taskElement = createTaskElement(task);
    listElement.appendChild(taskElement);

    input.value = ""; // Clear input field after submit
    saveTasksToLocalStorage();
  });

  //! Add click event listener to each filter span
  const filters = document.querySelectorAll(".filters span");
  // Add click event listener to each span
  filters.forEach((span) => {
    span.addEventListener("click", function () {
      // Remove 'active' class from all span elements
      filters.forEach((span) => span.classList.remove("active"));

      // Add 'active' class to the clicked span
      this.classList.add("active");
      filterTasks();
    });
  });

  //! Load saved tasks from local storage on page load
  loadTasksFromLocalStorage();

  function createTaskElement(task) {
    //* creating task div
    const taskElement = document.createElement("div");
    taskElement.classList.add("task");

    // create content div inside task div
    const contentElement = document.createElement("div");
    contentElement.classList.add("content");

    // icon created
    const checkedIcon = document.createElement("i");
    checkedIcon.classList.add(
      "task_content_icon",
      "fa-solid",
      "fa-circle-check"
    );

    // create content input element
    const taskInput = document.createElement("input");
    taskInput.type = "text";
    taskInput.classList.add("text");
    taskInput.value = task;
    taskInput.readOnly = true;

    const actionElement = document.createElement("div");
    actionElement.classList.add("actions");

    const editButton = document.createElement("button");
    editButton.classList.add("edit");
    editButton.innerText = "Edit";

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete");
    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fa-solid", "fa-xmark");
    deleteButton.appendChild(deleteIcon);

    //inserting content div --
    contentElement.appendChild(checkedIcon);
    contentElement.appendChild(taskInput);
    taskElement.appendChild(contentElement);
    taskElement.appendChild(actionElement);
    actionElement.appendChild(editButton);
    actionElement.appendChild(deleteButton);

    //! ACTION BUTTONS WORKING----
    //*edit button -----------

    editButton.addEventListener("click", () => {
      if (editButton.innerText.toLowerCase() == "edit") {
        taskInput.focus(); //instantly focus
        taskInput.readOnly = false;
        editButton.innerText = "Save"; //change text edit to save
      } else {
        taskInput.readOnly = true;
        editButton.innerText = "Edit";
        saveTasksToLocalStorage();
      }
    });

    //*Delete button click event--------

    deleteButton.addEventListener("click", () => {
      listElement.removeChild(taskElement);
      saveTasksToLocalStorage();
    });

    //*checked icon click event---------

    checkedIcon.addEventListener("click", () => {
      taskInput.classList.toggle("checked");
      checkedIcon.classList.toggle("color");
      saveTasksToLocalStorage();
    });
    

    return taskElement;
  }

  function saveTasksToLocalStorage() {
    const tasks = Array.from(listElement.querySelectorAll(".task"));
    const taskList = tasks.map((taskElement) => {
      const taskInput = taskElement.querySelector(".text");
      return {
        task: taskInput.value,
        completed: taskInput.classList.contains("checked"),
      };
    });
    localStorage.setItem("tasks", JSON.stringify(taskList));
  }

  function loadTasksFromLocalStorage() {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      const taskList = JSON.parse(savedTasks);
      taskList.forEach(task => {
        const taskElement = createTaskElement(task.task);
        if (task.completed) {
          const taskInput = taskElement.querySelector('.text');
          taskInput.classList.add("checked");
          taskElement.querySelector('.task_content_icon').classList.add("color");
        }
        listElement.appendChild(taskElement);
      });
    }
    filterTasks();
  }

  function filterTasks() {
    const filter = document.querySelector(".filters .active").id;
    const tasks = Array.from(listElement.querySelectorAll(".task"));
    tasks.forEach((taskElement) => {
      switch (filter) {
        case "all":
          taskElement.style.display = "flex";
          break;
        case "pending":
          if (
            taskElement.querySelector(".text").classList.contains("checked")
          ) {
            taskElement.style.display = "none";
          } else {
            taskElement.style.display = "flex";
            
          }
          break;
        case "completed":
          if (
            taskElement.querySelector(".text").classList.contains("checked")
          ) {
            taskElement.style.display = "flex";
            
          } else {
            taskElement.style.display = "none";
          }
          break;
        case "clear-all":
          listElement.removeChild(taskElement);
          break;
      }
    });
  }
});
