//переменная подсчёта товаров в Корзине
let countCart=0;
//создаём ассоциативный массив для Доставки/Оплаты
let arrayDeliveryPay = {"office" : "г. Москва, ул. Магазинная д. 1, вход со двора",  
                        "service" : "SHOP-Delivery",
                        "price" : "450 руб",
                        "payment" : ["Картой на сайте", "Картой при получении", "Наличными"]
};

//создаём ассоциативный массив для Контакты
let arrayContacts = {   "tel" : "+70000000000",
                        "mail" : "shop@shop.ru",
                        "imageVK": "img/vk.png",
                        "imageTelega": "img/telegramm.png",
                        "imageInsta": "img/insta.jpg"
};
//создаём пустой массив для записи товаров в корзину. Точнее id товаров
let arrayCart= new Array();

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
 }

 //функция отрисовки карточки
 function renderCard(id){
    clearPage();
    //получаем данные одного товара по id
    let json = sendRequestGET('https://fakestoreapi.com/products/' + id);
    //раскодируем данные
    let data=JSON.parse(json);
    containerPage.innerHTML += templateCard.replace(/{id}/g, data['id'])
                                           .replace(/{title}/g, data['title'])
                                           .replace('{image}', data['image'])
                                           .replace('{price}', data['price'])
                                           .replace('{rate}', data['rating']['rate'])
                                           .replace('{count}', data['rating']['count'])
                                           .replace('{description}', data['description']);
  }

//функция отрисовки странички Доставка Оплата
function showDeliveryPay(){
    clearPage();
    let payment="";
    for(let i = 0; i < arrayDeliveryPay['payment'].length; i++){
        payment += (i+1) + ". " + arrayDeliveryPay['payment'][i] + "<br>";
    }
    containerPage.innerHTML += templateDeliveryPay.replace('{office}', arrayDeliveryPay['office'])
                                                    .replace('{service}', arrayDeliveryPay['service'])
                                                    .replace('{price}', arrayDeliveryPay['price'])
                                                    .replace('{payment}', payment);
}

//функция отрисовки странички Контакты
function showContacts(){
    clearPage();
    containerPage.innerHTML += templateContacts .replace(/{tel}/g, arrayContacts['tel'])
                                                .replace(/{mail}/g, arrayContacts['mail'])
                                                .replace('{imageVK}', arrayContacts['imageVK'])
                                                .replace('{imageTelega}', arrayContacts['imageTelega'])
                                                .replace('{imageInsta}', arrayContacts['imageInsta'])
                                                .replace('{office}', arrayDeliveryPay['office']);

}
/*при нажатии появляется-исчезает красное сердечко, типо добавили-убрали в избранное*/
 function hiddenHeart(){
     let idElement = event.target.id+"Red";
     event.target.style.display="none";
     document.getElementById(idElement).style.display="inline-block";
 }
 function hiddenHeartRed(){
     let idElement = event.target.id.replace("Red", "");
     event.target.style.display="none";
     document.getElementById(idElement).style.display="inline-block";
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
 }
 function hiddenCartDelete(){
     let idElement = event.target.id.replace("Delete", "");
     let id=idElement.replace('cart', '');
     arrayCart.splice(arrayCart.indexOf(id), 1);
     event.target.style.display="none";
     document.getElementById(idElement).style.display="inline-block";
     countCart--;
     document.getElementById('countCart').innerHTML = countCart;
 }
/*Страничка Корзины - выводятся наименования товаров и считается общая стоимость*/
 function showCart(){
    clearPage();
    let json = sendRequestGET('https://fakestoreapi.com/products/');
    let data=JSON.parse(json);
    let cart = "";
    let price = 0;
    for(let i=0; i < arrayCart.length; i++){
        cart += (i+1) + ". " + data[arrayCart[i]]['title'] + "----------" + data[arrayCart[i]]['price'] + "<br>";
        price += data[arrayCart[i]]['price'];
    }
    containerPage.innerHTML += templateCart .replace('{cart}', cart)
                                            .replace('{price}', price);
 }
