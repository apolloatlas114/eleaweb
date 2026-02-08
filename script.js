const toggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelectorAll(".nav-links a");

if (toggle) {
  toggle.addEventListener("click", () => {
    document.body.classList.toggle("nav-open");
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    document.body.classList.remove("nav-open");
  });
});

const mainSlides = Array.from(document.querySelectorAll(".iso-main-slide"));
const cardSlides = Array.from(document.querySelectorAll(".iso-card-slide"));
const dotButtons = Array.from(document.querySelectorAll(".iso-dots button"));
const mediaBlock = document.querySelector(".iso-media");

const slideCount = Math.min(
  mainSlides.length || 0,
  cardSlides.length || 0,
  dotButtons.length || Math.max(mainSlides.length, cardSlides.length)
);

if (slideCount > 1) {
  let currentSlide = 0;
  let sliderTimer = null;

  const renderSlide = (index) => {
    const next = (index + slideCount) % slideCount;
    currentSlide = next;

    mainSlides.forEach((slide, idx) => {
      slide.classList.toggle("is-active", idx === next);
    });

    cardSlides.forEach((slide, idx) => {
      slide.classList.toggle("is-active", idx === next);
    });

    dotButtons.forEach((dot, idx) => {
      dot.classList.toggle("active", idx === next);
    });
  };

  const stopSlider = () => {
    if (!sliderTimer) return;
    clearInterval(sliderTimer);
    sliderTimer = null;
  };

  const startSlider = () => {
    stopSlider();
    sliderTimer = setInterval(() => {
      renderSlide(currentSlide + 1);
    }, 3400);
  };

  dotButtons.forEach((dot, idx) => {
    dot.addEventListener("click", () => {
      renderSlide(idx);
      startSlider();
    });
  });

  if (mediaBlock) {
    mediaBlock.addEventListener("mouseenter", stopSlider);
    mediaBlock.addEventListener("mouseleave", startSlider);
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopSlider();
      return;
    }
    startSlider();
  });

  renderSlide(0);
  startSlider();
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  document.querySelectorAll("[data-reveal]").forEach((node) => {
    node.classList.add("reveal");
    observer.observe(node);
  });
}

const legalOpenButtons = document.querySelectorAll("[data-open-modal]");
const legalCloseButtons = document.querySelectorAll("[data-close-modal]");
const legalModals = document.querySelectorAll(".legal-modal");

const closeLegalModal = (modal) => {
  if (!modal) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");

  const hasOpenModal = Array.from(legalModals).some((entry) =>
    entry.classList.contains("is-open")
  );
  if (!hasOpenModal) {
    document.body.classList.remove("modal-open");
  }
};

const openLegalModal = (modalId) => {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  legalModals.forEach((entry) => closeLegalModal(entry));
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  const closeBtn = modal.querySelector(".legal-close");
  if (closeBtn) {
    closeBtn.focus();
  }
};

legalOpenButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    const targetModal = button.getAttribute("data-open-modal");
    if (!targetModal) return;
    openLegalModal(targetModal);
  });
});

legalCloseButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const modal = button.closest(".legal-modal");
    closeLegalModal(modal);
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  legalModals.forEach((modal) => {
    if (modal.classList.contains("is-open")) {
      closeLegalModal(modal);
    }
  });
});

const featureStack = document.querySelector(".iso-feature-hover");
const featureStackTrigger = document.querySelector(".iso-feature-trigger");
const featureStackMobileMq = window.matchMedia("(max-width: 767px)");

const closeFeatureStack = () => {
  if (!featureStack || !featureStackTrigger) return;
  featureStack.classList.remove("is-open");
  featureStackTrigger.setAttribute("aria-expanded", "false");
};

if (featureStack && featureStackTrigger) {
  const toggleFeatureStack = () => {
    const willOpen = !featureStack.classList.contains("is-open");
    featureStack.classList.toggle("is-open", willOpen);
    featureStackTrigger.setAttribute("aria-expanded", willOpen ? "true" : "false");
  };

  featureStackTrigger.addEventListener("click", (event) => {
    if (!featureStackMobileMq.matches) return;
    event.preventDefault();
    event.stopPropagation();
    toggleFeatureStack();
  });

  featureStackTrigger.addEventListener("keydown", (event) => {
    if (!featureStackMobileMq.matches) return;
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    toggleFeatureStack();
  });

  document.addEventListener("click", (event) => {
    if (!featureStackMobileMq.matches) return;
    if (!featureStack.contains(event.target)) {
      closeFeatureStack();
    }
  });

  window.addEventListener("resize", () => {
    if (!featureStackMobileMq.matches) {
      closeFeatureStack();
    }
  });
}

const thesisFeatureLinks = Array.from(
  document.querySelectorAll(".thesis-feature-link")
);
const thesisFeaturePanels = Array.from(
  document.querySelectorAll(".thesis-feature-panel")
);

if (thesisFeatureLinks.length && thesisFeaturePanels.length) {
  const activateThesisFeature = (featureId) => {
    thesisFeatureLinks.forEach((link) => {
      const isActive = link.dataset.featureTarget === featureId;
      link.classList.toggle("is-active", isActive);
      link.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    thesisFeaturePanels.forEach((panel) => {
      const isActive = panel.dataset.featurePanel === featureId;
      panel.classList.toggle("is-active", isActive);
    });
  };

  thesisFeatureLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const targetId = link.dataset.featureTarget;
      if (!targetId) return;
      activateThesisFeature(targetId);
    });
  });

  const initialFeature =
    thesisFeatureLinks.find((link) => link.classList.contains("is-active"))
      ?.dataset.featureTarget || thesisFeatureLinks[0].dataset.featureTarget;

  if (initialFeature) {
    activateThesisFeature(initialFeature);
  }
}
