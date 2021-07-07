const express = require('express'); // юзаем библиотеку express
const cheerio = require('cheerio'); // юзаем библиотеку cheerio
const axios = require('axios'); // юзаем библиотеку axios
const app = express(); // создаём объект сервера, который ещё не стартанул
const port = 3000; // задаём порт

app.get('/contributions', (req, res) => { // опредлеям роут
    axios.get(`https://github.com/users/${req.query.name}/contributions`, { // запрос на github
    })
        .then(function (response) { //  получаем данные с github
            const html = cheerio.load(response.data); // парсим html
            const rects = html('rect'); // ищем все rect в html
            const days = []; // объявляем пустой массив для получения в последующем в него данные

            rects.each((i, el) => { // пробегаемся по каждому rect
                const rectTag = html(el); // для того чтобы забрать атрибуты у rect его необходимо заново забрат в cherrio
                const dateCount = rectTag.attr('data-count'); // считываем атрибут тега rect
                const date = rectTag.attr('data-date'); // считываем атрибут тега rect

                if (dateCount) { // если dateCount !undefined
                    days[i] = {count: parseInt(dateCount), date: new Date(date)}; // заполняем массив данными
                }
            });
            let sum = 0; // объявляем переменную sum для последующего вывода общего кол-ва коммитов

            days.sort((a, b) => b.date - a.date); // сортируем получившися массив по дате

            for (let i = 0; i < parseInt(req.query.dayCount); i++) { // используем цикл for для пробегания по массиву по N(dayCount)
                sum += days[i].count; // высчитываем сумму
            }
            res.json({points: sum}); // отдаём в респонс общую сумму
        })
        .catch(function (error) {
            console.log(error);
        })
        .then(function () {
            // always executed
        });

});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});


// /contributions?name=Dimych&dayCount=30