export function createTaskElement(task) {
    const taskElement = document.createElement('div');
    taskElement.classList.add('box1');

    const inputToday = document.createElement('div');
    inputToday.classList.add('input_today');
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('checkbox');
    checkbox.checked = task.completed;

    const title = document.createElement('p');
    title.classList.add('title');
    title.textContent = task.title;

    const deleteBtn = document.createElement('p'); // Кнопка для удаления задачи
    deleteBtn.classList.add('xBtn2');
    deleteBtn.textContent = 'X';

    // Обновление состояния задачи (выполнена или нет)
    checkbox.addEventListener('change', async () => {
        try {
            const updatedTask = { ...task, completed: checkbox.checked };

            const response = await fetch(`http://localhost:3001/todos/${task.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedTask),
            });

            if (!response.ok) throw new Error(`Ошибка: ${response.statusText}`);
        } catch (error) {
            console.error('Ошибка обновления задачи:', error);
        }
    });

    // Удаление задачи
    deleteBtn.addEventListener('click', async () => {
        try {
            const response = await fetch(`http://localhost:3001/todos/${task.id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                taskElement.remove(); // Удаляем элемент из DOM
            } else {
                throw new Error(`Ошибка при удалении задачи: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Ошибка удаления задачи:', error);
        }
    });

    inputToday.appendChild(checkbox);
    inputToday.appendChild(title);
    inputToday.appendChild(deleteBtn);

    const textToday = document.createElement('div');
    textToday.classList.add('text_today');

    const desc = document.createElement('p');
    desc.classList.add('desc');
    desc.textContent = task.description;

    const dayOfTodo = document.createElement('p');
    dayOfTodo.classList.add('dayoftodo');
    dayOfTodo.textContent = task.left === 0 ? 'Today' : `In ${task.left} days`;

    textToday.appendChild(desc);
    textToday.appendChild(dayOfTodo);

    taskElement.appendChild(inputToday);
    taskElement.appendChild(textToday);

    return taskElement;
}
