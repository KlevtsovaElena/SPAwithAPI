 let countCart=0;

 let requestObj = new XMLHttpRequest();
 requestObj.open('GET', 'https://fakestoreapi.com/products/', false);
 requestObj.send();

 let arrayJSON = JSON.parse(requestObj.responseText);
/*собираем данные из API*/
 for(let i = 0; i < arrayJSON.length; i++){
 document.getElementById('containerCards').innerHTML += `
                     <div id="card${arrayJSON[i]['id']}" class="card">
                             <div class="cardImg">
                                 <img src="${arrayJSON[i]['image']}">
                             </div>
                             <div class="description">
                                 <h3>${arrayJSON[i]['price']} &#8381</h3>
                                 <div id="name">${arrayJSON[i]['title']}</div>
                                 <div id="nameVisible">${arrayJSON[i]['title']}</div>
                             </div>
                             <div class="rating">
                                 <h3>&#10026</h3>
                                 <h3 style="font-weight: 100">${arrayJSON[i]['rating']['rate']}</h3>
                             </div>
                             <div class="btn">
                                 <button id="cart${arrayJSON[i]['id']}" class="cartBtn cartAdd" onclick="hiddenCartAdd()">В корзину</button>
                                 <button id="cart${arrayJSON[i]['id']}Delete" class="cartBtn cartDelete" onclick="hiddenCartDelete()">Удалить</button>
                                 <button id="heart${arrayJSON[i]['id']}" class="heart" onclick="hiddenHeart()">&#9825</button>
                                 <button id="heart${arrayJSON[i]['id']}Red" class="heartRed" onclick="hiddenHeartRed()">&#10084</button>
                             </div>
                         </div>
                             `;
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
     event.target.style.display="none";
     document.getElementById(idElement).style.display="inline-block";
     countCart++;
     document.getElementById('countCart').innerHTML = countCart;
 }
 function hiddenCartDelete(){
     let idElement = event.target.id.replace("Delete", "");
     event.target.style.display="none";
     document.getElementById(idElement).style.display="inline-block";
     countCart--;
     document.getElementById('countCart').innerHTML = countCart;
 }
/*при нажатии на Корзину в шапке показать кол-во добавленных товаров*/
 function showCart(){
     alert("Выбрано товаров: " + countCart);
 }
