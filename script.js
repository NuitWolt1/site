// JavaScript для Clicker Game
let coins = 0; // Количество монет
let coinsPerClick = 1; // Монет за клик
let upgrade1Cost = 10; // Стоимость улучшения 1
let upgrade2Cost = 50; // Стоимость улучшения 2
let upgrade3Cost = 100; // Стоимость улучшения 3
let upgrade4Cost = 200; // Стоимость улучшения 4
let upgrade1Level = 0; // Уровень улучшения 1
let upgrade2Level = 0; // Уровень улучшения 2
let upgrade3Level = 0; // Уровень улучшения 3
let upgrade4Level = 0; // Уровень улучшения 4
let bonusCost = 1000; // Стоимость бонуса

const coinCountElement = document.getElementById('coin-count');
const clickArea = document.getElementById('click-area');
const characterImage = document.getElementById('character-image');
const upgrade1Button = document.getElementById('upgrade1-button');
const upgrade2Button = document.getElementById('upgrade2-button');
const upgrade3Button = document.getElementById('upgrade3-button');
const upgrade4Button = document.getElementById('upgrade4-button');
const upgrade1LevelElement = document.getElementById('upgrade1-level');
const upgrade2LevelElement = document.getElementById('upgrade2-level');
const upgrade3LevelElement = document.getElementById('upgrade3-level');
const upgrade4LevelElement = document.getElementById('upgrade4-level');
const closeUpgradesButton = document.getElementById('close-upgrades');
const bubbleContainer = document.getElementById('bubble-container');
const backgroundMusic = document.getElementById('background-music');
const clickSound = document.getElementById('click-sound');
const playButton = document.getElementById('play-button');
const gameContainer = document.getElementById('game-container');
const loadingScreen = document.getElementById('loading-screen');
const bobikButton = document.getElementById('bobik-button');
const slavaButton = document.getElementById('slava-button');
const genkaButton = document.getElementById('genka-button');
const mansurButton = document.getElementById('mansur-button');
const closeCharactersButton = document.getElementById('close-characters');

// Функция обновления отображения монет
function updateCoinCount() {
    coinCountElement.textContent = coins;
}

// Событие клика по области
clickArea.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Предотвращаем зум при быстром клике
    coins += coinsPerClick; // Монеты за клик
    updateCoinCount();
    saveData();
    clickSound.play(); // Проигрываем звук клика

    // Анимация персонажа
    characterImage.style.left = '10px';
    setTimeout(() => {
        characterImage.style.left = '0px';
    }, 200);
});

clickArea.addEventListener('click', () => {
    coins += coinsPerClick; // Монеты за клик
    updateCoinCount();
    saveData();
    clickSound.play(); // Проигрываем звук клика

    // Анимация персонажа
    characterImage.style.left = '10px';
    setTimeout(() => {
        characterImage.style.left = '0px';
    }, 200);
});

// Событие клика по кнопке улучшения 1
upgrade1Button.addEventListener('click', () => {
    if (coins >= upgrade1Cost) { // Проверяем, хватает ли монет
        coins -= upgrade1Cost; // Уменьшаем количество монет
        upgrade1Level++; // Увеличиваем уровень улучшения
        coinsPerClick += 1; // Увеличиваем монеты за клик
        upgrade1Cost *= 2; // Увеличиваем стоимость улучшения в два раза
        upgrade1Button.textContent = `Upgrade (Cost: ${upgrade1Cost} coins)`; // Обновляем текст кнопки
        upgrade1LevelElement.textContent = upgrade1Level; // Обновляем уровень улучшения
        updateCoinCount();
        saveData();
    }
});

// Событие клика по кнопке улучшения 2
upgrade2Button.addEventListener('click', () => {
    if (coins >= upgrade2Cost) { // Проверяем, хватает ли монет
        coins -= upgrade2Cost; // Уменьшаем количество монет
        upgrade2Level++; // Увеличиваем уровень улучшения
        coinsPerClick += 5; // Увеличиваем монеты за клик
        upgrade2Cost *= 2; // Увеличиваем стоимость улучшения в два раза
        upgrade2Button.textContent = `Upgrade (Cost: ${upgrade2Cost} coins)`; // Обновляем текст кнопки
        upgrade2LevelElement.textContent = upgrade2Level; // Обновляем уровень улучшения
        updateCoinCount();
        saveData();
    }
});

