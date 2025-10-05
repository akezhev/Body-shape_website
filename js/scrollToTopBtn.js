const scrollToTopBtn = document.getElementById("scrollToTopBtn");

// Показываем/скрываем кнопку при прокрутке
window.addEventListener("scroll", function () {
  if (window.scrollY > 300) {
    scrollToTopBtn.classList.add("show");
  } else {
    scrollToTopBtn.classList.remove("show");
  }
});

// Плавная прокрутка при клике
scrollToTopBtn.addEventListener("click", function () {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});
