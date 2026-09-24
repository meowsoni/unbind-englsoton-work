(() => {
  "use strict";

  const topbar = document.querySelector("[data-topbar]");

  // Topbar

  if (topbar) {
    let last = window.scrollY;

    addEventListener(
      "scroll",
      () => {
        const y = Math.max(0, window.scrollY);
        if (Math.abs(y - last) < 6) return;
        topbar.classList.toggle("is-hidden", y > last && y > topbar.offsetHeight);
        last = y;
      },
      { passive: true }
    );
  }

  // Article title in the topbar

  const articleHead = document.querySelector("[data-article-head]");

  if (topbar && articleHead && "IntersectionObserver" in window) {
    const title = articleHead.querySelector(".article-title") || articleHead;
    new IntersectionObserver(
      ([entry]) => {
        const scrolledPast =
          !entry.isIntersecting && entry.boundingClientRect.top < 0;
        topbar.classList.toggle("is-titled", scrolledPast);
      },
      { threshold: 0 }
    ).observe(title);
  }

  // Subscribe and follow

  document.querySelectorAll("[data-toggle]").forEach((button) => {
    const off = button.querySelector(".btn-label").textContent;
    const on = button.dataset.labelOn;

    button.addEventListener("click", () => {
      const pressed = button.getAttribute("aria-pressed") === "true";
      button.setAttribute("aria-pressed", String(!pressed));
      button.querySelector(".btn-label").textContent = pressed ? off : on;
    });
  });

  // Reading progress

  const progress = document.querySelector("[data-progress]");
  const article = document.querySelector(".article");

  if (progress && article) {
    let queued = false;

    const update = () => {
      queued = false;
      const start = article.offsetTop;
      const distance = article.offsetHeight - window.innerHeight;
      const read = distance > 0 ? (window.scrollY - start) / distance : 1;
      progress.style.setProperty("--progress", Math.min(1, Math.max(0, read)));
    };

    const schedule = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(update);
    };

    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    update();
  }

  // Footnote previews

  const coins = document.querySelectorAll(".coin");

  if (coins.length) {
    const tip = document.createElement("div");
    tip.className = "note-tip";
    tip.setAttribute("role", "tooltip");
    document.body.append(tip);

    let hideTimer;

    const show = (coin) => {
      clearTimeout(hideTimer);
      const note = document.getElementById(coin.dataset.note);
      if (!note) return;

      tip.innerHTML = note.innerHTML;
      tip.querySelectorAll(".footnote-backref").forEach((el) => el.remove());
      tip.classList.add("is-open");
      coin.classList.add("is-lit");

      const rect = coin.getBoundingClientRect();
      const width = tip.offsetWidth;
      const margin = 12;
      const left = Math.min(
        Math.max(margin, rect.left + rect.width / 2 - width / 2),
        document.documentElement.clientWidth - width - margin
      );
      const above = rect.bottom + tip.offsetHeight + margin > window.innerHeight;

      tip.style.left = `${left + window.scrollX}px`;
      tip.style.top = above
        ? `${rect.top + window.scrollY - tip.offsetHeight - 8}px`
        : `${rect.bottom + window.scrollY + 8}px`;
    };

    const hide = (coin) => {
      hideTimer = setTimeout(() => {
        tip.classList.remove("is-open");
        coin.classList.remove("is-lit");
      }, 90);
    };

    coins.forEach((coin) => {
      coin.addEventListener("pointerenter", () => show(coin));
      coin.addEventListener("pointerleave", () => hide(coin));
      coin.addEventListener("focus", () => show(coin));
      coin.addEventListener("blur", () => hide(coin));
    });

    tip.addEventListener("pointerenter", () => clearTimeout(hideTimer));
  }

  // Hovercards

  document.querySelectorAll(".ava-wrap").forEach((wrap) => {
    const card = wrap.querySelector(".hovercard");
    if (!card) return;

    const place = () => {
      card.classList.remove("flip-left");
      const { right } = card.getBoundingClientRect();
      if (right > document.documentElement.clientWidth - 8) {
        card.classList.add("flip-left");
      }
    };

    wrap.addEventListener("pointerenter", place);
    wrap.addEventListener("focusin", place);
  });
})();
