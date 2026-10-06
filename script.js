if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

window.scrollTo(0, 0);

document.addEventListener("DOMContentLoaded", () => {
  const music = document.querySelector("#background-music");
  const musicToggle = document.querySelector("#music-toggle");
  let loopDelay;

  const updateMusicButton = (isPlaying) => {
    musicToggle.textContent = isPlaying ? "Jeda lagu" : "Putar lagu";
    musicToggle.setAttribute("aria-pressed", String(isPlaying));
  };

  const playMusic = () => {
    music.play().then(() => updateMusicButton(true)).catch(() => {
      updateMusicButton(false);
    });
  };

  music.addEventListener("ended", () => {
    updateMusicButton(false);
    loopDelay = window.setTimeout(() => {
      music.currentTime = 0;
      playMusic();
    }, 30000);
  });

  musicToggle.addEventListener("click", () => {
    if (music.paused) {
      window.clearTimeout(loopDelay);
      playMusic();
    } else {
      music.pause();
      music.currentTime = 0;
      window.clearTimeout(loopDelay);
      updateMusicButton(false);
    }
  });

  playMusic();

  const links = document.querySelectorAll('a[href^="#"]');
  const navLinks = document.querySelectorAll(".nav-link");
  const setActiveNavLink = (targetId) => {
    navLinks.forEach((navLink) => {
      navLink.classList.toggle("is-active", navLink.getAttribute("href") === targetId);
    });
  };

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") {
        return;
      }

      const target = document.querySelector(targetId);

      if (!target) {
        return;
      }

      event.preventDefault();
  setActiveNavLink(targetId);

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  });

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveNavLink(`#${entry.target.id}`);
        }
      });
    },
    {
      rootMargin: "-35% 0px -55%"
    }
  );

  navLinks.forEach((navLink) => {
    const target = document.querySelector(navLink.getAttribute("href"));

    if (target) {
      sectionObserver.observe(target);
    }
  });

  const cards = document.querySelectorAll(".team-card");
  const revealElements = document.querySelectorAll(
    ".section-heading, .about-copy, .about-image-frame, .mentor-card, .team-card"
  );
  const modal = document.querySelector("#profile-modal");
  const modalPhoto = document.querySelector("#profile-modal-photo");
  const modalName = document.querySelector("#profile-modal-name");
  const modalOrigin = document.querySelector("#profile-modal-origin");
  const modalNpm = document.querySelector("#profile-modal-npm");
  let lastFocusedCard = null;

  const closeModal = () => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");

    if (lastFocusedCard) {
      lastFocusedCard.focus();
    }
  };

  const openModal = (card) => {
    const photo = card.querySelector(".team-photo-frame img");
    const name = card.querySelector(".team-info h3");
    const details = card.querySelectorAll(".team-info p");

    modalPhoto.src = photo.getAttribute("src");
    modalPhoto.alt = photo.getAttribute("alt");
    modalName.textContent = name.textContent;
    modalOrigin.textContent = details[0]?.textContent || "Belum diisi";
    modalNpm.textContent = details[1]?.textContent || "Belum diisi";
    lastFocusedCard = card;

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    modal.querySelector(".modal-close").focus();
  };

  cards.forEach((card) => {
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.addEventListener("click", () => openModal(card));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openModal(card);
      }
    });
  });

  modal.querySelectorAll("[data-modal-close]").forEach((element) => {
    element.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12
    }
  );

  revealElements.forEach((element) => {
    element.classList.add("reveal");
    observer.observe(element);
  });
});
