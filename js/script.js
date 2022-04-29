(() => {
  const submitButton = document.querySelector("#todoSubmit");
  const textInput = document.querySelector("#todoText");
  const tasks = document.querySelector("#tasks");
  const serverAdress = 'http://127.0.0.1:3000';

  getList().then((list) => {
    renderList(list);
  });

  function getList() {
    return getData(`${serverAdress}/items`);
  }

  function updateTask(id, data) {
    return getData(`${serverAdress}/items`, {method: 'PATCH'}, { id: id, ...data});
  }

  function addTask(itemData) {
    return getData(`${serverAdress}/items`, {method: 'POST'}, itemData);
  }

  function deleteTask(id) {
    return getData(`${serverAdress}/items`, {method: 'DELETE'}, { id: id });
  }

  function onAdd(event) {
    event.preventDefault();

    const newTask = {
      isChecked: false,
      name: textInput.value,
    };

    addTask(newTask).then(renderList);
    textInput.value = '';
  }

  function onDelete(event) {
    deleteTask(event.target.id).then(renderList);
  }

  function onChange(id, task) {
    updateTask(id, task);
  }

  submitButton.addEventListener('click', onAdd);

  function renderList(list = []) {
    let listItemsString = '';

    list.forEach(item => {
      listItemsString += `
      <div class="task js-task"> 
        <input class="task__ckeck js-checkbox" type="checkbox" name="" id="${item.id}" ${item.isChecked ? 'checked' : ''}>
        <input 
          id="${item.id}"
          type="text"
          class="task__text"
          value="${item.name}"
        />
        <button id="${item.id}" class="task-btn__delete js-deleteBtn">Delete</button>
      </div>
    `;
    });

    tasks.innerHTML = listItemsString;
    const taskElements = document.querySelectorAll('.js-task');

    taskElements.forEach(taskElement => {
      taskElement.addEventListener('click', event => {
        if (event.target.classList.contains('js-deleteBtn')) {
          onDelete(event);
        }
      });

      taskElement.addEventListener(['keyup'], debounce((event) => {
        const { id, value } = event.target;
        onChange(id, {name: value});
      }), 2000);

      taskElement.addEventListener('change', event => {
        if (event.target.classList.contains('js-checkbox')) {
          const { id, checked } = event.target;
          onChange(id, {isChecked: checked});
        }
      })
    });
  }

  function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
  }

  function getData(url, params, data) {
    let fetchParams = {...params};

    if (data) {
      fetchParams = {...params,
        headers: {...params.headers, ...{
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }},
        body: JSON.stringify(data),
      }
    }

    return fetch(url, fetchParams).then((res) => res.json());
  }
})();
