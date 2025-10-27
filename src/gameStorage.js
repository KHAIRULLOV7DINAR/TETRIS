// Загрузка данных из localStorage
export function loadFromStorage()
{
    const saved = localStorage.getItem("tetrisGameResults");
    if (!saved)
    {
        return { players: {}, lastPlayer: null };
    }
    try
    {
        return JSON.parse(saved);
    } catch (error)
    {
        console.error("Ошибка при чтении из localStorage:", error);
        return { players: {}, lastPlayer: null };
    }
}

// Сохранение данных в localStorage
export function saveToStorage(data)
{
    localStorage.setItem("tetrisGameResults", JSON.stringify(data));
}

// Сохранение результата игрока
export function savePlayerResult(playerName, score, lines, level)
{
    if (!playerName || typeof score !== 'number')
    {
        console.error('Invalid player data:', { playerName, score });
        return null;
    }

    try
    {
        const data = loadFromStorage();
        const results = data.players || {};

        // Сохраняем лучший результат по очкам
        if (!results[playerName] || score > results[playerName].score)
        {
            results[playerName] =
                {
                score: score,
                lines: lines,
                level: level,
                date: new Date().toISOString()
            };
        }

        data.players = results;
        data.lastPlayer = playerName;

        saveToStorage(data);
        return results;
    } catch (error)
    {
        console.error('Error saving player result:', error);
        return null;
    }
}

// Получение последнего игрока
export function getLastPlayer()
{
    const loginUsername = localStorage.getItem("tetris.username");
    if (loginUsername)
    {
        return loginUsername;
    }

    const data = loadFromStorage();
    return data.lastPlayer || null;
}

// Получение таблицы лидеров
export function getLeaderboard(limit = 10)
{
    const data = loadFromStorage();
    const results = data.players || {};

    // Преобразуем объект в массив и сортируем по убыванию очков
    return Object.entries(results)
        .map(([name, data]) => ({
            name,
            score: data.score,
            lines: data.lines,
            level: data.level
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
}

// Загрузка таблицы лидеров
export function loadLeaderboard()
{
    const leaderboard = getLeaderboard();
    const leaderboardElement = document.getElementById("leaderboard-list");

    if (!leaderboardElement) return;

    if (leaderboard.length === 0)
    {
        leaderboardElement.innerHTML = '<div class="no-results">Пока нет рекордов. Будьте первым!</div>';
        return;
    }

    const currentPlayer = getLastPlayer();

    leaderboardElement.innerHTML = leaderboard
        .map((player, index) => {
            const isCurrentUser = player.name === currentPlayer;
            return `
                <div class="leaderboard-item ${isCurrentUser ? 'current-user' : ''}">
                    <span class="leaderboard-rank">${index + 1}.</span>
                    <span class="leaderboard-name">${player.name}</span>
                    <span class="leaderboard-score">${player.score}</span>
                </div>
            `;
        })
        .join('');
}