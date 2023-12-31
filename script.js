"use strict";

const menuItems = {
    foods: [
        { name: "Escondidinho", price: 59.90, description: "Carne-seca desfiada, purê de mandioca gratinado, queijo coalho" },
        { name: "Crepe de Frango", price: 19.90, description: "Peito de frango, queijo coalho" }
    ],
    desserts: [
        { name: "Sorvete de Creme", price: 10.90, description: "Sorvete de creme com calda (Chocolate, Caramelo, Morango)" }
    ],
    drinks: [
        { name: "Refrigerante", price: 5.50, description: "Bebida gaseificada" },
        { name: "Água com Gás", price: 5.50, description: "Água mineral gaseificada" },
        { name: "Água sem Gás", price: 5.00, description: "Água mineral sem gás" },
        { name: "Água de Coco", price: 7.00, description: "Água de coco natural" },
        { name: "Suco Natural", price: 8.70, description: "Suco de frutas frescas (Limão, Abacaxi, Laranja e Morango)" }
    ]
};

const selections = {
    foods: [],
    desserts: [],
    drinks: []
};

function updatePricesWithMargin(marginPercent) {
    for (const category in menuItems) {
        menuItems[category].forEach(item => {
            item.price += item.price * marginPercent / 100;
        });
    }
}

updatePricesWithMargin(10);

function showPhysicalMenu() {
    document.getElementById("initial-message").style.display = "none";

    const initialMessage = document.getElementById("initial-message");
    initialMessage.style.display = "block";

    const notification = document.createElement("div");
    notification.className = "notification";
    notification.textContent = "O cardápio físico já está a caminho!";
    document.body.appendChild(notification);

    notification.classList.add("show");

    setTimeout(() => {
        notification.classList.remove("show");

        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}

function showVirtualMenu() {
    document.getElementById("initial-message").style.display = "none";
    document.getElementById("virtual-menu").style.display = "flex";
    document.getElementById("total-price").textContent = 'Total: R$ 0,00';
   
    console.log('showVirtualMenu');

    const foodContainer = document.getElementById("food-options");
    menuItems.foods.forEach(food => {
        const foodItem = createItemElement(food, "foods");
        foodContainer.appendChild(foodItem);
    });

    const drinkContainer = document.getElementById("drink-options");
    menuItems.drinks.forEach(drink => {
        const drinkItem = createItemElement(drink, "drinks");
        drinkContainer.appendChild(drinkItem);
    });

    const dessertContainer = document.getElementById("dessert-options");
    menuItems.desserts.forEach(dessert => {
        const dessertItem = createItemElement(dessert, "desserts");
        dessertContainer.appendChild(dessertItem);
    });
}

function createItemElement(item, category) {
    const container = document.createElement("div");
    container.className = "menu-item";

    const image = document.createElement("img");
    image.src = `images/${category}/${item.name.toLowerCase().replace(/\s/g, '-')}.jpg`;
    image.alt = item.name;
    image.onclick = () => selectItem(category, item);

    const itemName = document.createElement("p");
    itemName.textContent = `${item.name} - R$ ${item.price.toFixed(2)}`;

    const itemDescription = document.createElement("p");
    itemDescription.textContent = item.description;
    itemDescription.style.fontStyle = "italic";
    itemDescription.style.fontSize = "smaller";

    container.appendChild(image);
    container.appendChild(itemName);
    container.appendChild(itemDescription);

    return container;
}

function selectItem(category, item) {
    const dialogContainer = document.createElement("div");
    dialogContainer.className = "dialog-container";

    const dialogTitle = document.createElement("h2");
    dialogTitle.textContent = `${item.name}:`;
    dialogContainer.appendChild(dialogTitle);

    const quantityInput = document.createElement("input");
    quantityInput.placeholder = "Quantidade";
    quantityInput.type = "number";
    quantityInput.min = "1";
    quantityInput.max = "50";
    dialogContainer.appendChild(quantityInput);

    const errorMessage = document.createElement("span");
    errorMessage.style.color = "red";
    errorMessage.style.display = "none";
    dialogContainer.appendChild(errorMessage);

    const observationInput = document.createElement("textarea");
    observationInput.placeholder = "Observação";
    observationInput.rows = "4";
    dialogContainer.appendChild(observationInput);

    quantityInput.oninput = function() {
        const value = parseInt(quantityInput.value);
        if (isNaN(value) || value < 1 || value > 50) {
            errorMessage.textContent = "Quantidade Inválida";
            errorMessage.style.display = "block";
        } else {
            errorMessage.style.display = "none";
        }
    };

    const okButton = document.createElement("button");
    okButton.textContent = "OK";
    okButton.onclick = () => {
        const quantity = parseInt(quantityInput.value);
        if (!isNaN(quantity) && quantity >= 1 && quantity <= 50) {
            const selectedItem = { ...item, quantity };
            selections[category].push(selectedItem);
            updateSelectedItems();
            document.body.removeChild(dialogContainer);
        } else {
            errorMessage.textContent = "Quantidade Inválida";
            errorMessage.style.display = "block";
        }
    };
    dialogContainer.appendChild(okButton);


    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancelar";
    cancelButton.onclick = () => {
        document.body.removeChild(dialogContainer);
    };
    dialogContainer.appendChild(cancelButton);

    document.body.appendChild(dialogContainer);
}

function updateSelectedItems() {
    const selectedItemsContainer = document.getElementById("selected-items");
    selectedItemsContainer.innerHTML = "";

    let totalPrice = 0;

    for (const category in selections) {
        if (selections[category].length > 0) {
            const itemList = document.createElement("ul");
            itemList.className = "selected-list";

            selections[category].forEach((item, index) => {
                const listItem = document.createElement("li");
                listItem.className = "selected-item";

                const itemDetails = document.createElement("div");
                itemDetails.className = "item-details";
                itemDetails.textContent = `${item.name} x${item.quantity} - R$ ${(item.price * item.quantity).toFixed(2)}`;
                listItem.appendChild(itemDetails);

                if (item.observation) {
                    const observationSpan = document.createElement("span");
                    observationSpan.className = "observation";
                    observationSpan.textContent = `Observação: ${item.observation}`;
                    listItem.appendChild(observationSpan);
                }

                const removeButton = document.createElement("button");
                removeButton.textContent = "Remover";
                removeButton.className = "remove-button";
                removeButton.onclick = () => removeSelectedItem(category, index);
                listItem.appendChild(removeButton);

                itemList.appendChild(listItem);

                totalPrice += item.price * item.quantity;
            });

            selectedItemsContainer.appendChild(itemList);
        }
    }

    document.getElementById("total-price").textContent = `Total: R$ ${totalPrice.toFixed(2)}`;
}

function removeSelectedItem(category, index) {
    selections[category].splice(index, 1);
    updateSelectedItems();
}

function finalizeOrder() {
    document.getElementById("total-price").textContent = 'Total: R$ 0,00';
    
    for (const category in selections) {
        selections[category] = [];
    }

    updateSelectedItems();
    const orderDialog = document.createElement("div");
    orderDialog.className = "notification";
    orderDialog.textContent = "Seu pedido está a caminho!";
    document.body.appendChild(orderDialog);

    orderDialog.classList.add("show");

    setTimeout(() => {
        orderDialog.classList.remove("show");

        setTimeout(() => {
            document.body.removeChild(orderDialog);
        }, 500);
    }, 3000);
}
