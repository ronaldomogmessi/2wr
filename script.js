document.addEventListener("DOMContentLoaded", () => {
  /* =========================================================================
     1. ПЕРЕКЛЮЧЕНИЕ ТЕМЫ (DARK / LIGHT)
     ========================================================================= */
  const themeBtn = document.getElementById("theme-toggle");
  themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");
    const isLight = document.body.classList.contains("light-theme");
    themeBtn.textContent = isLight ? "Тёмная тема" : "Светлая тема";
  });

  /* =========================================================================
     2. ЭФФЕКТ ПЕЧАТНОЙ МАШИНКИ В ЗАГОЛОВКЕ
     ========================================================================= */
  const phrases = [
    "Автоматическая сборка, проверка и деплой через GitHub Actions.",
    "Инфраструктура как код (IaC) и высокая отказоустойчивость.",
    "Контроль качества кода на каждом коммите в ветку main."
  ];
  const typeEl = document.getElementById("typewriter");
  let phraseIdx = 0;
  let charIdx = 0;
  let deleting = false;

  function tickTypewriter() {
    const current = phrases[phraseIdx];
    typeEl.textContent = current.slice(0, charIdx);

    if (!deleting && charIdx < current.length) {
      charIdx++;
      setTimeout(tickTypewriter, 42);
    } else if (!deleting && charIdx === current.length) {
      deleting = true;
      setTimeout(tickTypewriter, 2200);
    } else if (deleting && charIdx > 0) {
      charIdx--;
      setTimeout(tickTypewriter, 22);
    } else {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      setTimeout(tickTypewriter, 350);
    }
  }
  tickTypewriter();

  /* =========================================================================
     3. ФИЛЬТРАЦИЯ ТЕХНИЧЕСКИХ НАВЫКОВ
     ========================================================================= */
  const filterBtns = document.querySelectorAll(".filter-btn");
  const skillCards = document.querySelectorAll(".skill-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const category = btn.dataset.category;

      skillCards.forEach((card) => {
        if (category === "all" || card.dataset.category === category) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  /* =========================================================================
     4. ВИЗУАЛЬНЫЙ СИМУЛЯТОР CI/CD PIPELINE
     ========================================================================= */
  const stages = [
    { id: "stage-source", name: "Checkout Code", conn: null },
    { id: "stage-lint", name: "Validate & Lint", conn: "conn-1" },
    { id: "stage-build", name: "Upload Artifact", conn: "conn-2" },
    { id: "stage-deploy", name: "Deploy Pages", conn: "conn-3" }
  ];
  const logEl = document.getElementById("pipeline-log");
  const deployCounter = document.getElementById("deploy-counter");
  let pipelineBusy = false;

  function resetStages() {
    stages.forEach((s) => {
      const el = document.getElementById(s.id);
      el.className = "stage-node";
      el.querySelector(".stage-status").textContent = "Ожидание";
      if (s.conn) document.getElementById(s.conn).className = "stage-connector";
    });
  }

  function runPipelineSimulation(shouldFail = false) {
    if (pipelineBusy) return;
    pipelineBusy = true;
    resetStages();

    let step = 0;
    logEl.textContent = "[RUNNER] Инициализация контейнера ubuntu-latest...";

    const interval = setInterval(() => {
      if (step > 0) {
        const prev = stages[step - 1];
        const prevEl = document.getElementById(prev.id);
        prevEl.classList.remove("running");
        prevEl.classList.add("success");
        prevEl.querySelector(".stage-status").textContent = "✓ Успешно";
        if (stages[step] && stages[step].conn) {
          document.getElementById(stages[step].conn).classList.add("active");
        }
      }

      if (shouldFail && step === 1) {
        const failStage = document.getElementById(stages[1].id);
        failStage.classList.remove("running");
        failStage.classList.add("error");
        failStage.querySelector(".stage-status").textContent = "✕ Ошибка";
        logEl.textContent =
          "[ERROR] Проверка не пройдена: синтаксическая ошибка! Публикация на GitHub Pages заблокирована.";
        clearInterval(interval);
        pipelineBusy = false;
        return;
      }

      if (step === stages.length) {
        const count = parseInt(deployCounter.textContent, 10) + 1;
        deployCounter.textContent = String(count);
        const now = new Date().toLocaleTimeString("ru-RU");
        logEl.textContent = `[SUCCESS] Сайт успешно опубликован на GitHub Pages в ${now}! (Деплой #${count})`;
        clearInterval(interval);
        pipelineBusy = false;
        return;
      }

      const curr = stages[step];
      const currEl = document.getElementById(curr.id);
      currEl.classList.add("running");
      currEl.querySelector(".stage-status").textContent = "Выполняется...";
      logEl.textContent = `[STEP ${step + 1}/4] Выполнение этапа "${curr.name}"...`;
      step++;
    }, 650);
  }

  document.getElementById("run-pipeline-btn").addEventListener("click", () => runPipelineSimulation(false));
  document.getElementById("fail-pipeline-btn").addEventListener("click", () => runPipelineSimulation(true));

  /* =========================================================================
     5. ИНТЕРАКТИВНЫЙ DEVOPS-ТЕРМИНАЛ
     ========================================================================= */
  const termOutput = document.getElementById("terminal-output");
  const termForm = document.getElementById("terminal-form");
  const termInput = document.getElementById("terminal-input");

  function printTerminal(cmd, response) {
    if (cmd === "clear") {
      termOutput.innerHTML = "";
      return;
    }
    const lineCmd = document.createElement("div");
    lineCmd.innerHTML = `<span class="term-highlight">runner@cloud:~$</span> ${cmd}`;
    const lineRes = document.createElement("div");
    lineRes.style.color = "#94a3b8";
    lineRes.style.marginBottom = "8px";
    lineRes.textContent = response;
    termOutput.appendChild(lineCmd);
    termOutput.appendChild(lineRes);
    termOutput.scrollTop = termOutput.scrollHeight;
  }

  function handleCommand(raw) {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;

    const commands = {
      help: "Доступные команды: status, whoami, deploy, clear",
      status: "Система: ONLINE | GitHub Pages: Active | Ветка: main | Статус тестов: PASSED",
      whoami: "Cloud & DevOps Инженер — автоматизация CI/CD, Linux, облачная архитектура.",
      deploy: "Запуск симулятора CI/CD Pipeline... Проверьте статус на панели выше!"
    };

    if (cmd === "deploy") {
      runPipelineSimulation(false);
    }

    const reply = commands[cmd] || `Команда "${cmd}" не найдена. Введите help для списка команд.`;
    printTerminal(cmd, reply);
  }

  termForm.addEventListener("submit", (e) => {
    e.preventDefault();
    handleCommand(termInput.value);
    termInput.value = "";
  });

  document.querySelectorAll(".cmd-chip").forEach((chip) => {
    chip.addEventListener("click", () => handleCommand(chip.dataset.cmd));
  });

  /* =========================================================================
     6. 3D НАКЛОН КАРТОЧЕК ПРИ НАВЕДЕНИИ КУРСОРА
     ========================================================================= */
  document.querySelectorAll(".tilt-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      card.style.transform = `perspective(700px) rotateX(${(-y / 22).toFixed(2)}deg) rotateY(${(x / 22).toFixed(2)}deg)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(700px) rotateX(0deg) rotateY(0deg)";
    });
  });

  /* =========================================================================
     7. АНИМИРОВАННЫЙ СЕТЕВОЙ ФОН НА HTML5 CANVAS
     ========================================================================= */
  const canvas = document.getElementById("bg-canvas");
  const ctx = canvas.getContext("2d");
  let nodes = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  for (let i = 0; i < 42; i++) {
    nodes.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.55,
      vy: (Math.random() - 0.5) * 0.55
    });
  }

  function animateBackground() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(56, 189, 248, 0.45)";

    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      a.x += a.vx;
      a.y += a.vy;
      if (a.x < 0 || a.x > canvas.width) a.vx *= -1;
      if (a.y < 0 || a.y > canvas.height) a.vy *= -1;

      ctx.beginPath();
      ctx.arc(a.x, a.y, 2, 0, Math.PI * 2);
      ctx.fill();

      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < 135) {
          ctx.strokeStyle = `rgba(56, 189, 248, ${(1 - dist / 135) * 0.16})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animateBackground);
  }
  animateBackground();
});
