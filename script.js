"use strict";

const menuItems = {
    foods: [
        { name: "Escondidinho", price: 59.90 },
        { name: "Crepe de Frango", price: 19.90 }
    ],
    desserts: [
        { name: "Sorvete de Creme", price: 10.90 }
    ],
    drinks: [
        { name: "Refrigerante", price: 5.50 },
        { name: "Água com Gás", price: 5.50 },
        { name: "Água sem Gás", price: 5.00 },
        { name: "Água de Coco", price: 7.00 },
        { name: "Suco Natural", price: 8.70 }
    ]
};

const selections = {
    foods: [],
    desserts: [],
    drinks: []
};

function showPhysicalMenu() {
    document.getElementById("initial-message").style.display = "none";
    document.getElementById("physical-menu-message").style.display = "block";
}

function showVirtualMenu() {
    document.getElementById("initial-message").style.display = "none";
    document.getElementById("virtual-menu").style.display = "flex";

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

    container.appendChild(image);
    container.appendChild(itemName);

    return container;
}

function selectItem(category, item) {
    const quantity = prompt(`Quantidade desejada de ${item.name}:`);
    
    if (quantity !== null && !isNaN(quantity) && parseInt(quantity) > 0) {
        const selectedItem = { ...item, quantity: parseInt(quantity) };
        selections[category].push(selectedItem);
        updateSelectedItems();
    } else {
        alert('Quantidade inválida. Tente novamente.');
    }
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

                const itemName = document.createElement("span");
                itemName.textContent = `${item.name} x${item.quantity} - R$ ${(item.price * item.quantity).toFixed(2)}`;
                listItem.appendChild(itemName);

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

    document.getElementById("total-price").textContent = totalPrice.toFixed(2);
    document.getElementById("user-selection").style.display = "flex";
}

function removeSelectedItem(category, index) {
    selections[category].splice(index, 1);
    updateSelectedItems();
}

function finalizeOrder() {
    alert("Seu pedido está a caminho!");
    document.getElementById("user-selection").style.display = "none";
    document.getElementById("order-confirmation-message").style.display = "block";

    for (const category in selections) {
        selections[category] = [];
    }

    updateSelectedItems();

        document.getElementById("order-confirmation-message").style.display = "none";
        document.getElementById("initial-message").style.display = "block";

        location.reload();

}
