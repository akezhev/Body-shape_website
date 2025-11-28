document.addEventListener("DOMContentLoaded", function () {
  const audioButton = document.getElementById("custom-audio-button");
  const audio = document.getElementById("custom-audio");
  const errorMessage = document.getElementById("error-message");
  const loadingMessage = document.getElementById("loading-message");
  const buttonText = document.querySelector(".button-text");
  const buttonIcon = document.querySelector(".button-icon");

  // Проверка существования элементов
  if (
    !audioButton ||
    !audio ||
    !errorMessage ||
    !loadingMessage ||
    !buttonText ||
    !buttonIcon
  ) {
    console.error("Не все необходимые элементы найдены в DOM");
    return;
  }

  let audioInitialized = false;
  let isPlaying = false;

  // Функция для показа ошибки
  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
    loadingMessage.style.display = "none";
    audioButton.classList.remove("loading");
  }

  // Функция для показа загрузки
  function showLoading() {
    loadingMessage.style.display = "block";
    errorMessage.style.display = "none";
    audioButton.classList.add("loading");
  }

  // Функция для скрытия сообщений
  function hideMessages() {
    loadingMessage.style.display = "none";
    errorMessage.style.display = "none";
    audioButton.classList.remove("loading");
  }

  // Функция воспроизведения
  function playAudio() {
    showLoading();

    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          hideMessages();
          audioButton.classList.add("playing");
          buttonIcon.textContent = "❚❚";
          buttonText.textContent = "Пауза";
          isPlaying = true;
        })
        .catch((error) => {
          console.error("Ошибка воспроизведения:", error);
          showError(
            "Ошибка воспроизведения. Нажмите ещё раз или проверьте настройки звука."
          );
          isPlaying = false;
        });
    }
  }

  // Функция паузы
  function pauseAudio() {
    audio.pause();
    audioButton.classList.remove("playing");
    buttonIcon.textContent = "▶";
    buttonText.textContent = "Включите музыку";
    isPlaying = false;
    hideMessages();
  }

  // Обработчик клика
  audioButton.addEventListener("click", function (e) {
    e.preventDefault();

    // Инициализация аудио при первом клике
    if (!audioInitialized) {
      audioInitialized = true;
      audio.load();

      // Небольшая задержка для загрузки
      setTimeout(() => {
        playAudio();
      }, 100);
      return;
    }

    if (!isPlaying) {
      playAudio();
    } else {
      pauseAudio();
    }

    // Небольшая задержка для iOS
    setTimeout(() => {
      audioButton.blur();
    }, 100);
  });

  // Событие когда аудио готово к воспроизведению
  audio.addEventListener("canplaythrough", function () {
    hideMessages();
  });

  // Сброс при окончании
  audio.addEventListener("ended", function () {
    pauseAudio();
  });

  // Обработка ошибки загрузки аудио
  audio.addEventListener("error", function () {
    console.error("Ошибка загрузки аудио:", audio.error);
    showError("Ошибка загрузки аудиофайла. Проверьте путь к файлу.");
  });

  // Обработка изменения видимости страницы (для паузы при сворачивании)
  document.addEventListener("visibilitychange", function () {
    if (document.hidden && isPlaying) {
      pauseAudio();
    }
  });

  // Обработка потери фокуса страницей
  window.addEventListener("blur", function () {
    if (isPlaying) {
      pauseAudio();
    }
  });

  // Предзагрузка аудио при загрузке страницы (опционально)
  window.addEventListener("load", function () {
    // Можно раскомментировать для предзагрузки
    // audio.load();
  });
});