// Событие клика по кнопке улучшения 3
upgrade3Button.addEventListener('click', () => {
    if (coins >= upgrade3Cost) { // Проверяем, хватает ли монет
        coins -= upgrade3Cost; // Уменьшаем количество монет
        upgrade3Level++; // Увеличиваем уровень улучшения
        coinsPerClick += 10; // Увеличиваем монеты за клик
        upgrade3Cost *= 2; // Увеличиваем стоимость улучшения в два раза
        upgrade3Button.textContent = `Upgrade (Cost: ${upgrade3Cost} coins)`; // Обновляем текст кнопки
        upgrade3LevelElement.textContent = upgrade3Level; // Обновляем уровень улучшения
        updateCoinCount();
        saveData();
    }
});

// Событие клика по кнопке улучшения 4
upgrade4Button.addEventListener('click', () => {
    if (coins >= upgrade4Cost) { // Проверяем, хватает ли монет
        coins -= upgrade4Cost; // Уменьшаем количество монет
        upgrade4Level++; // Увеличиваем уровень улучшения
        coinsPerClick += 20; // Увеличиваем монеты за клик
        upgrade4Cost *= 2; // Увеличиваем стоимость улучшения в два раза
        upgrade4Button.textContent = `Upgrade (Cost: ${upgrade4Cost} coins)`; // Обновляем текст кнопки
        upgrade4LevelElement.textContent = upgrade4Level; // Обновляем уровень улучшения
        updateCoinCount();
        saveData();
    }
});

// Событие клика по кнопке бонуса
document.getElementById('bonus-button').addEventListener('click', () => {
    if (coins >= bonusCost) { // Проверяем, хватает ли монет
        coins -= bonusCost; // Уменьшаем количество монет
        coinsPerClick += 10; // Увеличиваем монеты за клик на 10
        bonusCost *= 2; // Увеличиваем стоимость бонуса в два раза
        document.getElementById('bonus-button').textContent = `Бонус (Cost: ${bonusCost} coins)`; // Обновляем текст кнопки
        updateCoinCount();
        saveData();
    }
});

// Событие клика по кнопке закрытия вкладки улучшений
closeUpgradesButton.addEventListener('click', function() {
    document.getElementById('upgrades').style.display = 'none';
});

// Событие клика по кнопке выбора персонажа Бобик
bobikButton.addEventListener('click', () => {
    characterImage.src = 'characters/bobik.png';
});

// Событие клика по кнопке выбора персонажа Генка
genkaButton.addEventListener('click', () => {
    characterImage.src = 'characters/genka.png';
});

// Событие клика по кнопке выбора персонажа Мансура
mansurButton.addEventListener('click', () => {
    characterImage.src = 'characters/mansur.png';
});
// Событие клика по кнопке выбора персонажа Генка
slavaButton.addEventListener('click', () => {
    characterImage.src = 'characters/slava.png';
});
// Событие клика по кнопке закрытия вкладки персонажей
closeCharactersButton.addEventListener('click', function() {
    document.getElementById('characters').style.display = 'none';
});

// Функция создания пузыря
function createBubble() {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.style.top = `${Math.random() * (window.innerHeight - 50)}px`;
    bubble.style.left = `${Math.random() * (window.innerWidth - 50)}px`;

    bubble.addEventListener('click', () => {
        coins += 100; // Добавляем монеты за клик по пузырю
        updateCoinCount();
        saveData();
        bubble.remove();
    });

    bubbleContainer.appendChild(bubble);

    let direction = Math.random() < 0.5 ? -1 : 1;
    let speedX = Math.random() * 5;
    let speedY = Math.random() * 5;

    function moveBubble() {
        let left = parseInt(bubble.style.left);
        let top = parseInt(bubble.style.top);

        bubble.style.left = `${left + speedX * direction}px`;
        bubble.style.top = `${top + speedY}px`;

        if (left < 0 || left > window.innerWidth - 50) {
            direction *= -1;
        }

        if (top < 0 || top > window.innerHeight - 50) {
            speedY *= -1;
        }

        setTimeout(moveBubble, 16); // Анимация движения пузыря
    }

    moveBubble();

    setTimeout(() => {
        bubble.remove();
    }, 20000); // Удаляем пузырь через 20 секунд
}

