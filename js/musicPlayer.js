const audioButton = document.getElementById("custom-audio-button");
const audio = document.getElementById("custom-audio");
const errorMessage = document.getElementById("error-message");
const buttonText = document.querySelector(".button-text");

// Обработчик клика
audioButton.addEventListener("click", function (e) {
  e.preventDefault();

  // На iOS сначала нужно запустить аудио через пользовательское действие
  if (audio.paused) {
    audio
      .play()
      .then(() => {
        audioButton.classList.add("playing");
        audioButton.querySelector(".button-icon").textContent = "❚❚";
        buttonText.textContent = "Пауза"; // Изменяем текст на "пауза"
        errorMessage.style.display = "none";
      })
      .catch((e) => {
        errorMessage.textContent =
          "Ошибка воспроизведения. Нажмите ещё раз или проверьте настройки звука.";
        if (e.message.includes("user gesture")) {
          errorMessage.textContent += " Пожалуйста, нажмите кнопку ещё раз.";
        }
        errorMessage.style.display = "block";
        console.error("Audio play error:", e);
      });
  } else {
    audio.pause();
    audioButton.classList.remove("playing");
    audioButton.querySelector(".button-icon").textContent = "▶";
    buttonText.textContent = "Включите музыку"; // Возвращаем исходный текст
  }

  // Небольшая задержка для iOS
  setTimeout(() => {
    audioButton.blur();
  }, 100);
});

// Сброс при окончании
audio.addEventListener("ended", function () {
  audioButton.classList.remove("playing");
  audioButton.querySelector(".button-icon").textContent = "▶";
  buttonText.textContent = "Включите музыку"; // Возвращаем исходный текст
});

// Обработка изменения видимости страницы (для паузы при сворачивании)
document.addEventListener("visibilitychange", function () {
  if (document.hidden && !audio.paused) {
    audio.pause();
    audioButton.classList.remove("playing");
    audioButton.querySelector(".button-icon").textContent = "▶";
    buttonText.textContent = "Включите музыку"; // Возвращаем исходный текст
  }
});
