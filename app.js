const menuData = [
    {
        category: "漢堡類",
        items: [
            { id: "b1", name: "豬肉漢堡", price: 30, hasEggOption: true },
            { id: "b2", name: "火腿漢堡", price: 30, hasEggOption: true },
            { id: "b3", name: "培根漢堡", price: 30, hasEggOption: true },
            { id: "b4", name: "香雞漢堡", price: 35, hasEggOption: true },
            { id: "b5", name: "鮪魚漢堡", price: 40, hasEggOption: true },
            { id: "b6", name: "牛肉漢堡", price: 45, hasEggOption: true },
            { id: "b7", name: "鱈魚漢堡", price: 45, hasEggOption: true }
        ]
    },
    {
        category: "蛋餅類",
        items: [
            { id: "o1", name: "原味蛋餅", price: 20 },
            { id: "o2", name: "起士蛋餅", price: 30 },
            { id: "o3", name: "豬肉蛋餅", price: 30 },
            { id: "o4", name: "火腿蛋餅", price: 30 },
            { id: "o5", name: "鮪魚蛋餅", price: 30 },
            { id: "o6", name: "培根蛋餅", price: 30 },
            { id: "o7", name: "香雞蛋餅", price: 35 }
        ]
    },
    {
        category: "套餐類",
        items: [
            { id: "c1", name: "1. 陽光活力餐", price: 55, desc: "吐司、炒蛋、熱狗(2條)、薯條、中冰奶" },
            { id: "c2", name: "2. 總匯蛋漢堡", price: 60, desc: "火腿片、漢堡肉、蛋、中冰奶" },
            { id: "c3", name: "3. 里肌蛋可頌", price: 65, desc: "黑胡椒里肌肉、蛋、起士、千島醬、中冰奶" },
            { id: "c4", name: "4. 田園沙拉餐", price: 70, desc: "蔬菜薯泥(2球)、吐司、太陽蛋、中冰奶" },
            { id: "c5", name: "5. 雙層牛肉堡", price: 70, desc: "新鮮牛肉、新鮮蔬菜、起士、蛋、蕃茄醬、大冰奶" }
        ]
    },
    {
        category: "飲料類",
        items: [
            { id: "d1", name: "紅茶", price: 15, sizes: { M: 15, L: 20 } },
            { id: "d2", name: "奶茶", price: 15, sizes: { M: 15, L: 20 } },
            { id: "d3", name: "無糖綠茶", price: 15, sizes: { M: 15, L: 20 } },
            { id: "d4", name: "豆漿", price: 15, sizes: { M: 15, L: 20 } },
            { id: "d5", name: "柳橙汁", price: 15, sizes: { M: 15, L: 20 } },
            { id: "d6", name: "咖啡", price: 20, sizes: { M: 20, L: 25 } },
            { id: "d7", name: "玉米濃湯", price: 30, sizes: { M: 30, L: 40 } }
        ]
    },
    {
        category: "綜合類",
        items: [
            { id: "s1", name: "薯餅 (1片)", price: 15 },
            { id: "s2", name: "薯條", price: 15 },
            { id: "s3", name: "熱狗 (4條)", price: 20 },
            { id: "s4", name: "雞塊 (3塊)", price: 20 },
            { id: "s5", name: "煎餃", price: 25 },
            { id: "s6", name: "蘿蔔糕 (2片)", price: 30 }
        ]
    }
];

let currentOrder = [];
let activeCategory = menuData[0].category;
let selectedItemForModal = null;

// DOM Elements
const categoryList = document.getElementById('category-list');
const menuGrid = document.getElementById('menu-grid');
const orderItemsContainer = document.getElementById('order-items');
const subtotalEl = document.getElementById('subtotal');
const totalEl = document.getElementById('total-price');
const checkoutBtn = document.getElementById('checkout-btn');
const activeCategoryName = document.getElementById('active-category-name');
const searchInput = document.getElementById('search-input');
const modalOverlay = document.getElementById('modal-overlay');

// Initialize App
function init() {
    renderCategories();
    renderMenu();
    setupEventListeners();
}

function renderCategories() {
    categoryList.innerHTML = menuData.map(cat => `
        <div class="category-item ${cat.category === activeCategory ? 'active' : ''}" 
             onclick="setCategory('${cat.category}')">
            ${cat.category}
        </div>
    `).join('');
}

function setCategory(category) {
    activeCategory = category;
    activeCategoryName.innerText = category;
    renderCategories();
    renderMenu();
}