// Функция открытия вкладок
function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = 'none';
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = 'block';
    evt.currentTarget.className += " active";
}

// Функция сохранения данных в локальное хранилище
function saveData() {
    localStorage.setItem('coins', coins);
    localStorage.setItem('coinsPerClick', coinsPerClick);
    localStorage.setItem('upgrade1Cost', upgrade1Cost);
    localStorage.setItem('upgrade2Cost', upgrade2Cost);
    localStorage.setItem('upgrade3Cost', upgrade3Cost);
    localStorage.setItem('upgrade4Cost', upgrade4Cost);
    localStorage.setItem('upgrade1Level', upgrade1Level);
    localStorage.setItem('upgrade2Level', upgrade2Level);
    localStorage.setItem('upgrade3Level', upgrade3Level);
    localStorage.setItem('upgrade4Level', upgrade4Level);
    localStorage.setItem('bonusCost', bonusCost);
}

// Загрузка данных из локального хранилища
function loadData() {
    coins = parseInt(localStorage.getItem('coins')) || 0;
    coinsPerClick = parseInt(localStorage.getItem('coinsPerClick')) || 1;
    upgrade1Cost = parseInt(localStorage.getItem('upgrade1Cost')) || 10;
    upgrade2Cost = parseInt(localStorage.getItem('upgrade2Cost')) || 50;
    upgrade3Cost = parseInt(localStorage.getItem('upgrade3Cost')) || 100;
    upgrade4Cost = parseInt(localStorage.getItem('upgrade4Cost')) || 200;
    upgrade1Level = parseInt(localStorage.getItem('upgrade1Level')) || 0;
    upgrade2Level = parseInt(localStorage.getItem('upgrade2Level')) || 0;
    upgrade3Level = parseInt(localStorage.getItem('upgrade3Level')) || 0;
    upgrade4Level = parseInt(localStorage.getItem('upgrade4Level')) || 0;
    bonusCost = parseInt(localStorage.getItem('bonusCost')) || 1000;

    coinCountElement.textContent = coins;
    upgrade1Button.textContent = `Upgrade (Cost: ${upgrade1Cost} coins)`;
    upgrade2Button.textContent = `Upgrade (Cost: ${upgrade2Cost} coins)`;
    upgrade3Button.textContent = `Upgrade (Cost: ${upgrade3Cost} coins)`;
    upgrade4Button.textContent = `Upgrade (Cost: ${upgrade4Cost} coins)`;
    upgrade1LevelElement.textContent = upgrade1Level;
    upgrade2LevelElement.textContent = upgrade2Level;
    upgrade3LevelElement.textContent = upgrade3Level;
    upgrade4LevelElement.textContent = upgrade4Level;
    document.getElementById('bonus-button').textContent = `Бонус (Cost: ${bonusCost} coins)`;
}

loadData();

// Событие клика по кнопке "Играть"
playButton.addEventListener('click', () => {
    loadingScreen.style.display = 'none';
    gameContainer.style.display = 'block';
    backgroundMusic.play(); // Включаем фоническую музыку
});

// Предотвращаем двойной тап для увеличения
document.addEventListener('touchstart', function preventZoom(event) {
    if (event.touches.length > 1) {
        event.preventDefault(); // Отключаем зум при нескольких касаниях
    }
}, { passive: false });

// Отключаем зум при двойном тапе
let lastTouchEnd = 0;
document.addEventListener('touchend', function(event) {
    const now = new Date().getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault(); // Отключаем двойной тап
    }
    lastTouchEnd = now;
}, false);

// Создаем пузыри каждые 25 секунд
setInterval(createBubble, 25000);
