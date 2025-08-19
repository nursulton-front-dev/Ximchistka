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
