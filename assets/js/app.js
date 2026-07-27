// ============================================================
// ACABADOS Y DISEÑOS 1A WEB — app.js (Global JS)
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ── PAGE LOADER ────────────────────────────────────────────
  const loader = document.getElementById('page-loader');
  if (loader) {
    setTimeout(() => loader.classList.add('hidden'), 1600);
  }

  // ── NAVBAR SCROLL ──────────────────────────────────────────
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    });
  }

  // ── HAMBURGER MENU ─────────────────────────────────────────
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.classList.toggle('no-scroll');
    });
    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.classList.remove('no-scroll');
      });
    });
  }

  // ── BACK TO TOP ─────────────────────────────────────────────
  const backTop = document.getElementById('back-to-top');
  if (backTop) {
    window.addEventListener('scroll', () => {
      backTop.classList.toggle('visible', window.scrollY > 400);
    });
    backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // ── AOS SIMPLE (sin librería) ─────────────────────────────
  initAOS();

  // ── ACTIVE NAV LINK ────────────────────────────────────────
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-nav a, .mobile-menu-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPage || href.includes(currentPage.replace('.html', '')))) {
      link.classList.add('active');
    }
  });

  // ── RENDER AUTH STATE IN NAVBAR ────────────────────────────
  renderNavUser();

  // ── CART BADGE ─────────────────────────────────────────────
  CartManager.updateCartBadge();

});

// ── RENDER NAV USER ────────────────────────────────────────
function renderNavUser() {
  const actionsEl = document.getElementById('navbar-actions');
  if (!actionsEl) return;
  const user = Auth.getCurrentUser();
  if (user) {
    const initials = (user.nombre[0] + user.apellido[0]).toUpperCase();
    const isAdmin = user.id_rol === 1;
    actionsEl.innerHTML = `
      <a href="carrito.html" class="nav-icon-btn" title="Carrito">
        <i class="ri-shopping-cart-line"></i>
        <span class="cart-badge">0</span>
      </a>
      <div class="nav-user-menu">
        <div class="nav-user-avatar">${initials}</div>
        <span class="nav-user-name">${user.nombre}</span>
        <i class="ri-arrow-down-s-line" style="color:rgba(255,255,255,0.5);font-size:0.9rem;"></i>
        <div class="nav-dropdown">
          <a href="perfil.html"><i class="ri-user-line"></i> Mi Perfil</a>
          <a href="pedidos.html"><i class="ri-shopping-bag-line"></i> Mis Pedidos</a>
          <a href="historial-compras.html"><i class="ri-history-line"></i> Historial</a>
          <a href="cotizaciones.html"><i class="ri-file-list-line"></i> Cotizaciones</a>
          ${isAdmin ? `<a href="dashboard.html"><i class="ri-dashboard-line"></i> Dashboard Admin</a>` : ''}
          <a href="#" onclick="Auth.logout()"><i class="ri-logout-box-line"></i> Cerrar Sesión</a>
        </div>
      </div>
    `;
    CartManager.updateCartBadge();
  } else {
    actionsEl.innerHTML = `
      <a href="carrito.html" class="nav-icon-btn" title="Carrito">
        <i class="ri-shopping-cart-line"></i>
        <span class="cart-badge">0</span>
      </a>
      <a href="login.html" class="btn-nav-login">
        <i class="ri-user-line"></i> Iniciar Sesión
      </a>
    `;
    CartManager.updateCartBadge();
  }
}

// ── TOAST NOTIFICATION ─────────────────────────────────────
function showToast(message, type = 'success', duration = 3500) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const icons = { success: 'ri-checkbox-circle-fill', danger: 'ri-error-warning-fill', warning: 'ri-alert-fill', info: 'ri-information-fill' };
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<i class="${icons[type] || icons.info}" style="font-size:1.1rem;flex-shrink:0;"></i><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'toastIn 0.3s ease reverse';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ── ADD TO CART ────────────────────────────────────────────
function addToCart(idProducto, cantidad = 1) {
  const producto = MockData.productos.find(p => p.id_producto === idProducto);
  if (!producto) return;
  const stock = Helpers.getProductStock(idProducto);
  if (stock === 0) {
    showToast('Producto agotado', 'danger');
    return;
  }
  CartManager.addItem(producto, cantidad);
  showToast(`"${producto.nombre}" agregado al carrito`, 'success');

  // Animate badge
  const badge = document.querySelector('.cart-badge');
  if (badge) {
    badge.style.transform = 'scale(1.5)';
    setTimeout(() => badge.style.transform = '', 300);
  }
}

