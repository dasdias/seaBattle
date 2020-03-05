'use strict';

const record = document.getElementById('record');
const shot = document.getElementById('shot');
const hit = document.getElementById('hit');
const dead = document.getElementById('dead');
const enemy = document.getElementById('enemy');
const again = document.getElementById('again');
const header = document.querySelector('.header');

const game = { // В объект game записано количество кораблей и их позиции в виде номеров id 
    ships: [
        {
            location: ['26','36', '46', '56'],
            hit: ['','','','']
        },
        {
            location: ['11','12','13'],
            hit: ['','','']
        },
        {
            location: ['69', '79'],
            hit: ['','']
        },
        {
            location: ['32'],
            hit: ['']
        },
    ],
    shipCount: 4,
};

const play = {
    record: localStorage.getItem('seaBattleRecord') || 0, // получаем из localStorage лучший рекорд, если localStorage пустой, выводим 0
    shot: 0, // количество выстрелов
    hit: 0, // количество попаданий
    dead: 0, // количество потопленных кораблей
    set updateData(data) { // (сеттер) в аргумент data принимаем ключ свойства
        this[data] += 1; // у данного объекта с полученым ключом свойства из аргумента, увеличиваем значение на 1
        play.render(); // запускаем метод render() для перерисовки значений на html страниче
    },
    render() { // перерисовываем значения в html странице
        record.textContent = this.record;
        shot.textContent = this.shot;
        hit.textContent = this.hit;
        dead.textContent = this.dead;
    }
};

const show = { // Объект содержит методы, добавляющие css класс элементу полученному из аргумента elem 
    hit(elem) {
        this.changeClass(elem, 'hit')
    },
    miss(elem) {
        this.changeClass(elem, 'miss')
    },
    dead(elem) {
        this.changeClass(elem, 'dead')
    },
    changeClass(elem, value) {
        elem.className = value;
    }
}

const fire = (event) => {
    const target = event.target; // получаем елемент по которому кликнули
    if(target.classList.length !== 0 || target.tagName !== "TD") return // Если попали между клеток, возвращаем return
    if (game.shipCount < 1) return; // Если игра окончена возвращаем return чтобы дальше не записывались выстрелы
    show.miss(target); // в объекте show dspsdftv метод miss и передаём в него елемент по которому кликнули
    play.updateData = 'shot'; // в объекте play вызываем метод updateData (сеттер) и передаём в него ключ свойства
   
    for (let i = 0; i < game.ships.length; i++) { // перебираем все корабли записанные в объекте game.ships
        const ship = game.ships[i]; // получаем каждый корабль
        const index = ship.location.indexOf(target.id); // проверяем в объекте game.ships.location попал ли пользователь в клетку в которой записан id корабля
        // console.log(index);
        if (index >= 0) { // Если index больше "0", значит в index записана позиция массива с id клетки коробля
            show.hit(target); // вызываем метод hit у объекта show и передаём аргументом елемент по которому кликнул пользователь
            play.updateData = 'hit'; // в объекте play запускаем метод updateData и свойство hit увеличиваем на 1
            ship.hit[index] = 'x'; // записываем попадание
            const life = ship.hit.indexOf(''); // Проверяем есть ли в массиве ещё пустые элементы: -1 элементов больше нет
            if (life < 0) { // если переменная life меньше 0 то...
                play.updateData = 'dead'; // в объекте play добавляем к свойству dead + 1
                console.log(ship);
                for (const id of ship.location) { // перебираем массив 
                    
                    show.dead(document.getElementById(id)); // вызываем метод dead в объекте  
                }

                game.shipCount -= 1;

                if (game.shipCount < 1) {
                    header.style.color = 'red';
                    header.textContent = 'Игра окончена!';

                    if (play.shot < play.record || play.record === 0) {
                        localStorage.setItem('seaBattleRecord', play.shot);
                        play.record = play.shot;
                        play.render();
                        
                    }
                }
            }
        }
    }
}

const init = () => {
    enemy.addEventListener('click',fire);
    play.render();
    // console.log(location);
    again.addEventListener('click', () => {
        location.reload();
    });
};

init()