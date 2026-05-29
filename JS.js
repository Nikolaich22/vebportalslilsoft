let user = {
    name: "Иван Иванов",
    position: "Junior Developer",
    department: "Разработка ПО"
};

let tasks = [
    { id: 1, title: "📄 Ознакомиться с правилами внутреннего распорядка", desc: "Изучить документ в разделе 'Документы'", completed: false },
    { id: 2, title: "💻 Установить и настроить рабочее ПО", desc: "IDE, Git, корпоративный мессенджер", completed: false },
    { id: 3, title: "👥 Познакомиться с командой в чате", desc: "Написать приветственное сообщение в общий чат", completed: false },
    { id: 4, title: "📚 Пройти вводный онлайн-курс", desc: "История компании и структура", completed: false },
    { id: 5, title: "🎯 Согласовать индивидуальный план развития с наставником", desc: "Обсудить цели на испытательный срок", completed: false },
    { id: 6, title: "📝 Заполнить профиль в портале", desc: "Добавить фото и контакты", completed: true }
];

function addMessage(text, sender = 'bot') {
    const messagesDiv = document.getElementById('chat-messages');
    const msgDiv = document.createElement('div');
    msgDiv.className = `message message-${sender}`;
    msgDiv.innerHTML = `<div class="message-content">${text}</div>`;
    messagesDiv.appendChild(msgDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function sendMessage() {
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    input.value = '';

    setTimeout(() => {
        let reply = "Спасибо за вопрос! ❤️ Я передал его вашему наставнику. Обычно ответ приходит в течение часа. А пока, может, изучите раздел с задачами?";
        if (text.toLowerCase().includes("привет")) reply = "Приветствую! Рад помочь. Чем могу быть полезен сегодня?";
        else if (text.toLowerCase().includes("спасибо")) reply = "Пожалуйста! Всегда на связи 😊";
        else if (text.toLowerCase().includes("задача")) reply = "Посмотрите раздел 'Мои задачи' — там полный чек-лист адаптации. Удачи!";
        addMessage(reply, 'bot');
    }, 500);
}

function renderTasks() {
    const container = document.getElementById('tasks-list');
    if (!container) return;

    container.innerHTML = '<h3 style="margin-bottom: 16px;">✅ Чек-лист адаптации</h3>';
    tasks.forEach(task => {
        const taskDiv = document.createElement('div');
        taskDiv.className = 'task-item';
        taskDiv.onclick = () => toggleTask(task.id);
        const checkSpan = document.createElement('div');
        checkSpan.className = `task-checkbox ${task.completed ? 'completed' : ''}`;
        checkSpan.innerHTML = task.completed ? '✓' : '';
        taskDiv.innerHTML = `
            ${checkSpan.outerHTML}
            <div class="task-content">
                <div class="task-title">${task.title}</div>
                <div class="task-desc">${task.desc}</div>
            </div>
        `;
        container.appendChild(taskDiv);
    });
    updateProgress();
}

function toggleTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task && !task.completed) {
        task.completed = true;
        renderTasks();
        showNotification(`✅ Отлично! Задача "${task.title}" выполнена! +15% прогресса.`);
        setTimeout(() => {
            if (getProgress() >= 100) {
                showNotification("🎉 ПОЗДРАВЛЯЕМ! Вы завершили программу адаптации! 🎉");
            }
        }, 300);
    } else if (task && task.completed) {
        showNotification("Эта задача уже выполнена. Двигайтесь дальше!", "info");
    }
    updateProgress();
}

function getProgress() {
    const completed = tasks.filter(t => t.completed).length;
    return Math.round((completed / tasks.length) * 100);
}

function updateProgress() {
    const progress = getProgress();
    const fill = document.getElementById('progress-fill');
    const text = document.getElementById('progress-text');
    if (fill) fill.style.width = `${progress}%`;
    if (text) text.innerHTML = `${progress}% выполнено (${tasks.filter(t => t.completed).length}/${tasks.length} задач)`;
    localStorage.setItem('tasks_progress', JSON.stringify(tasks.map(t => ({ id: t.id, completed: t.completed }))));
}

function showNotification(message, type = 'success') {
    const notif = document.createElement('div');
    notif.className = 'notification';
    notif.style.borderLeftColor = type === 'success' ? 'var(--success)' : 'var(--accent)';
    notif.innerHTML = message;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 3000);
}

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active-page'));
    const activePage = document.getElementById(pageId);
    if (activePage) activePage.classList.add('active-page');
    if (pageId === 'home' || pageId === 'tasks') {
        updateProgress();
        if (pageId === 'tasks') renderTasks();
    }
}

function editProfile() {
    const newName = prompt("Введите ваше имя:", user.name);
    if (newName && newName.trim()) {
        user.name = newName.trim();
        document.getElementById('profile-name').innerText = user.name;
        document.getElementById('welcome-name').innerText = user.name.split(' ')[0];
        showNotification("Профиль успешно обновлён!");
        localStorage.setItem('user_name', user.name);
    }
}

const newsData = [
    { title: "🚀 Новый релиз платформы адаптации", date: "15.05.2025", text: "Мы запустили этот портал, чтобы сделать ваше знакомство с компанией максимально комфортным." },
    { title: "🏆 Спортивный турнир среди отделов", date: "10.05.2025", text: "Присоединяйтесь к команде разработки! Турнир по мини-футболу состоится в субботу." },
    { title: "📈 Планерка с руководством", date: "05.05.2025", text: "Запись встречи доступна в общем доступе. Узнайте о стратегии развития СТИЛСОФТ на 2025 год." }
];

function renderNews() {
    const container = document.getElementById('news-container');
    if (!container) return;
    container.innerHTML = '';
    newsData.forEach(news => {
        const card = document.createElement('div');
        card.className = 'card news-item';
        card.innerHTML = `<h3>${news.title}</h3><p><small>${news.date}</small></p><p>${news.text}</p>`;
        container.appendChild(card);
    });
}

function logout() {
    if (confirm('Вы действительно хотите выйти из системы?')) {
        alert('Вы вышли из портала. Для входа обратитесь к HR.');
        localStorage.clear();
        location.reload();
    }
}

function loadSavedData() {
    const savedProgress = localStorage.getItem('tasks_progress');
    if (savedProgress) {
        const savedTasks = JSON.parse(savedProgress);
        tasks.forEach(task => {
            const saved = savedTasks.find(t => t.id === task.id);
            if (saved) task.completed = saved.completed;
        });
    }
    const savedName = localStorage.getItem('user_name');
    if (savedName) {
        user.name = savedName;
        document.getElementById('profile-name').innerText = user.name;
        document.getElementById('welcome-name').innerText = 'Николай';
    }
}

loadSavedData();
renderTasks();
renderNews();
updateProgress();
document.getElementById('welcome-name').innerText = 'Николай';