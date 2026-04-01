class Todo {
  constructor() {
    const savedTasks = localStorage.getItem('mojeZadania');

    if (savedTasks) {
      this.tasks = JSON.parse(savedTasks);
    } else {
      this.tasks = [
        { id: 1, text: "chocolate", date: "2000-01-01", completed: false },
        { id: 2, text: "macaroon", date: "", completed: false },
        { id: 3, text: "candy canes", date: "2000-01-05", completed: false }
      ];
    }

    this.listContainer = document.querySelector('.list-section');
    this.addTextInput = document.querySelector('.add-text');
    this.addDateInput = document.querySelector('.add-date');
    this.addButton = document.querySelector('.add-button');
    this.searchInput = document.querySelector('.search-input');

    this.initEventListeners();
    this.draw();
  }

  saveData() {
    localStorage.setItem('mojeZadania', JSON.stringify(this.tasks));
  }

  initEventListeners() {
    this.searchInput.addEventListener('input', (e) => {
      const wpisanyTekst = e.target.value.toLowerCase();
      const przefiltrowaneZadania = this.tasks.filter(task =>
        task.text.toLowerCase().includes(wpisanyTekst)
      );
      this.draw(przefiltrowaneZadania);
    });

    this.addButton.addEventListener('click', () => {
      this.addTask(this.addTextInput.value, this.addDateInput.value);
    });

    this.listContainer.addEventListener('click', (e) => {
      const itemDiv = e.target.closest('.list-item');
      if (!itemDiv) return;

      const id = Number(itemDiv.dataset.id);

      if (e.target.classList.contains('item-delete')) {
        this.deleteTask(id);
      } else if (e.target.classList.contains('item-checkbox')) {
        this.toggleTask(id);
      }
    });

    this.listContainer.addEventListener('change', (e) => {
      const itemDiv = e.target.closest('.list-item');
      if (!itemDiv) return;
      const id = Number(itemDiv.dataset.id);

      if (e.target.classList.contains('item-text')) {
        this.editTask(id, e.target.value);
      }
      else if (e.target.classList.contains('item-date')) {
        this.editDate(id, e.target.value);
      }
    });
  }

  addTask(text, date) {
    if (text.trim() === '') return;

    const newTask = {
      id: Date.now(),
      text: text,
      date: date,
      completed: false
    };

    this.tasks.push(newTask);
    this.addTextInput.value = '';
    this.searchInput.value = '';

    this.saveData();
    this.draw();
  }

  deleteTask(id) {
    this.tasks = this.tasks.filter(task => task.id !== id);
    this.saveData();
    this.searchInput.dispatchEvent(new Event('input'));
  }

  toggleTask(id) {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.completed = !task.completed;
      this.saveData();
      this.draw();
    }
  }

  editTask(id, newText) {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.text = newText;
      this.saveData();
      this.draw();
    }
  }
  editDate(id, newDate) {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.date = newDate;
      this.saveData();
      this.draw();
    }
  }

  draw(tasksToDraw = this.tasks) {
    this.listContainer.innerHTML = '';

    tasksToDraw.forEach(task => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'list-item';
      itemDiv.dataset.id = task.id;

      const isChecked = task.completed ? 'checked' : '';

      itemDiv.innerHTML = `
                <div class="left-section">
                    <input type="checkbox" class="item-checkbox" ${isChecked}>
                    <input type="text" class="item-text" value="${task.text}">
                </div>
                <input type="date" class="item-date" value="${task.date}">
                <button class="item-delete">X</button>
            `;

      this.listContainer.appendChild(itemDiv);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.myApp = new Todo();
});
