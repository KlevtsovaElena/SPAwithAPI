
//создаём ассоциативный массив для страниц Доставки/Оплаты и Контакты
let addPage = {"arrayDeliveryPay" : {"office" : "г. Москва, ул. Магазинная д. 1, вход со двора",  
                                    "service" : "SHOP-Delivery",
                                    "price" : "450 руб",
                                    "payment" : ["Картой на сайте", "Картой при получении", "Наличными"]
                                },
               "arrayContacts" : { "tel" : "+70000000000",
                                "mail" : "shop@shop.ru",
                                "imageVK": "img/vk.png",
                                "imageTelega": "img/telegramm.png",
                                "imageInsta": "img/insta.jpg"
                                }
};


//создаём пустой массив для записи товаров в корзину И избранное, переменную для подсчёта товаров в корзине. Точнее id товаров
let arrayCart = localStorage.getItem('cart');
let arrayHeart = localStorage.getItem('heart');
let countCart = localStorage.getItem('countCart');

//если нет сохранённого, то создаём новые переменные. 
if (arrayCart == null){
    arrayCart = new Array();
}else {arrayCart = JSON.parse(arrayCart);}

if (arrayHeart == null){
    arrayHeart = new Array();
}else {arrayHeart = JSON.parse(arrayHeart);}

if (countCart == null){
    countCart = 0;
}

//впишем в красный круг корзины количество товаров из переменной countCart
document.getElementById('countCart').innerHTML = countCart;

//переменные для записи элементов HTML
let containerPage = document.getElementById('containerPage');

let templateCatalog = document.getElementById('tmpl-catalog').innerHTML;
let templateCard = document.getElementById('tmpl-card').innerHTML;
let templateDeliveryPay = document.getElementById('tmpl-deliveryPay').innerHTML;
let templateContacts = document.getElementById('tmpl-contacts').innerHTML;
let templateCart = document.getElementById('tmpl-cart').innerHTML;
//отрисуем при загрузке каталог путём вызова функции
renderCatalog();

//функция очистки страницы
function clearPage(){
containerPage.innerHTML="";
}

//функция для отправки запросов
function sendRequestGET(url){
    let requestObj = new XMLHttpRequest();
    requestObj.open('GET', url, false);
    requestObj.send();
    return requestObj.responseText;
}

//для сохранения данных в localStorage
function save(keyData, saveData){
    //кодируем data в json и сохраняем в localStorage
    let dataJson = JSON.stringify(saveData);

    //сохраняем в localStorage
    localStorage.setItem(keyData, dataJson);
}

 //функция отрисовки каталога
 function renderCatalog(){
    clearPage();
    //получаем данные каталога
    let json = sendRequestGET('https://fakestoreapi.com/products/');
    //раскодируем данные
    let data=JSON.parse(json);
    //используем шаблон html - tmpl-catalog для вывода на страницу всех товаров из API
    containerPage.style.backgroundColor="";
     for (let i = 0; i < data.length; i++){   
        containerPage.innerHTML += templateCatalog.replace(/{id}/g, data[i]['id'])
                                                  .replace(/{title}/g, data[i]['title'])
                                                  .replace('{image}', data[i]['image'])
                                                  .replace('{price}', data[i]['price'])
                                                  .replace('{rate}', data[i]['rating']['rate']);
     }
    /*здесь проходимся по массиву товаров в Корзине. Если они есть в ней , то
    то кнопку 'В корзину' этих элемннтов скрыть, а кнопку 'Удалить' - показать*/
     for (let i = 0; i < arrayCart.length; i++){
        document.getElementById('cart'+ arrayCart[i]).classList.add('d-none');
        document.getElementById('cart'+ arrayCart[i] +'Delete').classList.add('d-iblock');
     }
    /*то же самое с кнопкой Избранное*/
    for (let i = 0; i < arrayHeart.length; i++){
        document.getElementById('heart'+ arrayHeart[i]).classList.add('d-none');
        document.getElementById('heart'+ arrayHeart[i] +'Red').classList.add('d-iblock');
     }
 }

 //функция отрисовки карточки
 function renderCard(id){
    clearPage();
    //получаем данные одного товара по id
    let json = sendRequestGET('https://fakestoreapi.com/products/' + id);
    //раскодируем данные
    let data=JSON.parse(json);

    /*вот это /{id}/g нужно для того, чтобы заменить ВСЕ найденные значения {id}, а не первое */
    containerPage.innerHTML += templateCard.replace(/{id}/g, data['id'])
                                           .replace(/{title}/g, data['title'])
                                           .replace('{image}', data['image'])
                                           .replace('{price}', data['price'])
                                           .replace('{rate}', data['rating']['rate'])
                                           .replace('{count}', data['rating']['count'])
                                           .replace('{description}', data['description']);
   /*здесь проверяем, есть ли в массиве Корзины элемент со значением id, кторый передали в эту функцию
    indexOf(String(id)) - если есть - вернётся >0 (индекс элеента в массиве.)
    String(id) нужен для того, чтобы ЧИСЛО id  преобразовать в СТРОКУ (напр, 3 в '3').
    ИТОГ: если есть элемент в корзине, то кнопку 'В корзину' скрыть, а кнопку 'Удалить' - показать*/
    if (arrayCart.indexOf(String(id)) >= 0){
            document.getElementById('cart'+ id).classList.add('d-none');
            document.getElementById('cart'+ id +'Delete').classList.add('d-iblock');
    }  
    /*то же самое с кнопкой Избранное*/
    if (arrayHeart.indexOf(String(id)) >= 0){
        document.getElementById('heart'+ id).classList.add('d-none');
        document.getElementById('heart'+ id +'Red').classList.add('d-iblock');
     }                                
  }

