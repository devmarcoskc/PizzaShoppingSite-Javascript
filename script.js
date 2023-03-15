let modalqt = 1;
let cart = [];
let modalKey = 0;

// Listagem das pizzas:
pizzaJson.map((item, index) =>{
    let pizzaItem = document.querySelector(".models .pizza-item").cloneNode(true);
    //preenchendo as informações do pizza item:
    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;

    //abrindo as informações de compras:
    pizzaItem.querySelector('a').addEventListener('click', (e) =>{
        
        e.preventDefault()
        //Pra saber qual pizza foi selecionada:
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        console.log(key);
        modalKey = key;
        let modalqt = 1;
        //Abrindo o janela de compras:
        document.querySelector('.pizzaWindowArea').style.opacity = 0;
        document.querySelector('.pizzaWindowArea').style.display = 'flex'
        setTimeout(() => {
            document.querySelector('.pizzaWindowArea').style.opacity = 1;
        }, 200);

        //preenchendo as informações da pizza selecionada pra compra:
        document.querySelector('.pizzaBig img').src = pizzaJson[key].img;
        document.querySelector('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        document.querySelector('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        document.querySelector('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price}`;
        document.querySelector('.pizzaInfo--size.selected').classList.remove('selected')
        document.querySelectorAll('.pizzaInfo--size').forEach((size, sizeindex) => {
            if(sizeindex == 2) {
                size.classList.add('selected')
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeindex];
        });
        
        document.querySelector('.pizzaInfo--qt').innerHTML = modalqt;

    });

    //jogando as pizzas na tela:
    document.querySelector('.pizza-area').append(pizzaItem);
});

//EVENTOS NA JANELA DE COMPRAS ABAIXO:
function closeWindow() {
    document.querySelector('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => {
        document.querySelector('.pizzaWindowArea').style.display = 'none';    
    }, 500);
}

//Eventos pra fechar janela:
document.querySelector('.pizzaInfo--cancelButton').addEventListener('click', closeWindow);
document.querySelector('.pizzaInfo--cancelMobileButton').addEventListener('click', closeWindow);

//Aumentando e diminuindo o nº de pizzas na janela de compras:
document.querySelector('.pizzaInfo--qtmenos').addEventListener('click',() => {
    if(modalqt > 1) {
        modalqt--;
        document.querySelector('.pizzaInfo--qt').innerHTML = parseInt(modalqt);
    }
});
document.querySelector('.pizzaInfo--qtmais').addEventListener('click',() => {
    modalqt++;
    document.querySelector('.pizzaInfo--qt').innerHTML = parseInt(modalqt);
});

//Eventos de click nos tamanhos da pizza:
document.querySelectorAll('.pizzaInfo--size').forEach((size, sizeindex) => {
    size.addEventListener('click', (e) => {
        document.querySelector('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected'); 
    })
});

//Evento de click em adicionar carrinho:
document.querySelector('.pizzaInfo--addButton').addEventListener('click', () => {
    let sizeSelected = parseInt(document.querySelector('.pizzaInfo--size.selected').getAttribute('data-key'));
    let identifier = modalKey+'@'+sizeSelected;
    let key = cart.findIndex((item) => item.identifier == identifier);
    if (key > -1) {
        cart[key].qt += modalqt;
    } else {
    cart.push({
        identifier,
        id: modalKey,
        size: sizeSelected,
        qt: modalqt
    });
    }
    updateCart();
    closeWindow();
});

//Eventos de click no carrinho mobile:
document.querySelector('.menu-openner').addEventListener('click', () =>{
        if (cart.length >= 1) {
        document.querySelector('aside').style.left = '0';
        }
});
document.querySelector('.menu-closer').addEventListener('click', () => {
    document.querySelector('aside').style.left = '100vw';
});

//Criando função de adicionar coisas ao carrinho e mostrar ele:
function updateCart() {
    document.querySelector('.menu-openner span').innerHTML = cart.length;
    

    if(cart.length > 0) {
        document.querySelector('aside').classList.add('show');
        document.querySelector('.cart').innerHTML = '';

        //Váriaveis para calcular os preços:
        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        //Identificando o item do carrinho:
        for(let i in cart) {
            let pizzaItem = pizzaJson.find((item) => {
                return item.id == cart[i].id;
            });

            //Calculando o subtotal:
            subtotal += cart[i].qt * pizzaItem.price;

            //Para aparecer o tamanho da pizza selecionada:
            let pizzaSizeName;
            switch(cart[i].size) {
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    break;
            }
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;
            
            //Preenchendo as informações do carrinho:
            let cartItem = document.querySelector(".models .cart--item").cloneNode(true);
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if(cart[i].qt > 1) {
                    cart[i].qt--;
                } else {
                    cart.splice(i, 1);
                }    
                updateCart();

            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].qt++;
                updateCart();
            });

            document.querySelector('.cart').append(cartItem);   
        }
        
        //Equações dos preços e jogando na tela as informações:
        desconto = subtotal * 0.1;
        total = subtotal - desconto;
        document.querySelector('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        document.querySelector('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        document.querySelector('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

    } else {
        document.querySelector('aside').classList.remove('show');
        document.querySelector('aside').style.left = '100vw';
    }
};



