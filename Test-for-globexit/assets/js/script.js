(function () {
let body = document.querySelector('.body'); // body
let out = document.querySelector('.out'); // Крестик очистка инпута
let field = document.querySelector('.serch-field'); // Инпут
const localhost = "http://localhost:3000/"; //Стартовый адрес
let modalOpen = document.querySelector('.modal'); // Модальное окно

// Создаем карточки
function addCard(mass) {
    mass.forEach(item => {
        // Карточка для каждого объекта
        let card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <div class="card-title">${item.name}</div>
            <div class="card-phone centr">
                <div class="card-phone-img mr20">
                    <img src="./assets/img/phone.svg" alt="Phone">
                </div>
                <a href="tel:+7${item.phone.replace(/\D/g, '')}" class="card-phone-number">
                    <span>${item.phone}</span>
                </a>
            </div>
            <div class="card-mail centr">
                <div class="card-mail-img mr20">
                    <img src="./assets/img/mail.svg" alt="Email">
                </div>
                <a href="mailto:${item.email}" class="card-mail-adress">
                    <span>${item.email}</span>
                </a>
            </div>`;
        document.querySelector('.cards').appendChild(card);
    });
    // Модальное окно
    let cards = document.querySelectorAll('.card');
    for (let i = 0; i < cards.length; i++) {
        cards[i].onclick = () => {
            for (let k = 0; k < mass.length; k++) {
                if (i == k) {
                let modal = document.createElement('div');
                    modal.classList.add('modal');
                    modal.innerHTML = `
                        <div class="modal-fon"></div>
                        <div class="modal-screen">
                            <div class="modal-wrap-content">
                                <div class="modal-screen-cross">
                                    <img src="./assets/img/cross-modal.svg" alt="Out">
                                </div>
                                <div class="modal-screen-title">
                                    <span>${mass[k].name}</span>
                                </div>
                                <div class="modal-screen-row">
                                    <span class="screen-row-punkt">Телефон:</span>
                                    <a href="tel:+7${mass[k].phone.replace(/\D/g, '')}" class="screen-row-content modal-link modal-link-phoine ellipsis">${mass[k].phone}</a>
                                </div>
                                <div class="modal-screen-row">
                                    <span class="screen-row-punkt">Почта:</span>
                                    <a href="mailto:${mass[k].email}" class="screen-row-content modal-link ellipsis">${mass[k].email}</a>
                                </div>
                                <div class="modal-screen-row">
                                    <span class="screen-row-punkt">Дата приема:</span>
                                    <span class="screen-row-content ellipsis">${mass[k].hire_date}</span>
                                </div>
                                <div class="modal-screen-row">
                                    <span class="screen-row-punkt">Должность:</span>
                                    <span class="screen-row-content ellipsis">${mass[k].position_name}</span>
                                </div>
                                <div class="modal-screen-row">
                                    <span class="screen-row-punkt">Подразделение:</span>
                                    <span class="screen-row-content ellipsis">${mass[k].department}</span>
                                </div>
                                <div class="modal-screen-dopinfo">
                                    <span class="screen-row-punkt">Дополнительная информация:</span>
                                    <span class="screen-row-content">Разработчики используют текст Lorem ipsum в качестве заполнителя макета страницы. Так как дополнительной информации в JSON нет, а адрес нигде не используется закинул его сюда: ${mass[k].address}</span>
                                </div>
                            </div>
                        </div>`;
                    document.querySelector('.from-modal').appendChild(modal);
                    body.style.overflow = "hidden";
                    // Открываем модальное окно
                    modalWindow();
                }
            }
        }
    }
}

// Удаляем карточки
function remove() {
    let allCards = document.querySelectorAll('.card');
        allCards.forEach(item => {
            item.remove();
        })
}

// Получаем данные и выводим
async function getData(adress) {
    try {
        let res = await fetch(adress);
        if (!res.ok) {
            console.log(res);
            throw new Error( res.statusText || res.status );
        }
        
        let data = await res.json();
        addCard(data);

    } catch (err) {
    console.error(err);
    alert('Произошла ошибка...');
    }
}
getData(localhost);

// Фильтруем и выводим карточки по клику на лупу
async function getResult() {
    let val = field.value.toLowerCase();
    let adress = `http://localhost:3000?term=${val}`;
    if (val.length > 0) {
        remove();
        getData(adress);
    } else {
        remove();
        getData(localhost);
    }
}
document.querySelector('.serch-btn').onclick = getResult;

// Выводим все карточки при удалении данных из инпута
async function outResult() {
    let val = field.value;
    if (val.length == 0) {
        out.style.display = "none";
        remove();
        getData(localhost);
    }
}
field.onblur = outResult;

// Показываем крестик при фокусе на инпут
function addCross() {
    out.style.display = "block";
}
field.onfocus = addCross;

// Чистим крестиком инпут и выводим все карточки
function removeVal() {
    field.value = '';
    out.style.display = "none";
    remove();
    getData(localhost);
}
out.onclick = removeVal;

// Закрываем модальное окно
function modalWindow() {
    function closeModal(){
        let openModal = document.querySelector('.modal');
        openModal.remove();
        body.style.overflow = "visible";
    }
    document.querySelector('.modal-screen-cross').onclick = closeModal;
    document.querySelector('.modal-fon').onclick = closeModal;
}

})();