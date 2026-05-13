// ===================================================================
// Luminous Coffee — Admin Panel
// Firebase Auth login + Firestore CRUD for categories & products
// ===================================================================

import {
    auth, db,
    signInWithEmailAndPassword, signOut, onAuthStateChanged,
    collection, doc, addDoc, updateDoc, deleteDoc, getDocs,
    onSnapshot, query, orderBy, writeBatch, serverTimestamp
} from './firebase-config.js';

// ── DOM References ──
const loginScreen = document.getElementById('login-screen');
const dashboard = document.getElementById('dashboard');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const loginErrorText = document.getElementById('login-error-text');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const dashUser = document.getElementById('dash-user');

const categoryList = document.getElementById('category-list');
const addCategoryBtn = document.getElementById('add-category-btn');
const addCategoryForm = document.getElementById('add-category-form');
const newCategoryInput = document.getElementById('new-category-input');
const saveCategoryBtn = document.getElementById('save-category-btn');
const cancelCategoryBtn = document.getElementById('cancel-category-btn');

const panelTitle = document.getElementById('panel-title');
const productList = document.getElementById('product-list');
const addProductBtn = document.getElementById('add-product-btn');
const emptyState = document.getElementById('empty-state');

const productModal = document.getElementById('product-modal');
const modalTitle = document.getElementById('modal-title');
const modalClose = document.getElementById('modal-close');
const productForm = document.getElementById('product-form');
const productNameInput = document.getElementById('product-name');
const productPriceInput = document.getElementById('product-price');
const productDescInput = document.getElementById('product-desc');
const productOrderInput = document.getElementById('product-order');
const saveProductBtn = document.getElementById('save-product-btn');

const confirmOverlay = document.getElementById('confirm-overlay');
const confirmTitle = document.getElementById('confirm-title');
const confirmText = document.getElementById('confirm-text');
const confirmYes = document.getElementById('confirm-yes');
const confirmNo = document.getElementById('confirm-no');

const toastContainer = document.getElementById('toast-container');

// ── State ──
let selectedCategoryId = null;
let editingProductId = null;
let categories = [];
let unsubscribeProducts = null;

// ── Auth State Listener ──
onAuthStateChanged(auth, (user) => {
    if (user) {
        loginScreen.style.display = 'none';
        dashboard.classList.add('active');
        dashUser.textContent = user.email;
        loadCategories();
    } else {
        loginScreen.style.display = 'flex';
        dashboard.classList.remove('active');
        if (unsubscribeProducts) unsubscribeProducts();
    }
});

// ── Login ──
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    loginBtn.disabled = true;
    loginBtn.textContent = 'Giriş yapılıyor...';
    loginError.classList.remove('show');

    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        let msg = 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.';
        if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
            msg = 'E-posta veya şifre hatalı.';
        } else if (error.code === 'auth/user-not-found') {
            msg = 'Bu e-posta ile kayıtlı kullanıcı bulunamadı.';
        } else if (error.code === 'auth/too-many-requests') {
            msg = 'Çok fazla deneme yapıldı. Lütfen biraz bekleyin.';
        }
        loginErrorText.textContent = msg;
        loginError.classList.add('show');
    } finally {
        loginBtn.disabled = false;
        loginBtn.textContent = 'Giriş Yap';
    }
});

// ── Logout ──
logoutBtn.addEventListener('click', () => signOut(auth));

// ── Load Categories (Realtime) ──
function loadCategories() {
    const catQuery = query(collection(db, 'categories'), orderBy('order', 'asc'));

    onSnapshot(catQuery, (snapshot) => {
        categories = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        renderCategories();

        // If we had a selected category, re-select it
        if (selectedCategoryId) {
            const exists = categories.find(c => c.id === selectedCategoryId);
            if (exists) {
                selectCategory(selectedCategoryId);
            } else {
                selectedCategoryId = null;
                showEmptyPanel();
            }
        } else if (categories.length > 0) {
            selectCategory(categories[0].id);
        } else {
            showEmptyPanel();
        }
    });
}

// ── Render Categories ──
function renderCategories() {
    categoryList.innerHTML = categories.map(cat => `
        <div class="category-card ${cat.id === selectedCategoryId ? 'active' : ''}" 
             data-id="${cat.id}" onclick="window.adminSelectCategory('${cat.id}')">
            <span class="cat-name">${cat.name}</span>
            <div class="cat-actions">
                <button class="cat-action-btn edit" onclick="event.stopPropagation(); window.adminEditCategory('${cat.id}', '${escapeAttr(cat.name)}')" title="Düzenle">✏️</button>
                <button class="cat-action-btn delete" onclick="event.stopPropagation(); window.adminDeleteCategory('${cat.id}', '${escapeAttr(cat.name)}')" title="Sil">🗑️</button>
            </div>
        </div>
    `).join('');
}

