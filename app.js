let tg = window.Telegram.WebApp;

tg.expand();

tg.MainButton.textColor = "#FFFFFF";
tg.MainButton.color = "#2cab37";

class ButtonHtmlContainer {
    container;
    #index;
    #check;

    constructor(index, check) {
        this.#index = index;
        this.#check = check;
        this.container = document.getElementById(`container${index}`);
    }

    getProductInCheck()
    {
        return this.#check.find((p) => p.productId === this.#index-1);
    }

    updateCountText(count)
    {
        let countBlock = document.getElementById(`product-count${this.#index}`);

        countBlock.innerText = count;
    }

    onlyAddMenu() {
        this.container.innerHTML = `<button class="btn" id="btn${this.#index}">Add</button>`;

        const clickEvent = (event) => {
            if (event.target.matches(`#btn${this.#index}`)) {
                // console.log('Add');
                // Обработка события для кнопки "Add"
                if (!tg.MainButton.isVisible) {
                    tg.MainButton.setText(`Увидеть заказ`);
                    tg.MainButton.show();
                }

                let product = this.getProductInCheck();

                if (product === undefined) {
                    this.#check.push({
                        productId: this.#index-1,
                        count: 0
                    });

                    product = this.getProductInCheck();
                }

                product.count++;

                this.container.removeEventListener("click", clickEvent);
                this.fullMenu();
            }
        };

        this.container.addEventListener("click", clickEvent);
    }

    fullMenu() {
        this.container.innerHTML = `<button class="btn btn-dec" id="btn${this.#index}-dec">-</button>` +
                    `<b class="product-count" id="product-count${this.#index}">${this.getProductInCheck().count}</b>` +
                    `<button class="btn" id="btn${this.#index}">+</button>`;

        const clickEvent = (event) => {
            if (event.target.matches(`#btn${this.#index}`)) {
                // console.log('+');
                // Обработка события для кнопки инкремента
                let product = this.getProductInCheck();

                product.count++;

                this.updateCountText(product.count);
            } else if (event.target.matches(`#btn${this.#index}-dec`)) {
                // console.log('-');
                // Обработка события для кнопки декремента
                let product = this.getProductInCheck();

                product.count--;

                if (product.count === 0) {
                    let i = this.#check.indexOf(product);
                    this.#check.splice(i, 1);

                    this.container.removeEventListener("click", clickEvent);
                    this.onlyAddMenu();
                } else {
                    this.updateCountText(product.count);
                }

                if (this.#check.length === 0) {
                    tg.MainButton.hide();
                }
            }
        };

        this.container.addEventListener("click", clickEvent);
    }
}

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
        cost: 11000
    },
    {
        name: "Cookie",
        cost: 8550
    },
    {
        name: "Donut",
        cost: 9900
    },
    {
        name: "Flan",
        cost: 29000
    }
];

let check = [];

let buttonsCount = 6;
let buttons = new Array(buttonsCount);

for (let i = 0; i < buttonsCount; i++){
    let html = new ButtonHtmlContainer(i+1, check);
    let name = products[i].name;
    let cost = products[i].cost;

    let button = new Button(i+1, html, name, cost);

    button.html.onlyAddMenu();

    let nameHtml = document.getElementById(`btn${i+1}-name`);
    nameHtml.append(`${button.name} ${button.cost/100}`);

    buttons[i] = button;
}

Telegram.WebApp.onEvent("mainButtonClicked", () => {
    // let userCard = document.getElementById("usercard");
    //
    // let j = document.createElement("p");
    // j.innerText = `Нажатие ${item}`;

    let checkForJSON = [];

    for (let i = 0; i < check.length; i++){
        checkForJSON.push({
            index: buttons[check[i].productId+1].index,
            name: buttons[check[i].productId+1].name,
            cost: buttons[check[i].productId+1].cost,
            count: check[i].count
        });
    }

    let myJsonString = JSON.stringify(checkForJSON);

    tg.sendData(myJsonString);

    // userCard.appendChild(j);
});