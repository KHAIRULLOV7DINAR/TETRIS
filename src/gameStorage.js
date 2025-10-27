// game-storage.js

// Обновление имени игрока
function initPlayerName() {
    const username = localStorage.getItem("tetris.username");
    const playerNameElement = document.querySelector('.player-name');

    if (username && username.trim() !== '') {
        playerNameElement.textContent = username;
    } else {
        playerNameElement.textContent = "Игрок";
    }

    console.log("Текущий игрок:", playerNameElement.textContent);
}

// Функция для сохранения результата игры
function saveGameResult(score, level, linesCleared) {
    const username = localStorage.getItem("tetris.username") || "Игрок";
    const gameResult = {
        username: username,
        score: score,
        level: level,
        lines: linesCleared,
        date: new Date().toLocaleString()
    };

    // Получаем существующие результаты
    const existingResults = JSON.parse(localStorage.getItem("tetris.results") || "[]");

    // Добавляем новый результат
    existingResults.push(gameResult);

    // Сортируем по очкам (по убыванию) и сохраняем топ-10
    existingResults.sort((a, b) => b.score - a.score);
    const topResults = existingResults.slice(0, 10);

    localStorage.setItem("tetris.results", JSON.stringify(topResults));

    console.log("✅ Результат сохранен:", gameResult);

    // Показываем обновленную таблицу лидеров
    showLeaderboardInConsole();

    return gameResult;
}

// Функция для вывода таблицы лидеров в консоль
function showLeaderboardInConsole() {
    const leaderboard = JSON.parse(localStorage.getItem("tetris.results") || "[]");
    const currentUser = localStorage.getItem("tetris.username") || "Игрок";

    console.log("🏆 ТАБЛИЦА ЛИДЕРОВ ТЕТРИС 🏆");
    console.log("================================");

    if (leaderboard.length === 0) {
        console.log("   Пока нет результатов");
        return;
    }

    leaderboard.forEach((result, index) => {
        const rank = index + 1;
        const isCurrentUser = result.username === currentUser;
        const userMarker = isCurrentUser ? " 👈 ВЫ" : "";

        console.log(
            `${rank.toString().padStart(2, ' ')}. ${result.username.padEnd(12)} - ${result.score.toString().padStart(6, ' ')} очков (ур. ${result.level}, линии: ${result.lines})${userMarker}`
        );
    });

    console.log("================================");

    // Статистика текущего игрока
    const userResults = leaderboard.filter(result => result.username === currentUser);
    if (userResults.length > 0) {
        const bestScore = Math.max(...userResults.map(r => r.score));
        console.log(`🎯 Ваш лучший результат: ${bestScore} очков`);
        console.log(`📊 Всего ваших результатов: ${userResults.length}`);
    }
}

// Функция для показа модального окна с результатами
function showGameOverModal(score, level, lines) {
    // Сохраняем результат
    const currentResult = saveGameResult(score, level, lines);

    // Создаем модальное окно если его нет
    createModalIfNotExists();

    // Обновляем информацию о текущем результате
    document.getElementById('current-score').textContent = score;
    document.getElementById('current-level').textContent = level;
    document.getElementById('current-lines').textContent = lines;

    // Показываем таблицу лидеров
    displayLeaderboardInModal(currentResult.username);

    // Показываем модальное окно
    document.getElementById('game-over-modal').style.display = 'flex';
}

// Создание модального окна
function createModalIfNotExists() {
    if (document.getElementById('game-over-modal')) {
        return;
    }

    const modalHTML = `
        <div id="game-over-modal" class="game-over-modal" style="display: none;">
            <div class="modal-content">
                <h2>🎮 Игра окончена!</h2>
                
                <div class="current-result">
                    <h3>Ваш результат:</h3>
                    <p>Счет: <span id="current-score">0</span></p>
                    <p>Уровень: <span id="current-level">0</span></p>
                    <p>Линии: <span id="current-lines">0</span></p>
                </div>
                
                <div class="leaderboard-section">
                    <h3>🏆 Топ-10 игроков</h3>
                    <div id="leaderboard-list" class="leaderboard-list">
                        <!-- Сюда вставится таблица лидеров -->
                    </div>
                </div>
                
                <div class="modal-buttons">
                    <button id="restart-game-btn" class="restart-btn">🎯 Начать заново</button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Добавляем обработчик кнопки
    document.getElementById('restart-game-btn').addEventListener('click', function() {
        hideGameOverModal();
        // Вызываем функцию перезапуска из основной игры
        if (window.restartGame) {
            window.restartGame();
        }
    });
}

// Функция для скрытия модального окна
function hideGameOverModal() {
    const modal = document.getElementById('game-over-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Отображение таблицы лидеров в модальном окне
function displayLeaderboardInModal(currentUsername) {
    const leaderboard = JSON.parse(localStorage.getItem("tetris.results") || "[]");
    const leaderboardList = document.getElementById('leaderboard-list');

    if (leaderboard.length === 0) {
        leaderboardList.innerHTML = '<p class="no-results">Пока нет результатов</p>';
        return;
    }

    leaderboardList.innerHTML = leaderboard.map((result, index) => {
        const isCurrentUser = result.username === currentUsername;
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;

        return `
            <div class="leaderboard-item ${isCurrentUser ? 'current-user' : ''}">
                <span class="rank">${medal}</span>
                <span class="name">${result.username}</span>
                <span class="score">${result.score}</span>
                <span class="details">ур.${result.level}</span>
            </div>
        `;
    }).join('');
}

// Функция для получения текущей таблицы лидеров
function getLeaderboard() {
    return JSON.parse(localStorage.getItem("tetris.results") || "[]");
}

// Функция для очистки всех результатов (для тестирования)
function clearAllResults() {
    localStorage.removeItem("tetris.results");
    console.log("🗑️ Все результаты очищены");
    showLeaderboardInConsole();
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initPlayerName();
    // Создаем модальное окно заранее
    createModalIfNotExists();
});

// Делаем функции доступными глобально для использования в index.js
window.saveGameResult = saveGameResult;
window.showGameOverModal = showGameOverModal;
window.hideGameOverModal = hideGameOverModal;
window.showLeaderboardInConsole = showLeaderboardInConsole;
window.getLeaderboard = getLeaderboard;
window.clearAllResults = clearAllResults;