class ToDo {
  constructor() {
    const $addBtn = document.querySelector('button');

    $addBtn.addEventListener('click', this.handleAdd);
  }

  handleAdd() {
    console.log('add item');
  }
}

new ToDo();
