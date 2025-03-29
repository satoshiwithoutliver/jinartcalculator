const denominations = [1000, 500, 100, 50, 10, 5, 1];
let paymentCount = 0;

function updateValue(id, change) {
    let input = document.getElementById(id);
    let newValue = (parseInt(input.value) || 0) + change;
    if (newValue < 0) newValue = 0;
    input.value = newValue;
    calculateTotal();
}

function calculateTotal() {
    let totalCash = 0;
    denominations.forEach(value => {
        let count = parseInt(document.getElementById("bill" + value).value) || 0;
        let total = count * value;
        document.getElementById("total" + value).innerText = `= ${total} 元`;
        totalCash += total;
    });

    let pettyCash = parseInt(document.getElementById("pettyCash").value) || 0;
    let actualCash = totalCash - pettyCash;
    document.getElementById("actualCash").innerText = actualCash;

    let creditCard = parseInt(document.getElementById("creditCard").value) || 0;
    let linePay = parseInt(document.getElementById("linePay").value) || 0;
    let extraTotal = 0;
    for (let i = 1; i <= paymentCount; i++) {
        let extraPayment = document.getElementById(`extraPayment${i}`);
        if (extraPayment) {
            extraTotal += parseInt(extraPayment.value) || 0;
        }
    }

    let finalTotal = actualCash + creditCard + linePay + extraTotal;
    document.getElementById("finalTotal").innerText = finalTotal;
    updateSummary();
}

function addPaymentMethod() {
    if (paymentCount >= 10) return;
    paymentCount++;
    let div = document.createElement("div");
    div.innerHTML = `
        <div class="otheritem"><label contenteditable="true">未命名付款${paymentCount}：</label>
        <input type="number" id="extraPayment${paymentCount}" oninput="calculateTotal();">
        <button onclick="removePaymentMethod(${paymentCount})">刪除</button></div>
    `;
    document.getElementById("extraPayments").appendChild(div);
    calculateTotal();
}

function removePaymentMethod(index) {
    let element = document.getElementById(`extraPayment${index}`).parentElement;
    element.remove();
    calculateTotal();
}

function resetCalculator() {
    document.querySelectorAll("input[type=number]").forEach(input => input.value = "");
    document.getElementById("pettyCash").value = 20000;
    paymentCount = 0;
    document.getElementById("extraPayments").innerHTML = "";
    calculateTotal();
}

function toggleSidebar() {
    let sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("open");
    updateSummary();
}

function updateSummary() {
    let summary = document.getElementById("summary");
    summary.innerHTML = "";
    denominations.forEach(value => {
        let count = document.getElementById("bill" + value).value || 0;
        let total = count * value;
        summary.innerHTML += `<p>${value} 元：${count} 張/枚，共 ${total} 元</p>`;
    });
    summary.innerHTML += `<p>零用金扣除：${document.getElementById("pettyCash").value} 元</p>`;
    summary.innerHTML += `<p>實際收現：${document.getElementById("actualCash").innerText} 元</p>`;
    summary.innerHTML += `<p>信用卡：${document.getElementById("creditCard").value || 0} 元</p>`;
    summary.innerHTML += `<p>Line Pay：${document.getElementById("linePay").value || 0} 元</p>`;
    for (let i = 1; i <= paymentCount; i++) {
        let extraPayment = document.getElementById(`extraPayment${i}`);
        if (extraPayment) {
            summary.innerHTML += `<p>未命名付款${i}：${extraPayment.value || 0} 元</p>`;
        }
    }
    summary.innerHTML += `<p>今日營業額：${document.getElementById("finalTotal").innerText} 元</p>`;
}

document.addEventListener("DOMContentLoaded", function () {
    let cashInputs = document.getElementById("cash-inputs");
    denominations.forEach(value => {
        cashInputs.innerHTML += `
            <div id="cashblock">
                <label>${value} 元：</label>
                <button onclick="updateValue('bill${value}', -10)">-10</button>
                <button onclick="updateValue('bill${value}', -1)">-1</button>
                <input type="number" style="text-align:center" id="bill${value}" oninput="calculateTotal();">
                <button onclick="updateValue('bill${value}', 1)">+1</button>
                <button onclick="updateValue('bill${value}', 10)">+10</button>
                <span id="total${value}"></span>
            </div>`;
    });
    calculateTotal();
});

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/service-worker.js")
        .then(reg => console.log("Service Worker 註冊成功", reg))
        .catch(err => console.error("Service Worker 註冊失敗", err));
    });
  }