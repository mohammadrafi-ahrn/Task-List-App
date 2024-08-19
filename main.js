window.addEventListener('load', () => {
    const form = document.querySelector("#new-task-form");
    const input = document.querySelector("#new-task-input");
    const list_el = document.querySelector("#tasks");

    // Local storage se tasks aur completed tasks load ho rahe hain
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let completeTasks = JSON.parse(localStorage.getItem('completeTasks')) || [];

    // Completed tasks ko local storage me save karne ke liye function
    const doneTasks = () => {
        localStorage.setItem('completeTasks', JSON.stringify(completeTasks));
    }

    // Tasks ko local storage me save karne ke liye function
    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Task element create karne ka function
    const createTaskElement = (task, isCompleted) => {
        const task_el = document.createElement('div');
        task_el.classList.add('task');

        const task_content_el = document.createElement('div');
        task_content_el.classList.add('content');

        const task_checkbox_el = document.createElement('input');
        task_checkbox_el.type = 'checkbox';
        task_checkbox_el.classList.add('checkbox');

        const task_input_el = document.createElement('input');
        task_input_el.classList.add('text');
        task_input_el.type = 'text';
        task_input_el.value = task;
        task_input_el.setAttribute('readonly', 'readonly');

        // Agar task completed hai, toh checkbox ko checked set karte hain aur text ko line-through style dete hain
        if (isCompleted) {
            task_checkbox_el.checked = true;
            task_input_el.style.textDecoration = "line-through";
        }

        const task_actions_el = document.createElement('div');
        task_actions_el.classList.add('actions');

        const task_edit_el = document.createElement('button');
        task_edit_el.classList.add('edit');
        task_edit_el.innerText = 'Edit';

        const task_delete_el = document.createElement('button');
        task_delete_el.classList.add('delete');
        task_delete_el.innerText = 'Delete';

        task_el.appendChild(task_content_el);
        task_content_el.appendChild(task_checkbox_el);
        task_content_el.appendChild(task_input_el);

        task_actions_el.appendChild(task_edit_el);
        task_actions_el.appendChild(task_delete_el);
        task_el.appendChild(task_actions_el);

        list_el.appendChild(task_el);

        input.value = '';

        // Edit button functionality
        task_edit_el.addEventListener('click', () => {
            if (task_edit_el.innerText.toLowerCase() === 'edit') {
                task_input_el.removeAttribute("readonly");
                task_input_el.focus();
                task_edit_el.innerText = "Save";
            } else {
                task_input_el.setAttribute("readonly", "readonly");
                task_edit_el.innerText = 'Edit';

                const index = tasks.indexOf(task);
                if (index > -1) {
                    tasks[index] = task_input_el.value;
                    saveTasks();
                }
            }
        });

        // Delete button functionality
        task_delete_el.addEventListener('click', () => {
            list_el.removeChild(task_el);
            tasks = tasks.filter(x => x !== task);
            completeTasks = completeTasks.filter(x => x !== task);
            saveTasks();
            doneTasks();
        });

        // Checkbox change functionality
        task_checkbox_el.addEventListener('change', () => {
            if (task_checkbox_el.checked) {
                task_input_el.style.textDecoration = "line-through";
                task_edit_el.style.display = "none";
                if (!completeTasks.includes(task)) {
                    completeTasks.push(task);
                    doneTasks();
                }
            } else {
                task_input_el.style.textDecoration = "none";
                task_edit_el.style.display = "block";
                completeTasks = completeTasks.filter(y => y !== task);
                doneTasks();
            }
        });
    };

    // Page load hone par har task ke liye createTaskElement function call karte hain
    tasks.forEach(task => {
        const isCompleted = completeTasks.includes(task);
        createTaskElement(task, isCompleted);
    });

    // Form submit functionality
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const task = input.value;
        if (!task) {
            alert("please input a task");
            return;
        }

        tasks.push(task);
        saveTasks();
        createTaskElement(task, false);
        input.value = '';
    });
});