function renderMenu(searchTerm = '') {
    let itemsToRender = [];
    
    if (searchTerm) {
        menuData.forEach(cat => {
            cat.items.forEach(item => {
                if (item.name.includes(searchTerm)) {
                    itemsToRender.push(item);
                }
            });
        });
        activeCategoryName.innerText = `搜尋: ${searchTerm}`;
    } else {
        const category = menuData.find(c => c.category === activeCategory);
        itemsToRender = category ? category.items : [];
    }

    menuGrid.innerHTML = itemsToRender.map(item => `
        <div class="menu-card" onclick="handleItemClick('${item.id}')">
            <div>
                <h4>${item.name}</h4>
                ${item.desc ? `<p class="description">${item.desc}</p>` : ''}
            </div>
            <div class="price">NT$ ${item.price}</div>
        </div>
    `).join('');
}

function handleItemClick(itemId) {
    const item = findItemById(itemId);
    if (!item) return;

    if (item.hasEggOption || item.sizes) {
        openModal(item);
    } else {
        addToOrder(item.name, item.price);
    }
}

function findItemById(id) {
    for (const cat of menuData) {
        const item = cat.items.find(i => i.id === id);
        if (item) return item;
    }
    return null;
}

function openModal(item) {
    selectedItemForModal = item;
    const modalTitle = document.getElementById('modal-title');
    const modalOptions = document.getElementById('modal-options');
    
    modalTitle.innerText = item.name;
    modalOptions.innerHTML = '';

    if (item.hasEggOption) {
        modalOptions.innerHTML = `
            <div class="option-item selected" data-add="0" onclick="selectOption(this)">
                <span>原味</span>
                <span>NT$ ${item.price}</span>
            </div>
            <div class="option-item" data-add="5" onclick="selectOption(this)">
                <span>加蛋</span>
                <span>NT$ ${item.price + 5}</span>
            </div>
        `;
    } else if (item.sizes) {
        modalOptions.innerHTML = Object.entries(item.sizes).map(([size, price], index) => `
            <div class="option-item ${index === 0 ? 'selected' : ''}" data-price="${price}" data-suffix="(${size})" onclick="selectOption(this)">
                <span>${size === 'M' ? '中杯' : '大杯'}</span>
                <span>NT$ ${price}</span>
            </div>
        `).join('');
    }

    modalOverlay.style.display = 'flex';
}

function selectOption(el) {
    document.querySelectorAll('.option-item').forEach(opt => opt.classList.remove('selected'));
    el.classList.add('selected');
}

function closeModal() {
    modalOverlay.style.display = 'none';
    selectedItemForModal = null;
}

document.getElementById('confirm-add-btn').onclick = () => {
    const selectedOption = document.querySelector('.option-item.selected');
    if (!selectedOption || !selectedItemForModal) return;

    let finalName = selectedItemForModal.name;
    let finalPrice = selectedItemForModal.price;

    if (selectedItemForModal.hasEggOption) {
        const addAmount = parseInt(selectedOption.dataset.add);
        if (addAmount > 0) {
            finalName += " (加蛋)";
            finalPrice += addAmount;
        }
    } else if (selectedItemForModal.sizes) {
        finalPrice = parseInt(selectedOption.dataset.price);
        finalName += ` ${selectedOption.dataset.suffix}`;
    }

    addToOrder(finalName, finalPrice);
    closeModal();
};

function addToOrder(name, price) {
    const existingItem = currentOrder.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        currentOrder.push({ name, price, quantity: 1 });
    }
    updateOrderUI();
}

function updateOrderUI() {
    if (currentOrder.length === 0) {
        orderItemsContainer.innerHTML = '<div class="empty-cart"><p>尚未點餐</p></div>';
        checkoutBtn.disabled = true;
    } else {
        orderItemsContainer.innerHTML = currentOrder.map((item, index) => `
            <div class="order-item">
                <div class="item-info">
                    <h5>${item.name}</h5>
                    <p>NT$ ${item.price} x ${item.quantity}</p>
                </div>
                <div class="item-quantity">
                    <button class="qty-btn" onclick="changeQty(${index}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="changeQty(${index}, 1)">+</button>
                </div>
            </div>
        `).join('');
        checkoutBtn.disabled = false;
    }

    const total = currentOrder.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    subtotalEl.innerText = `NT$ ${total}`;
    totalEl.innerText = `NT$ ${total}`;
}

function changeQty(index, delta) {
    currentOrder[index].quantity += delta;
    if (currentOrder[index].quantity <= 0) {
        currentOrder.splice(index, 1);
    }
    updateOrderUI();
}

function setupEventListeners() {
    document.getElementById('clear-order').onclick = () => {
        if (confirm('確定要清空訂單嗎？')) {
            currentOrder = [];
            updateOrderUI();
        }
    };

    checkoutBtn.onclick = () => {
        alert('訂單已送出！總金額: ' + totalEl.innerText);
        currentOrder = [];
        updateOrderUI();
    };

    searchInput.oninput = (e) => {
        renderMenu(e.target.value);
    };
}

init();