function escapeAttr(str) {
    return str.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

// ── Select Category ──
function selectCategory(catId) {
    selectedCategoryId = catId;
    const cat = categories.find(c => c.id === catId);

    // Update UI
    document.querySelectorAll('.category-card').forEach(card => {
        card.classList.toggle('active', card.dataset.id === catId);
    });

    panelTitle.innerHTML = `<span class="cat-label">${cat?.name || ''}</span> Ürünleri`;
    addProductBtn.style.display = 'flex';

    // Load products for this category
    loadProducts(catId);
}

window.adminSelectCategory = selectCategory;

// ── Add Category ──
addCategoryBtn.addEventListener('click', () => {
    addCategoryForm.classList.toggle('show');
    if (addCategoryForm.classList.contains('show')) {
        newCategoryInput.value = '';
        newCategoryInput.focus();
    }
});

cancelCategoryBtn.addEventListener('click', () => {
    addCategoryForm.classList.remove('show');
});

saveCategoryBtn.addEventListener('click', async () => {
    const name = newCategoryInput.value.trim();
    if (!name) return;

    try {
        await addDoc(collection(db, 'categories'), {
            name,
            order: categories.length + 1,
            createdAt: serverTimestamp()
        });
        addCategoryForm.classList.remove('show');
        showToast('success', `"${name}" kategorisi eklendi.`);
    } catch (error) {
        console.error('Kategori ekleme hatası:', error);
        showToast('error', 'Kategori eklenirken hata oluştu.');
    }
});

// Enter key for category input
newCategoryInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') saveCategoryBtn.click();
    if (e.key === 'Escape') cancelCategoryBtn.click();
});

// ── Edit Category ──
window.adminEditCategory = (catId, currentName) => {
    const card = document.querySelector(`.category-card[data-id="${catId}"]`);
    if (!card) return;

    card.innerHTML = `
        <div class="edit-category-form">
            <input type="text" id="edit-cat-input-${catId}" value="${currentName}" />
            <button class="form-btn primary" onclick="window.adminSaveEditCategory('${catId}')">✓</button>
            <button class="form-btn secondary" onclick="window.adminCancelEditCategory()">✗</button>
        </div>
    `;

    const input = document.getElementById(`edit-cat-input-${catId}`);
    input.focus();
    input.select();
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') window.adminSaveEditCategory(catId);
        if (e.key === 'Escape') window.adminCancelEditCategory();
    });
};

window.adminSaveEditCategory = async (catId) => {
    const input = document.getElementById(`edit-cat-input-${catId}`);
    const newName = input?.value.trim();
    if (!newName) return;

    try {
        await updateDoc(doc(db, 'categories', catId), { name: newName });
        showToast('success', `Kategori "${newName}" olarak güncellendi.`);
    } catch (error) {
        console.error('Kategori güncelleme hatası:', error);
        showToast('error', 'Kategori güncellenirken hata oluştu.');
    }
};

window.adminCancelEditCategory = () => {
    renderCategories();
};

// ── Delete Category ──
window.adminDeleteCategory = (catId, catName) => {
    showConfirm(
        'Kategoriyi Sil',
        `"${catName}" kategorisi ve altındaki tüm ürünler silinecek. Bu işlem geri alınamaz.`,
        async () => {
            try {
                // First delete all products in this category
                const prodSnapshot = await getDocs(collection(db, 'categories', catId, 'products'));
                const batch = writeBatch(db);
                prodSnapshot.docs.forEach(d => {
                    batch.delete(doc(db, 'categories', catId, 'products', d.id));
                });
                batch.delete(doc(db, 'categories', catId));
                await batch.commit();

                if (selectedCategoryId === catId) {
                    selectedCategoryId = null;
                }
                showToast('success', `"${catName}" kategorisi silindi.`);
            } catch (error) {
                console.error('Kategori silme hatası:', error);
                showToast('error', 'Kategori silinirken hata oluştu.');
            }
        }
    );
};

// ── Load Products (Realtime) ──
function loadProducts(catId) {
    if (unsubscribeProducts) unsubscribeProducts();

    const prodQuery = query(
        collection(db, 'categories', catId, 'products'),
        orderBy('order', 'asc')
    );

    unsubscribeProducts = onSnapshot(prodQuery, (snapshot) => {
        const products = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        renderProducts(products);
    });
}

// ── Render Products ──
function renderProducts(products) {
    if (products.length === 0) {
        productList.innerHTML = '';
        emptyState.style.display = 'flex';
        return;
    }

    emptyState.style.display = 'none';
    productList.innerHTML = products.map(p => `
        <div class="product-card" data-id="${p.id}">
            <div class="product-info">
                <div class="product-name">${p.name}</div>
                ${p.description ? `<div class="product-desc">${p.description}</div>` : ''}
            </div>
            <div class="product-price">${p.price}</div>
            <div class="product-actions">
                <button class="product-action-btn edit" onclick="window.adminEditProduct('${p.id}')" title="Düzenle">✏️</button>
                <button class="product-action-btn delete" onclick="window.adminDeleteProduct('${p.id}', '${escapeAttr(p.name)}')" title="Sil">🗑️</button>
            </div>
        </div>
    `).join('');
}

