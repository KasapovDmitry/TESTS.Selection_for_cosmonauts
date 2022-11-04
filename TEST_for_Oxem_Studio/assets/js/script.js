// Обертка
(function () {

// Стилизация input[type=range]
for (let e of document.querySelectorAll('input[type="range"].slider-progress')) {
    e.style.setProperty('--value', e.value);
    e.style.setProperty('--min', e.min == '' ? '0' : e.min);
    e.style.setProperty('--max', e.max == '' ? '100' : e.max);
    e.addEventListener('input', () => e.style.setProperty('--value', e.value));
}

//  КАЛЬКУЛЯТОР
// Input для значений
let meaningCost = document.querySelector('.cost-inp');
let meaningContribution = document.querySelector('.contribution-inp');
let meaningTerm = document.querySelector('.term-inp');
let percentContribution = document.querySelector('.contribution-percent');
// input[type=range]
let progressCost = document.querySelector('.cost');
let progressContribution = document.querySelector('.contribution');
let progressTerm = document.querySelector('.term');
// Сумма договора лизинга
let sumTotal = document.querySelector('.sum-all');
// Сумма ежемесячного платежа
let sumMonth = document.querySelector('.sum-mouth');
let rate = 3.5 / 100;// процентная ставка

// Начальные значения в инпутах
meaningCost.value = progressCost.value; // стоимость
meaningTerm.value = progressTerm.value; // срок лизинга
percentContribution.innerHTML = progressContribution.value;
meaningContribution.value = Math.round((meaningCost.value.split(' ').join('') * percentContribution.innerHTML) / 100); // первоначальный взнос
sumMonth.innerHTML = monthPayAll();
function monthPayAll() {
    const monthPay = Math.round((meaningCost.value.split(' ').join('') - meaningContribution.value.split(' ').join('')) * (rate * Math.pow((1 + rate), meaningTerm.value.split(' ').join(''))) / (Math.pow((1 + rate), meaningTerm.value) - 1));
    return monthPay;
}
sumTotal.innerHTML = +meaningContribution.value + meaningTerm.value * monthPayAll();
// Делим большие цифры по 3
format();

// Проверка импутов после ввода
let inputText = document.querySelectorAll('.inp-text');
let inpurRange = document.querySelectorAll('.range-text');
const regex = new RegExp(/[^0-9]/, 'g');

for (let i = 0; i < inputText.length; i++) {
    inputText[i].addEventListener('focusout', function (event) { 
        if (inputText[i].contains(event.relatedTarget)) {
            return;
        } else {
            inputText[i].value = inputText[i].value.split(' ').join('');
            for (let k = 0; k < inpurRange.length; k++) {
                if (i == k ) {
                    if (Number(inputText[i].value.split(' ').join('')) > Number(inpurRange[k].max)) {
                        inputText[i].value = Number(inpurRange[k].max);
                        }
                    if (Number(inputText[i].value.split(' ').join('')) < Number(inpurRange[k].min)) {
                        inputText[i].value = Number(inpurRange[k].min);
                    }
                    if (Number(inputText[i].value.split(' ').join('')) <= Number(inpurRange[k].max) && Number(inputText[i].value.split(' ').join('')) >= Number(inpurRange[k].min)) {
                        if (i == 0) {
                            inputText[i].value = inputText[i].value.split(' ').join('');
                            meaningContribution.value = Math.round((meaningCost.value.split(' ').join('') * percentContribution.innerHTML) / 100);
                            sumMonth.innerHTML = monthPayAll();
                            sumTotal.innerHTML = +meaningContribution.value.split(' ').join('') + meaningTerm.value * monthPayAll();
                        }
                        if (i == 1) {
                            sumMonth.innerHTML = monthPayAll();
                            sumTotal.innerHTML = +meaningContribution.value.split(' ').join('') + meaningTerm.value * monthPayAll();
                        }
                    }
                    if(inputText[i].value === '' || inputText[i].value.match(regex) === null) {
                        return false;
                    } else {
                        inputText[i].value = Number(inpurRange[k].min);
                    }
                }
            }
        }
    });
}

// Поле с процентами
meaningContribution.addEventListener('focusout', function (event) {
    if (meaningContribution.contains(event.relatedTarget)) {
        return;
    } else {
        if (Number(meaningContribution.value.split(' ').join('')) > 3600000) {
            meaningContribution.value = Math.round((meaningCost.value.split(' ').join('') * percentContribution.innerHTML) / 100);
        } 
        if (Number(meaningContribution.value.split(' ').join('')) < 100000) {
            meaningContribution.value = Math.round((meaningCost.value.split(' ').join('') * percentContribution.innerHTML) / 100);
        }
        if (Number(meaningContribution.value.split(' ').join('')) < 3600001 && Number(meaningContribution.value.split(' ').join('')) >= 100000) {
            meaningCost.value =  Math.round((meaningContribution.value.split(' ').join('') * 100) / +percentContribution.innerHTML.split(' ').join(''));
            sumMonth.innerHTML = monthPayAll();
            sumTotal.innerHTML = +meaningContribution.value.split(' ').join('') + meaningTerm.value * monthPayAll();
        }

        if(meaningContribution.value === '' || meaningContribution.value.match(regex) === null) {
            return false;
        } else {
            meaningContribution.value = Math.round((meaningCost.value.split(' ').join('') * percentContribution.innerHTML) / 100);
        }
    }
});

// Пересчет значений при изменении input[type=range]
progressCost.addEventListener("input", costUpdate);
function costUpdate() {
    update(meaningCost, progressCost);
}
progressTerm.addEventListener("input", termUpdate);
function termUpdate() {
    update(meaningTerm, progressTerm);
}
progressContribution.addEventListener("input", percentUpdate);
function percentUpdate() {
    updatePercent(progressContribution, percentContribution);
}
// Пересчет значений
function newNumber() {
    meaningContribution.value = Math.round((meaningCost.value.split(' ').join('') * percentContribution.innerHTML) / 100);
    sumMonth.innerHTML = monthPayAll();
    sumTotal.innerHTML = Math.round(+meaningContribution.value + meaningTerm.value * monthPayAll());
}
//Пересчет значения инпутов Стоимость автомобиля и Срок лизинга
function update(a, b) {
    if (b.value !== a.value) {
        a.value = b.value;
        newNumber();
        format();
    }
}
// Меняю не value (см. выше), а innerHTML
//Пересчет значения инпута Первоначальный взнос
function updatePercent(a, b) {
    if (a.value !== b.innerHTML) {
        b.innerHTML = a.value;
        newNumber();
        format();
    }
}

// Собираем данные и отправляем их на сервер
let button = document.querySelector('.orang-btn');
function formLoad() {
    let post = {
        "car_coast": meaningCost.value,
        "initail_payment": meaningContribution.value,
        "initail_payment_percent": percentContribution.innerHTML,
        "lease_term": meaningTerm.value,
        "total_sum": sumTotal.innerHTML,
        "monthly_payment_from": sumMonth.innerHTML
       }
    // Создаем   onError
    function onError(e) {
        console.log('Error', e);
    }
    const xhr = new XMLHttpRequest();
        xhr.open("POST", "https://hookb.in/eK160jgYJ6UlaRPldJ1P");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = () => {

            // Прелоадер
            let loading = document.querySelector('.btn-content');
            loading.innerHTML = `<img src="./assets/img/preloader.png" alt="preloader">`;
            loading.classList.add('preloader');
            // Дефолт
            let allInputs = document.querySelectorAll('input');
            allInputs.forEach(element => {
                element.disabled = true;
                element.classList.add('no-click');
            });
            
            button.classList.add('no-click');

            if (xhr.status == 200) { 
                console.log(xhr.responseText);
                loading.innerHTML = 'Оставить заявку';
                loading.classList.remove('preloader');
                allInputs.forEach(element => {
                    element.disabled = false;
                    element.classList.remove('no-click');
                });
                button.classList.remove('no-click');
            } else {
                console.log("Server response: ", xhr.statusText);
                loading.innerHTML = 'Оставить заявку';
                loading.classList.remove('preloader');
                allInputs.forEach(element => {
                    element.disabled = false;
                    element.classList.remove('no-click');
                });
                button.classList.remove('no-click');
            }
        };
        xhr.onerror = () => {
            alert("Запрос не выполнен");
        };
        xhr.send(post);
}
button.addEventListener("click", formLoad);


// Формат для чисел
function toNum(num, obj) {
    num = new Intl.NumberFormat().format(num);
    obj.innerHTML = num;
}
function toVal(sum) {
    sum.value = sum.value.replace(/\D/g, '').replace(/(\d)(?=(\d{3})+$)/g, '$1 ');
}

function format() {
    toNum(sumMonth.innerHTML, sumMonth);
    toNum(sumTotal.innerHTML, sumTotal);
    toVal(meaningCost);
    toVal(meaningContribution);
}

// Конец обертки
})();
 