// Kembalikan posisi scroll ke paling atas saat halaman dimuat ulang.
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

window.scrollTo(0, 0);

document.addEventListener("DOMContentLoaded", () => {
  // Ambil elemen kontrol musik dan siapkan timer jeda sebelum lagu diulang.
  const music = document.querySelector("#background-music");
  const musicToggle = document.querySelector("#music-toggle");
  let loopDelay;

  // Sinkronkan teks serta status aksesibilitas tombol dengan kondisi musik.
  const updateMusicButton = (isPlaying) => {
    musicToggle.textContent = isPlaying ? "Jeda lagu" : "Putar lagu";
    musicToggle.setAttribute("aria-pressed", String(isPlaying));
  };

  // Memulai musik dan menangani penolakan autoplay dari browser.
  const playMusic = () => {
    music.play().then(() => updateMusicButton(true)).catch(() => {
      updateMusicButton(false);
    });
  };

  // Setelah lagu selesai, musik akan diputar kembali setelah jeda 30 detik.
  music.addEventListener("ended", () => {
    updateMusicButton(false);
    loopDelay = window.setTimeout(() => {
      music.currentTime = 0;
      playMusic();
    }, 30000);
  });

  // Tombol musik berfungsi sebagai kontrol putar dan jeda.
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

  // Putar musik saat halaman selesai dipersiapkan.
  playMusic();

  // Navigasi anchor digerakkan dengan scroll halus dan pembaruan menu aktif.
  const links = document.querySelectorAll('a[href^="#"]');
  const navLinks = document.querySelectorAll(".nav-link");
  // Tandai tautan navigasi yang sedang mewakili section tertentu.
  const setActiveNavLink = (targetId) => {
    navLinks.forEach((navLink) => {
      navLink.classList.toggle("is-active", navLink.getAttribute("href") === targetId);
    });
  };

  // Cegah perpindahan anchor bawaan agar scroll halus dapat digunakan.
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

  // Deteksi section yang sedang terlihat untuk memperbarui menu otomatis.
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

  // Kumpulkan kartu, sumber data profil, dan elemen-elemen modal.
  const cards = document.querySelectorAll(".team-card");
  const mentorProfiles = document.querySelectorAll(".mentor-profile-trigger");
  const revealElements = document.querySelectorAll(
    ".section-heading, .about-copy, .about-image-frame, .mentor-card, .team-card"
  );
  const modal = document.querySelector("#profile-modal");
  const modalPhoto = document.querySelector("#profile-modal-photo");
  const modalName = document.querySelector("#profile-modal-name");
  const modalOrigin = document.querySelector("#profile-modal-origin");
  const modalNpm = document.querySelector("#profile-modal-npm");
  const modalRole = document.querySelector("#profile-modal-role");
  const modalMotto = document.querySelector("#profile-modal-motto");
  const modalHobby = document.querySelector("#profile-modal-hobby");
  const modalDream = document.querySelector("#profile-modal-dream");
  let lastFocusedCard = null;

  // Tutup modal, pulihkan scroll, lalu kembalikan fokus ke elemen sebelumnya.
  const closeModal = () => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");

    if (lastFocusedCard) {
      lastFocusedCard.focus();
    }
  };

  // Isi modal dari data kartu anggota atau tombol profil mentor yang dipilih.
  const openModal = (card) => {
    const isMentorProfile = card.matches(".mentor-profile-trigger");
    const photo = isMentorProfile
      ? card.closest(".mentor-card").querySelector(".portrait-frame img")
      : card.querySelector(".team-photo-frame img");
    const name = isMentorProfile ? card : card.querySelector(".team-info h3");
    const details = isMentorProfile ? [] : card.querySelectorAll(".team-info p");
    const profile = card.dataset;

    modalPhoto.src = photo.getAttribute("src");
    modalPhoto.alt = photo.getAttribute("alt");
    modalName.textContent = name.textContent;
    modalOrigin.textContent = profile.origin || details[0]?.textContent || "Belum diisi";
    modalNpm.textContent = profile.npm || details[1]?.textContent || "Belum diisi";
    modalRole.textContent = profile.role || "Anggota Kelompok 20";
    modalMotto.textContent = profile.motto || "Belum diisi";
    modalHobby.textContent = profile.hobby || "Belum diisi";
    modalDream.textContent = profile.dream || "Belum diisi";
    lastFocusedCard = card;

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    modal.querySelector(".modal-close").focus();
  };

  // Kartu anggota dapat dibuka dengan klik maupun keyboard Enter/Space.
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

  // Aktifkan pembukaan modal untuk tombol profil mentor.
  mentorProfiles.forEach((profile) => {
    profile.setAttribute("aria-haspopup", "dialog");
    profile.addEventListener("click", () => openModal(profile));
  });

  // Semua elemen yang memiliki data-modal-close dapat menutup modal.
  modal.querySelectorAll("[data-modal-close]").forEach((element) => {
    element.addEventListener("click", closeModal);
  });

  // Tombol Escape menyediakan cara cepat untuk menutup modal.
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });

  // Observer ini menambahkan animasi reveal ketika elemen masuk viewport.
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

  // Terapkan animasi reveal pada judul, konten, gambar, dan kartu profil.
  revealElements.forEach((element) => {
    element.classList.add("reveal");
    observer.observe(element);
  });
});
