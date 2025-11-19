const audioButton = document.getElementById("custom-audio-button");
const audio = document.getElementById("custom-audio");
const errorMessage = document.getElementById("error-message");
const buttonText = document.querySelector(".button-text");
const buttonIcon = audioButton.querySelector(".button-icon"); // ВЫНЕСЛИ В ОТДЕЛЬНУЮ ПЕРЕМЕННУЮ

// Обработчик клика
audioButton.addEventListener("click", function (e) {
  e.preventDefault();

  // На iOS сначала нужно запустить аудио через пользовательское действие
  if (audio.paused) {
    audio
      .play()
      .then(() => {
        audioButton.classList.add("playing");
        buttonIcon.textContent = "❚❚"; // ИСПОЛЬЗУЕМ ПЕРЕМЕННУЮ
        buttonText.textContent = "Пауза";
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
    buttonIcon.textContent = "▶"; // ИСПОЛЬЗУЕМ ПЕРЕМЕННУЮ
    buttonText.textContent = "Включите музыку";
  }

  // Небольшая задержка для iOS
  setTimeout(() => {
    audioButton.blur();
  }, 100);
});

// Сброс при окончании
audio.addEventListener("ended", function () {
  audioButton.classList.remove("playing");
  buttonIcon.textContent = "▶"; // ИСПОЛЬЗУЕМ ПЕРЕМЕННУЮ
  buttonText.textContent = "Включите музыку";
});

// Обработка изменения видимости страницы (для паузы при сворачивании)
document.addEventListener("visibilitychange", function () {
  if (document.hidden && !audio.paused) {
    audio.pause();
    audioButton.classList.remove("playing");
    buttonIcon.textContent = "▶"; // ИСПОЛЬЗУЕМ ПЕРЕМЕННУЮ
    buttonText.textContent = "Включите музыку";
  }
});

//---------------------------Добавлена проверка существования элементов (в коде выше это не показано, но рекомендуется добавить):---------------------------------
if (!audioButton || !audio || !errorMessage || !buttonText) {
  console.error("Не все необходимые элементы найдены в DOM");
  return;
}

// ------------------------Добавьте обработку ошибки загрузки аудио:------------------------------------
audio.addEventListener("error", function () {
  errorMessage.textContent = "Ошибка загрузки аудиофайла";
  errorMessage.style.display = "block";
});

//-------------------------------------------------------------
