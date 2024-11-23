import { reload } from "./libs/utils.js";
import { createTaskElement } from "./components/todos.js";

// Селекторы DOM
const list_today = document.querySelector('.list_today');
const taskInfo = document.querySelector('#taskInfo');
const onlyTodayLink = document.querySelector('#onlyToday');
const homepageLink = document.querySelector('#homepage');
const allTodosSection = document.querySelector('.today');
const tomorrowSection = document.querySelector('.tomarrow');
const laterSection = document.querySelector('.later');
const navbarBtn = document.querySelector('.navbarBtn');
const modal = document.querySelector('.modal');
const nav = document.querySelector('nav');
const main = document.querySelector('main');
const xBtn = document.querySelector('.xBtn');
const titleInput = document.querySelector('.titleInput');
const descriptionInput = document.querySelector('.descriptionInput');
const timeInput = document.querySelector('.timeInput');
const saveBtn = document.querySelector('.saveBtn');

// Контейнеры для задач
const todayContainer = document.querySelector('.list_today');
const tomorrowContainer = document.querySelector('.alltodos2');
const laterContainer = document.querySelector('.alltodos3');
const fortoday = document.querySelector('.fortoday');
const fortomarrow = document.querySelector('.fortomarrow');
const forlater = document.querySelector('.forlater');

let todos = [];

// Функция для обновления отображения задач
const updateView = () => {
    const undoneTasks = todos.filter(todo => !todo.completed);
    const todayTasks = todos.filter(todo => todo.left === 0);
    const tomorrowTasks = todos.filter(todo => todo.left === 1);
    const laterTasks = todos.filter(todo => todo.left > 1);

    // Обновление информации о количестве задач
    taskInfo.textContent = undoneTasks.length
        ? `HI, YOU HAVE ${undoneTasks.length} UNDONE TASKS`
        : 'NO TODOS, CREATE ONE!';
    fortoday.textContent = todayTasks.length ? `FOR TODAY - ${todayTasks.length}` : '';
    fortomarrow.textContent = tomorrowTasks.length ? `TOMORROW - ${tomorrowTasks.length}` : '';
    forlater.textContent = laterTasks.length ? `LATER - ${laterTasks.length}` : '';

    // Перезагрузка содержимого секций
    reload(todayTasks, todayContainer, createTaskElement);
    reload(tomorrowTasks, tomorrowContainer, createTaskElement);
    reload(laterTasks, laterContainer, createTaskElement);

    // Скрытие секций, если они пусты
    allTodosSection.style.display = todayTasks.length ? 'flex' : 'none';
    tomorrowSection.style.display = tomorrowTasks.length ? 'flex' : 'none';
    laterSection.style.display = laterTasks.length ? 'flex' : 'none';
};

// Загрузка задач с сервера
fetch('http://localhost:3001/todos')
    .then(response => response.json())
    .then(data => {
        todos = data; // Сохраняем задачи
        updateView(); // Инициализируем отображение
    })
    .catch(error => console.error('Ошибка загрузки задач:', error));

// Обработчик для добавления новой задачи
saveBtn.addEventListener('click', async () => {
    const newTodo = {
        userId: 1,
        title: titleInput.value.trim(),
        description: descriptionInput.value.trim(),
        left: parseInt(timeInput.value.trim(), 10) || 0,
        completed: false,
    };

    try {
        const response = await fetch('http://localhost:3001/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newTodo),
        });

        if (response.ok) {
            const result = await response.json();
            todos.push(result); // Добавляем задачу в массив
            updateView(); // Обновляем отображение
            modal.style.display = 'none'; // Закрываем модалку
            titleInput.value = '';
            descriptionInput.value = '';
            timeInput.value = '';
        } else {
            throw new Error(`Ошибка при добавлении задачи: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Ошибка сети:', error);
    }
});

// Обработчик удаления задачи
const deleteTask = async (taskId) => {
    try {
        const response = await fetch(`http://localhost:3001/todos/${taskId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            todos = todos.filter(todo => todo.id !== taskId); // Удаляем задачу из массива
            updateView(); // Обновляем отображение
        } else {
            throw new Error(`Ошибка при удалении задачи: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Ошибка удаления задачи:', error);
    }
};

// Привязываем удаление задачи к клику по кнопке
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('xBtn2')) {
        const taskElement = event.target.closest('.box1');
        const taskId = taskElement.getAttribute('data-id'); // Получаем ID задачи
        deleteTask(taskId);
    }
});

// Открытие модального окна
navbarBtn.addEventListener('click', () => {
    nav.style.opacity = '0%';
    main.style.opacity = '0%';
    modal.style.display = 'flex';
});

// Закрытие модального окна
xBtn.addEventListener('click', () => {
    nav.style.opacity = '100%';
    main.style.opacity = '100%';
    modal.style.display = 'none';
});



onlyTodayLink.onclick = () => {
    const main = document.querySelector('main');
    const todayTasks = todos.filter(todo => todo.left === 0); // Фильтруем задачи только на сегодня

    // Перезагружаем задачи только на сегодня
    reload(todayTasks, todayContainer, createTaskElement);

    // Скрываем секции "Завтра" и "Позже"
    tomorrowSection.style.display = 'none';
    laterSection.style.display = 'none';

    // Показываем только секцию "Сегодня"
    allTodosSection.style.display = todayTasks.length ? 'flex' : 'none';

    // Обновляем текст заголовка
    taskInfo.textContent = todayTasks.length
        ? `YOU HAVE ${todayTasks.length} TASKS FOR TODAY`
        : 'NO TASKS FOR TODAY';

    // Стили для выделения активного пункта меню
    onlyTodayLink.style.color = '#FFC700';
    homepageLink.style.color = '#A5A5B4';
};

homepageLink.onclick = () => {
    const main = document.querySelector('main');
    main.style.display = 'block';

    // Возвращаем отображение всех задач
    updateView();

    // Стили для выделения активного пункта меню
    onlyTodayLink.style.color = '#A5A5B4';
    homepageLink.style.color = '#FFC700';
};

