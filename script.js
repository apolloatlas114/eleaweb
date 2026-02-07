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