// ── AOS SIMPLE (sin librería) ───────────────────────────────
// Reutilizable: hay que volver a llamarla cada vez que se inserta
// contenido nuevo por JS (ej. tarjetas generadas dinámicamente),
// porque esos elementos con [data-aos] no existían cuando se hizo
// el primer escaneo en DOMContentLoaded.
let _aosObserver = null;
function initAOS() {
  if (!_aosObserver) {
    _aosObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const delay = e.target.dataset.aosDelay || 0;
          setTimeout(() => e.target.classList.add('aos-animate'), parseInt(delay));
          _aosObserver.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
  }
  // Solo observamos los elementos que aún no han sido animados
  // ni están siendo observados (evita duplicados).
  document.querySelectorAll('[data-aos]:not(.aos-animate)').forEach(el => {
    if (!el.dataset.aosObserved) {
      el.dataset.aosObserved = '1';
      _aosObserver.observe(el);
    }
  });
}

// ── FORMAT COP ─────────────────────────────────────────────
function formatCOP(value) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value);
}

// ── MODAL HELPERS ──────────────────────────────────────────
function openModal(id) {
  const m = document.getElementById(id);
  if (m) { m.classList.add('active'); document.body.classList.add('no-scroll'); }
}
function closeModal(id) {
  const m = document.getElementById(id);
  if (m) { m.classList.remove('active'); document.body.classList.remove('no-scroll'); }
}
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('active');
    document.body.classList.remove('no-scroll');
  }
  if (e.target.classList.contains('modal-close')) {
    const overlay = e.target.closest('.modal-overlay');
    if (overlay) { overlay.classList.remove('active'); document.body.classList.remove('no-scroll'); }
  }
});

// ── SWIPER INIT HELPERS ────────────────────────────────────
function initHeroSwiper() {
  // Esperar a que el DOM esté listo
  const heroSwiperEl = document.querySelector('.hero-swiper');
  if (!heroSwiperEl) return;

  return new Swiper('.hero-swiper', {
    loop: true,
    autoplay: {
      delay: 4500,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    navigation: {
      nextEl: '.hero-swiper .swiper-button-next',
      prevEl: '.hero-swiper .swiper-button-prev',
    },
    pagination: {
      el: '.hero-swiper .swiper-pagination',
      clickable: true,
      dynamicBullets: true,
    },
    effect: 'slide',
    speed: 800,
    grabCursor: true,
    touchRatio: 1,
    breakpoints: {
      0: {
        navigation: false,   // Móvil: sin flechas
      },
      768: {
        navigation: true,    // Desktop: con flechas
      }
    },
  });
}

function initPromoSwiper() {
  if (typeof Swiper === 'undefined') return;
  return new Swiper('.promo-swiper', {
    loop: true, autoplay: { delay: 5000 },
    slidesPerView: 1, spaceBetween: 24,
    pagination: { el: '.swiper-pagination', clickable: true },
    breakpoints: {
      768: { slidesPerView: 1.2 },
      1024: { slidesPerView: 1.5 }
    }
  });
}

function initProductsSwiper(selector) {
  if (typeof Swiper === 'undefined') return;
  return new Swiper(selector, {
    slidesPerView: 1.2, spaceBetween: 20,
    pagination: { el: '.swiper-pagination', clickable: true },
    navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
    breakpoints: {
      640: { slidesPerView: 2 },
      1024: { slidesPerView: 3.2 },
      1280: { slidesPerView: 4 }
    }
  });
}
