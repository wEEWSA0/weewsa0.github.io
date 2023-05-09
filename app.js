let tg = window.Telegram.WebApp;

tg.expand();

tg.MainButton.textColor = "#FFFFFF";
tg.MainButton.color = "#2cab37";

class Button {
    index;
    html;
    name;
    cost;

    constructor(index, html, name, cost) {
        this.index = index;
        this.cost = cost;
        this.html = html;
        this.name = name;
    }
}

let products = [
    {
        name: "Burger",
        cost: 12900
    },
    {
        name: "Cake",
        cost: 17900
    },
    {
        name: "Coke",
        cost: 3000
    },
    {
        name: "Cookie",
        cost: 1950
    },
    {
        name: "Donut",
        cost: 5900
    },
    {
        name: "Flan",
        cost: 29000
    }
];
let item = 0;

let buttonsCount = 6;
let buttons = new Array(buttonsCount);

for (let i = 0; i < buttonsCount; i++){
    let html = document.getElementById(`btn${i+1}`);
    let name = products[i].name;
    let cost = products[i].cost;

    let button = new Button(i+1, html, name, cost);

    button.html.addEventListener("click", () => {
        if (tg.MainButton.isVisible) {
            tg.MainButton.hide(); // to edit
        }
        else {
            tg.MainButton.setText(`Вы выбрали товар ${button.name}!`);
            item = button.index;
            tg.MainButton.show();
        }
    });

    let nameHtml = document.getElementById(`btn${i+1}-name`);
    nameHtml.append(`${button.name} ${button.cost/100}`);

    buttons[i] = button;
}

Telegram.WebApp.onEvent("mainButtonClicked", () => {
    let userCard = document.getElementById("usercard");

    let j = document.createElement("p");
    j.innerText = `Нажатие ${item}`;

    tg.sendData([{
        index: buttons[item].index,
        name: buttons[item].name,
        cost: buttons[item].cost
    }]);

    userCard.appendChild(j);
});