//функция отрисовки странички Доставка Оплата
function showDeliveryPay(){
    clearPage();
    //здесь соберём данные об оплате массива, чтобы вывести их все не через запятую, а с новой строки
    let payment="";
    for(let i = 0; i < addPage['arrayDeliveryPay']['payment'].length; i++){
        payment += (i+1) + ". " + addPage['arrayDeliveryPay']['payment'][i] + "<br>";
    }

    containerPage.innerHTML += templateDeliveryPay.replace('{office}', addPage['arrayDeliveryPay']['office'])
                                                    .replace('{service}', addPage['arrayDeliveryPay']['service'])
                                                    .replace('{price}', addPage['arrayDeliveryPay']['price'])
                                                    .replace('{payment}', payment);
}

//функция отрисовки странички Контакты
function showContacts(){
    clearPage();
    containerPage.innerHTML += templateContacts .replace(/{tel}/g, addPage['arrayContacts']['tel'])
                                                .replace(/{mail}/g, addPage['arrayContacts']['mail'])
                                                .replace('{imageVK}', addPage['arrayContacts']['imageVK'])
                                                .replace('{imageTelega}', addPage['arrayContacts']['imageTelega'])
                                                .replace('{imageInsta}', addPage['arrayContacts']['imageInsta'])
                                                .replace('{office}', addPage['arrayDeliveryPay']['office']);

}
/*Страничка Корзины - выводятся наименования товаров и считается общая стоимость*/
function showCart(){
    clearPage();

    let json = sendRequestGET('https://fakestoreapi.com/products/');
    let data=JSON.parse(json);
    let cart = "";
    let price = 0;
    /*пробегаем по массиву товаров в корзине. Записываем в переменную cart все его элементы с новой строки.
     А в переменную price считаем общую стоимость товаров*/
    for(let i=0; i < arrayCart.length; i++){
        cart += (i+1) + ". " + data[arrayCart[i]-1]['title'] + "----------" + data[arrayCart[i]-1]['price'] + " руб.<br>";
        price += data[arrayCart[i]-1]['price'];
    }
    containerPage.innerHTML += templateCart .replace('{cart}', cart)
                                            .replace('{price}', price);
 }
/*при нажатии появляется-исчезает красное сердечко, типо добавили-убрали в избранное*/
 function hiddenHeart(){
     let idElement = event.target.id+"Red";
     let id = event.target.id.replace('heart', '');
     event.target.style.display="none";
     document.getElementById(idElement).style.display="inline-block";
     arrayHeart.push(id); 
     save('heart', arrayHeart);
 }
 function hiddenHeartRed(){
     let idElement = event.target.id.replace("Red", "");
     let id=idElement.replace('heart', '');
     event.target.style.display="none";
     document.getElementById(idElement).style.display="inline-block";
     arrayHeart.splice(arrayHeart.indexOf(id), 1);
     save('heart', arrayHeart);
 }
/*  при нажатии меняется кнопка Корзины(добавить-удалить) и 
 идёт подсчёт товаров в Корзине (отображается в красном кружке)*/
/*настроен только счётчик, функционала записи наименований товаров нет*/
 function hiddenCartAdd(){
     let idElement = event.target.id+"Delete";
     let id=event.target.id.replace('cart', '');
     event.target.style.display="none";
     document.getElementById(idElement).style.display="inline-block";
     countCart++;
     document.getElementById('countCart').innerHTML = countCart;
     arrayCart.push(id);
    save('cart', arrayCart);
    localStorage.setItem('countCart', countCart);
 }
 function hiddenCartDelete(){
     let idElement = event.target.id.replace("Delete", "");
     let id=idElement.replace('cart', '');
     event.target.style.display="none";
     document.getElementById(idElement).style.display="inline-block";
     countCart--;
     document.getElementById('countCart').innerHTML = countCart;
     arrayCart.splice(arrayCart.indexOf(id), 1);
     save('cart', arrayCart);
     localStorage.setItem('countCart', countCart);
 }



