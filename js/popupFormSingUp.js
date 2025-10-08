document.addEventListener("DOMContentLoaded", function () {
  const popupOverlay = document.getElementById("popupOverlay");
  const openPopupBtn = document.getElementById("openPopup");
  const closePopupBtn = document.getElementById("closePopup");
  const form = document.getElementById("trainingForm");
  const submitBtn = document.getElementById("submitBtn");
  const spinner = document.getElementById("spinner");
  const messageContainer = document.getElementById("messageContainer");

  // Открытие попапа
  openPopupBtn.addEventListener("click", function () {
    popupOverlay.classList.add("active");
    document.body.style.overflow = "hidden"; // Блокируем скролл страницы
  });

  // Закрытие попапа
  function closePopup() {
    popupOverlay.classList.remove("active");
    document.body.style.overflow = ""; // Восстанавливаем скролл
  }

  closePopupBtn.addEventListener("click", closePopup);

  // Закрытие по клику на оверлей
  popupOverlay.addEventListener("click", function (e) {
    if (e.target === popupOverlay) {
      closePopup();
    }
  });

  // Закрытие по Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && popupOverlay.classList.contains("active")) {
      closePopup();
    }
  });

  // Установка минимальной даты (сегодня)
  const dateInput = document.getElementById("date");
  const today = new Date().toISOString().split("T")[0];
  dateInput.min = today;

  // Обработчик отправки формы
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Проверка honeypot поля
    const honeypot = document.getElementById("website").value;
    if (honeypot !== "") {
      // Это бот, не отправляем форму
      showMessage("Произошла ошибка при отправке формы.", "error");
      return;
    }

    // Проверка reCAPTCHA
    const recaptchaResponse = grecaptcha.getResponse();
    if (!recaptchaResponse) {
      showMessage("Пожалуйста, подтвердите, что вы не робот.", "error");
      return;
    }

    // Валидация формы
    if (!validateForm()) {
      return;
    }

    // Показать индикатор загрузки
    setLoadingState(true);

    try {
      // Имитация отправки на сервер
      await submitForm();
      // Показать сообщение об успехе
      showMessage(
        "Спасибо! Ваша заявка принята. Мы свяжемся с вами в ближайшее время для подтверждения записи.",
        "success"
      );

      // Очистить форму
      form.reset();
      grecaptcha.reset();

      // Закрыть попап через 3 секунды после успешной отправки
      setTimeout(() => {
        closePopup();
      }, 3000);
    } catch (error) {
      showMessage(
        "Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз.",
        "error"
      );
    } finally {
      setLoadingState(false);
    }
  });

  // Валидация формы
  function validateForm() {
    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();
    const trainingType = document.getElementById("trainingType").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
    const consent = document.getElementById("consent").checked;

    // Проверка имени
    if (name.length < 2) {
      showMessage("Имя должно содержать минимум 2 символа.", "error");
      return false;
    }

    // Проверка телефона
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(phone)) {
      showMessage("Введите корректный номер телефона.", "error");
      return false;
    }

    // Проверка email (если заполнен)
    if (email && !validateEmail(email)) {
      showMessage("Введите корректный email адрес.", "error");
      return false;
    }

    // Проверка выбора тренировки
    if (!trainingType) {
      showMessage("Пожалуйста, выберите тип тренировки.", "error");
      return false;
    }

    // Проверка даты
    if (!date) {
      showMessage("Пожалуйста, выберите дату тренировки.", "error");
      return false;
    }

    // Проверка времени
    if (!time) {
      showMessage("Пожалуйста, выберите время тренировки.", "error");
      return false;
    }

    // Проверка согласия
    if (!consent) {
      showMessage(
        "Необходимо ваше согласие на обработку персональных данных.",
        "error"
      );
      return false;
    }
    return true;
  }

  // Валидация email
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // Имитация отправки на сервер
  function submitForm() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });
  }

  // Показать/скрыть индикатор загрузки
  function setLoadingState(isLoading) {
    if (isLoading) {
      submitBtn.disabled = true;
      spinner.style.display = "inline-block";
    } else {
      submitBtn.disabled = false;
      spinner.style.display = "none";
    }
  }

  // Показать сообщение
  function showMessage(message, type) {
    messageContainer.textContent = message;
    messageContainer.className = `message ${type}`;
    messageContainer.style.display = "block";

    // Автоматически скрыть сообщение через 5 секунд (кроме ошибок)
    if (type !== "error") {
      setTimeout(() => {
        messageContainer.style.display = "none";
      }, 5000);
    }

    // Прокрутить к сообщению
    messageContainer.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  // Маска для телефона
  const phoneInput = document.getElementById("phone");
  phoneInput.addEventListener("input", function (e) {
    let value = e.target.value.replace(/\D/g, "");

    if (value.length > 0) {
      value = "+7 (" + value;
    }
    if (value.length > 7) {
      value = value.slice(0, 7) + ") " + value.slice(7);
    }
    if (value.length > 12) {
      value = value.slice(0, 12) + "-" + value.slice(12, 14);
    }
    if (value.length > 15) {
      value = value.slice(0, 15) + "-" + value.slice(15, 17);
    }
    e.target.value = value;
  });
});
