// script.js — обновлённый
document.addEventListener("DOMContentLoaded", function () {
  /* ======= Переключение мобильного меню ======= */
  const burger = document.getElementById("burger-menu");
  const mobileMenu = document.getElementById("mobile-menu");
  const closeMobileBtn = document.getElementById("close-mobile-menu");

  if (burger) {
    burger.addEventListener("click", () => {
      mobileMenu.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  }

  if (closeMobileBtn) {
    closeMobileBtn.addEventListener("click", () => {
      mobileMenu.classList.remove("active");
      document.body.style.overflow = "";
    });
  }

  // Закрывать мобильное меню по клику на ссылку внутри (удобно для SPA)
  mobileMenu.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      mobileMenu.classList.remove("active");
      document.body.style.overflow = "";
    });
  });

  /* ======= Модалка: открыть / закрыть и запрет фонового скролла ======= */
  const modal = document.getElementById("modal");
  const modalClose = document.getElementById("close-modal");
  const modalForm = document.getElementById("modal-form");

  // любой элемент с классом .order-btn открывает модал
  document
    .querySelectorAll(
      ".order-btn, #hero-order-btn, #header-order-btn, #mobile-order-btn"
    )
    .forEach((btn) => {
      if (!btn) return;
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        openModal();
      });
    });

  function openModal() {
    if (!modal) return;
    modal.classList.add("active");
    // запрет фоновой прокрутки
    document.body.style.overflow = "hidden";
    // при открытии ставим фокус на первый инпут (если есть)
    const firstInput = modal.querySelector("input, textarea, button");
    if (firstInput) firstInput.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }

  if (modalClose) {
    modalClose.addEventListener("click", closeModal);
  }

  // закрытие при клике вне .modal-content
  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      closeModal();
    }
  });

  // ESC для закрытия
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      if (modal && modal.classList.contains("active")) {
        closeModal();
      }
      if (mobileMenu && mobileMenu.classList.contains("active")) {
        mobileMenu.classList.remove("active");
        document.body.style.overflow = "";
      }
    }
  });

  // предотвращаем отправку формы (пример)
  if (modalForm) {
    modalForm.addEventListener("submit", function (e) {
      e.preventDefault();
      // здесь можно отправлять через fetch/ajax
      // после успешной отправки можно закрыть модал:
      // closeModal();
      alert("Форма отправлена (пример).");
    });
  }

  /* ======= Скрытие хедера при скролле вниз, показать при скролле вверх ======= */
  const header = document.getElementById("header");
  let lastScroll = window.pageYOffset || document.documentElement.scrollTop;
  let ticking = false;

  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          handleHeaderOnScroll();
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true }
  );

  function handleHeaderOnScroll() {
    const currentScroll =
      window.pageYOffset || document.documentElement.scrollTop;
    const delta = 10; // порог для срабатывания
    const hideAfter = 80; // не скрываем хедер при маленьких скроллах сверху

    if (!header) {
      lastScroll = currentScroll;
      return;
    }

    // если прокручено меньше чем hideAfter — всегда показываем хедер
    if (currentScroll <= hideAfter) {
      header.classList.remove("hidden");
      header.classList.remove("scrolled");
      lastScroll = currentScroll;
      return;
    }

    // прячем при прокрутке вниз
    if (currentScroll - lastScroll > delta) {
      header.classList.add("hidden");
    } else if (lastScroll - currentScroll > delta) {
      // показываем при прокрутке вверх
      header.classList.remove("hidden");
      header.classList.add("scrolled");
    }

    lastScroll = currentScroll;
  }

  /* ======= Мелкие улучшения UX ======= */
  // Убираем возможный конфликт, если модалка открывалась до загрузки скрипта:
  if (modal && modal.classList.contains("active")) {
    document.body.style.overflow = "hidden";
  }
});
document
  .getElementById("learn-more-btn")
  .addEventListener("click", function () {
    document.getElementById("about").scrollIntoView({ behavior: "smooth" });
  });
// ===== Подсветка активного пункта меню =====
const navLinks = Array.from(
  document.querySelectorAll(".main-nav a, .mobile-menu a")
);
const headerEl = document.getElementById("header");
const getHeaderHeight = () => (headerEl ? headerEl.offsetHeight : 0);

// Секции на странице
const sections = Array.from(document.querySelectorAll("section[id]"));

function clearActive() {
  navLinks.forEach((l) => l.classList.remove("active"));
}

function setActiveById(id) {
  clearActive();
  navLinks.forEach((link) => {
    if (link.getAttribute("href") === `#${id}`) {
      link.classList.add("active");
    }
  });
}

function smoothScrollToId(id) {
  const target = document.getElementById(id);
  if (!target) return;
  const top =
    target.getBoundingClientRect().top +
    window.scrollY -
    (getHeaderHeight() + 10);
  window.scrollTo({ top, behavior: "smooth" });
}

// Обработчики кликов по пунктам меню
navLinks.forEach((link) => {
  const href = link.getAttribute("href");
  if (href && href.startsWith("#")) {
    const id = href.slice(1);
    link.addEventListener("click", (e) => {
      e.preventDefault();
      // Закрываем мобильное меню, если открыто
      if (mobileMenu.classList.contains("open")) {
        mobileMenu.classList.remove("open");
        document.body.classList.remove("no-scroll");
      }
      setActiveById(id);
      smoothScrollToId(id);
      history.pushState(null, "", `#${id}`);
    });
  }
});

// Следим за активной секцией при скролле
let currentActiveId = null;
const observer = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((en) => en.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

    if (visible.length > 0) {
      const id = visible[0].target.id;
      if (id !== currentActiveId) {
        currentActiveId = id;
        setActiveById(id);
      }
    }
  },
  {
    root: null,
    rootMargin: `-${getHeaderHeight() + 20}px 0px -50% 0px`,
    threshold: Array.from({ length: 11 }, (_, i) => i / 10),
  }
);

sections.forEach((sec) => observer.observe(sec));

// Подсветка при загрузке
window.addEventListener("load", () => {
  const id = (location.hash || "#hero").slice(1);
  if (document.getElementById(id)) {
    setActiveById(id);
    if (location.hash) {
      setTimeout(() => smoothScrollToId(id), 0);
    }
  } else {
    setActiveById(sections[0]?.id || "hero");
  }
});
