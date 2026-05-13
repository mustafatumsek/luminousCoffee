// ===================================================================
// Luminous Coffee — Dynamic Menu Page
// Fetches categories & products from Firestore and renders them
// ===================================================================

import {
    db, collection, getDocs, onSnapshot, query, orderBy
} from './firebase-config.js';

// ── DOM References ──
const menuNav = document.getElementById('menu-nav-inner');
const menuContent = document.getElementById('menu-content');
const menuSkeleton = document.getElementById('menu-skeleton');

// ── State ──
let categories = [];
let activeTab = null;

// ── Initialize ──
document.addEventListener('DOMContentLoaded', () => {
    loadMenu();
});

// ── Load Menu from Firestore (Realtime) ──
async function loadMenu() {
    try {
        // Get categories with ordering
        const catQuery = query(collection(db, 'categories'), orderBy('order', 'asc'));

        onSnapshot(catQuery, async (snapshot) => {
            categories = [];

            for (const catDoc of snapshot.docs) {
                const catData = { id: catDoc.id, ...catDoc.data(), products: [] };

                // Get products for this category
                const prodQuery = query(
                    collection(db, 'categories', catDoc.id, 'products'),
                    orderBy('order', 'asc')
                );
                const prodSnapshot = await getDocs(prodQuery);
                catData.products = prodSnapshot.docs.map(d => ({ id: d.id, ...d.data() }));

                categories.push(catData);
            }

            renderMenu();
        });

    } catch (error) {
        console.error('Menü yüklenirken hata:', error);
        showError();
    }
}

// ── Render Menu ──
function renderMenu() {
    // Hide skeleton
    if (menuSkeleton) menuSkeleton.style.display = 'none';

    if (categories.length === 0) {
        menuContent.innerHTML = `
            <div style="text-align: center; padding: 4rem 1rem; color: var(--clr-text-muted);">
                <p style="font-size: 1.1rem;">Menü henüz yüklenmedi.</p>
            </div>
        `;
        menuNav.innerHTML = '';
        return;
    }

    // Render tabs
    menuNav.innerHTML = categories.map((cat, i) => `
        <button class="menu-nav-tab ${i === 0 ? 'active' : ''}" 
                data-target="cat-${cat.id}"
                id="tab-${cat.id}">
            ${cat.name}
        </button>
    `).join('');

    // Render categories & products
    menuContent.innerHTML = categories.map(cat => `
        <section class="menu-category" id="cat-${cat.id}">
            <div class="category-header">
                <h2 class="category-name">${cat.name}</h2>
            </div>
            ${cat.products.length > 0 ? cat.products.map(product => `
                <div class="menu-item">
                    <div class="item-info">
                        <div class="item-name">${product.name}</div>
                        ${product.description ? `<div class="item-description">${product.description}</div>` : ''}
                    </div>
                    <div class="item-price">${product.price}</div>
                </div>
            `).join('') : `
                <div class="menu-item" style="justify-content: center; color: var(--clr-text-muted); font-style: italic;">
                    Bu kategoride henüz ürün bulunmamaktadır.
                </div>
            `}
        </section>
    `).join('') + `
        <div class="allergen-notice">
            <span class="leaf-icon">🌿</span>
            <p>Menümüzde yer alan yiyecek ve içecekler; Süt ürünleri, Gluten, Kuruyemiş ve çeşitli alerjenleri içerebilir. Herhangi bir gıda alerjiniz ya da özel bir hassasiyetiniz varsa, lütfen sipariş vermeden önce ekibimizi bilgilendirin.</p>
        </div>
    `;

    // Setup tab navigation
    setupTabs();
    setupScrollSpy();
}

// ── Tab Navigation ──
function setupTabs() {
    const tabs = menuNav.querySelectorAll('.menu-nav-tab');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.dataset.target;
            const targetSection = document.getElementById(targetId);
            if (!targetSection) return;

            // Scroll to section
            const navHeight = document.querySelector('.menu-nav')?.offsetHeight || 0;
            const headerHeight = document.querySelector('.menu-header')?.offsetHeight || 0;
            const top = targetSection.getBoundingClientRect().top + window.scrollY - navHeight - 10;

            window.scrollTo({ top, behavior: 'smooth' });

            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Scroll tab into view
            tab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        });
    });
}

// ── Scroll Spy for Tabs ──
function setupScrollSpy() {
    const sections = document.querySelectorAll('.menu-category');
    const tabs = menuNav.querySelectorAll('.menu-nav-tab');
    const navEl = document.querySelector('.menu-nav');

    if (!sections.length || !tabs.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                tabs.forEach(tab => {
                    tab.classList.toggle('active', tab.dataset.target === id);
                    if (tab.dataset.target === id) {
                        tab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                    }
                });
            }
        });
    }, {
        rootMargin: `-${(navEl?.offsetHeight || 60) + 20}px 0px -60% 0px`,
        threshold: 0
    });

    sections.forEach(s => observer.observe(s));
}

// ── Error State ──
function showError() {
    if (menuSkeleton) menuSkeleton.style.display = 'none';
    menuContent.innerHTML = `
        <div style="text-align: center; padding: 4rem 1rem; color: var(--clr-text-muted);">
            <p style="font-size: 2rem; margin-bottom: 1rem;">☕</p>
            <p style="font-size: 1.1rem;">Menü yüklenirken bir hata oluştu.</p>
            <p style="font-size: 0.9rem; margin-top: 0.5rem;">Lütfen sayfayı yenileyin.</p>
        </div>
    `;
}
