document.addEventListener("DOMContentLoaded", () => {
  const themeToggleBtn = document.getElementById("theme-toggle");
  const statusBtn = document.getElementById("status-btn");
  const statusOutput = document.getElementById("status-output");

  // 1. Переключение светлой и тёмной темы
  themeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
    const isDark = document.body.classList.contains("dark-theme");
    themeToggleBtn.textContent = isDark ? "Светлая тема" : "Тёмная тема";
  });

  // 2. Интерактивная проверка работы скрипта
  statusBtn.addEventListener("click", () => {
    const now = new Date().toLocaleTimeString("ru-RU");
    statusOutput.textContent = `Система работает штатно! Сайт успешно загружен (время проверки: ${now}).`;
  });
});