function showEmptyPanel() {
    panelTitle.innerHTML = 'Ürün Yönetimi';
    addProductBtn.style.display = 'none';
    productList.innerHTML = '';
    emptyState.style.display = 'flex';
    emptyState.querySelector('h3').textContent = 'Kategori Seçin';
    emptyState.querySelector('p').textContent = 'Sol panelden bir kategori seçerek ürünlerini yönetebilirsiniz.';
}

// ── Add Product ──
addProductBtn.addEventListener('click', () => {
    if (!selectedCategoryId) return;
    editingProductId = null;
    modalTitle.textContent = 'Yeni Ürün Ekle';
    productNameInput.value = '';
    productPriceInput.value = '';
    productDescInput.value = '';
    productOrderInput.value = '';
    productModal.classList.add('show');
    productNameInput.focus();
});

// ── Edit Product ──
window.adminEditProduct = async (productId) => {
    if (!selectedCategoryId) return;

    try {
        const prodQuery = query(
            collection(db, 'categories', selectedCategoryId, 'products'),
            orderBy('order', 'asc')
        );
        const snapshot = await getDocs(prodQuery);
        const product = snapshot.docs.find(d => d.id === productId);
        if (!product) return;

        const data = product.data();
        editingProductId = productId;
        modalTitle.textContent = 'Ürünü Düzenle';
        productNameInput.value = data.name || '';
        productPriceInput.value = data.price || '';
        productDescInput.value = data.description || '';
        productOrderInput.value = data.order || '';
        productModal.classList.add('show');
        productNameInput.focus();
    } catch (error) {
        console.error('Ürün düzenleme hatası:', error);
        showToast('error', 'Ürün bilgileri yüklenemedi.');
    }
};

// ── Save Product ──
saveProductBtn.addEventListener('click', async () => {
    const name = productNameInput.value.trim();
    const price = productPriceInput.value.trim();
    const description = productDescInput.value.trim();
    const order = parseInt(productOrderInput.value) || 0;

    if (!name || !price) {
        showToast('error', 'Ürün adı ve fiyat zorunludur.');
        return;
    }

    try {
        if (editingProductId) {
            // Update
            await updateDoc(
                doc(db, 'categories', selectedCategoryId, 'products', editingProductId),
                { name, price, description, order }
            );
            showToast('success', `"${name}" güncellendi.`);
        } else {
            // Add new
            const snapshot = await getDocs(collection(db, 'categories', selectedCategoryId, 'products'));
            const newOrder = order || snapshot.size + 1;

            await addDoc(
                collection(db, 'categories', selectedCategoryId, 'products'),
                { name, price, description, order: newOrder, createdAt: serverTimestamp() }
            );
            showToast('success', `"${name}" eklendi.`);
        }

        productModal.classList.remove('show');
    } catch (error) {
        console.error('Ürün kaydetme hatası:', error);
        showToast('error', 'Ürün kaydedilirken hata oluştu.');
    }
});

// ── Delete Product ──
window.adminDeleteProduct = (productId, productName) => {
    showConfirm(
        'Ürünü Sil',
        `"${productName}" ürünü silinecek. Bu işlem geri alınamaz.`,
        async () => {
            try {
                await deleteDoc(doc(db, 'categories', selectedCategoryId, 'products', productId));
                showToast('success', `"${productName}" silindi.`);
            } catch (error) {
                console.error('Ürün silme hatası:', error);
                showToast('error', 'Ürün silinirken hata oluştu.');
            }
        }
    );
};

// ── Modal Close ──
modalClose.addEventListener('click', () => productModal.classList.remove('show'));
productModal.addEventListener('click', (e) => {
    if (e.target === productModal) productModal.classList.remove('show');
});

// ── Confirm Dialog ──
function showConfirm(title, text, onConfirm) {
    confirmTitle.textContent = title;
    confirmText.textContent = text;
    confirmOverlay.classList.add('show');

    const yesHandler = async () => {
        confirmOverlay.classList.remove('show');
        confirmYes.removeEventListener('click', yesHandler);
        confirmNo.removeEventListener('click', noHandler);
        await onConfirm();
    };

    const noHandler = () => {
        confirmOverlay.classList.remove('show');
        confirmYes.removeEventListener('click', yesHandler);
        confirmNo.removeEventListener('click', noHandler);
    };

    confirmYes.addEventListener('click', yesHandler);
    confirmNo.addEventListener('click', noHandler);
}

// ── Toast Notification ──
function showToast(type, message) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${type === 'success' ? '✅' : '❌'}</span>
        <span>${message}</span>
    `;
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(40px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ── Keyboard shortcuts ──
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        productModal.classList.remove('show');
        confirmOverlay.classList.remove('show');
    }
});
