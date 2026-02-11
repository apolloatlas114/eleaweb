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

const orbitRoot = document.querySelector("[data-elea-orbit]");
const orbitViewport = document.querySelector("[data-elea-orbit-viewport]");
const orbitCanvas = document.querySelector("[data-elea-orbit-canvas]");
const orbitNodeLayer = document.querySelector("[data-elea-orbit-nodes]");
const orbitLanes = document.querySelector("[data-elea-orbit-lanes]");
const orbitCenter = document.querySelector("[data-elea-orbit-center]");
const orbitCardTitle = document.querySelector("[data-elea-orbit-title-card]");
const orbitCardDescription = document.querySelector("[data-elea-orbit-description]");
const orbitZoomIn = document.querySelector("[data-orbit-zoom-in]");
const orbitZoomOut = document.querySelector("[data-orbit-zoom-out]");
const orbitFit = document.querySelector("[data-orbit-fit]");

if (
  orbitRoot &&
  orbitViewport &&
  orbitCanvas &&
  orbitNodeLayer &&
  orbitLanes &&
  orbitCenter &&
  orbitCardTitle &&
  orbitCardDescription &&
  orbitZoomIn &&
  orbitZoomOut &&
  orbitFit
) {
  const orbitFeatures = [
    {
      id: "status-check",
      label: "Status Check",
      description:
        "5-Fragen-Einstufungstest, der deinen aktuellen Stand bewertet und dir inkl. Begruendung einen passenden Plan (free, study, basic, pro) empfiehlt.",
    },
    {
      id: "frag-elea",
      label: "Frag Elea",
      description:
        "Du stellst Fragen per Text oder Mikrofon und bekommst eine einfache Erklaerung mit Beispielen und naechsten Schritten; daraus kannst du direkt Aufgaben und Lernlabor-Quiz erzeugen.",
    },
    {
      id: "elea-lernlabor",
      label: "Elea Lernlabor",
      description:
        "PDF hochladen, Lern-Sheet erhalten, Thema strukturiert lernen und in Quiz-Leveln (easy, medium, hard) mit Timer und Feedback trainieren.",
    },
    {
      id: "academia",
      label: "Academia",
      description:
        "Zentraler Bereich fuer Methodenwissen/Vorlagen als Download-Bibliothek (aktuell als Elea-Academia-Ordner im Dashboard).",
    },
    {
      id: "notehub",
      label: "Notehub",
      description:
        "Notizen mit Prioritaet, Tags sowie Verknuepfung zu Dokumenten/Aufgaben; inklusive Sprach-Input und Live-Sync.",
    },
    {
      id: "smartsearch",
      label: "Smartsearch",
      description:
        "Schnellsuche ueber Dokumente, Aufgaben und Notizen mit direkten Spruengen in den passenden Bereich.",
    },
    {
      id: "dokumente-upload",
      label: "Dokumente Upload",
      description:
        "Mehrfach-Upload fuer PDF/DOC/DOCX, inkl. Such-/Filterfunktionen, Duplikatvermeidung und Dokument-Analytics.",
    },
    {
      id: "countdown",
      label: "Countdown",
      description:
        "Laufender Abgabe-Countdown (Tage/Stunden/Minuten/Sekunden), damit dein Zeitdruck jederzeit sichtbar bleibt.",
    },
    {
      id: "mental-health-checker",
      label: "Mental Health Checker",
      description:
        "Stress-Level tracken, taeglich speichern, 7-Tage-Verlauf und Fruehwarnung bei anhaltend hoher Belastung.",
    },
    {
      id: "fortschrittsanzeige",
      label: "Fortschrittsanzeige",
      description:
        "Fortschritt in % aus Status, Quiz, Uploads, Checklisten, Aufgabenrhythmus, Plan und Stressfaktor.",
    },
    {
      id: "risiko-checker",
      label: "Risiko Checker",
      description:
        "Risiko-Level (niedrig/mittel/hoch) auf Basis von Fortschritt, verbleibender Zeit, Stress und Betreuungsstatus.",
    },
    {
      id: "aufgaben-setzen",
      label: "Aufgaben setzen",
      description:
        "Priorisierte Aufgaben mit Deadline, Beschreibung und Dokument-Link erstellen, filtern und als erledigt markieren.",
    },
    {
      id: "elea-school",
      label: "Elea School",
      description:
        "Modulbasierte Video-Lernumgebung mit Lektionen, Fortschrittsstand und geraeteuebergreifender Speicherung.",
    },
    {
      id: "chat-support",
      label: "Chat Support",
      description:
        "Direktnachrichten mit Tags (z. B. Methodik/Deadline); direkter Support.",
    },
    {
      id: "schwaechen-analyse",
      label: "Schwaechen-Analyse",
      description:
        "Kapitelgenaue Auswertung deiner Quizleistung; ab 50 beantworteten Fragen werden Schwaechen markiert und gezielte Schwaechen-Quiz erzeugt.",
    },
    {
      id: "community",
      label: "Community",
      description:
        "Community-Bereich mit Leaderboard, Trends und Buddy-Matching (opt-in privacy-first).",
    },
    {
      id: "elea-quality-score",
      label: "Elea Quality Score",
      description:
        "Qualitaetswert deiner Arbeit inkl. Rubrik (z. B. Struktur, Inhalt, Methodik) und klarer Entwicklungssicht.",
    },
    {
      id: "panic-button",
      label: "Panic Button",
      description:
        "Soforthilfe-Flow mit 3 Kurzfragen, um in akuten Blockaden schnell Struktur und naechste Schritte auszulosen.",
    },
    {
      id: "betreuung-anna",
      label: "1:1 Betreuung mit Anna",
      description:
        "Persoenliche Thesis-Termine mit Dr. Anna Horrer buchbar.",
    },
    {
      id: "gruppen-calls",
      label: "Gruppen Calls",
      description:
        "Regelmaessige Live-Gruppen-Sessions plus direkter Call-Bereich in elea.",
    },
    {
      id: "mock-defense",
      label: "Mock Defense",
      description:
        "Realistische Verteidigungssimulation als persoenliche Betreuungsleistung.",
    },
  ];

  const minScale = 0.42;
  const maxScale = 1.65;
  const zoomStep = 0.14;
  const nodeMap = new Map();
  const laneMap = new Map();
  let activeFeatureId = orbitFeatures[0].id;
  let view = { x: 0, y: 0, scale: 1, fitScale: 1 };
  let dragState = null;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  const toSide = (dx, dy) => {
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) {
        return { feature: "left", center: "right" };
      }
      return { feature: "right", center: "left" };
    }
    if (dy > 0) {
      return { feature: "top", center: "bottom" };
    }
    return { feature: "bottom", center: "top" };
  };

  const anchorFromRect = (rect, side) => {
    if (side === "left") return { x: rect.x, y: rect.y + rect.h / 2 };
    if (side === "right") return { x: rect.x + rect.w, y: rect.y + rect.h / 2 };
    if (side === "top") return { x: rect.x + rect.w / 2, y: rect.y };
    return { x: rect.x + rect.w / 2, y: rect.y + rect.h };
  };

  const buildSmoothPath = (start, end, side) => {
    if (side.feature === "left" || side.feature === "right") {
      const midX = (start.x + end.x) / 2;
      return `M ${start.x} ${start.y} C ${midX} ${start.y}, ${midX} ${end.y}, ${end.x} ${end.y}`;
    }
    const midY = (start.y + end.y) / 2;
    return `M ${start.x} ${start.y} C ${start.x} ${midY}, ${end.x} ${midY}, ${end.x} ${end.y}`;
  };

  const applyCanvasTransform = () => {
    orbitCanvas.style.transform = `translate(${view.x}px, ${view.y}px) scale(${view.scale})`;
  };

  const zoomTo = (targetScale, originX, originY) => {
    const nextScale = clamp(targetScale, minScale, maxScale);
    const ratio = nextScale / view.scale;
    view.x = originX - (originX - view.x) * ratio;
    view.y = originY - (originY - view.y) * ratio;
    view.scale = nextScale;
    applyCanvasTransform();
  };

  const fitOrbit = () => {
    const stageW = orbitViewport.clientWidth;
    const stageH = orbitViewport.clientHeight;
    const canvasW = orbitCanvas.offsetWidth;
    const canvasH = orbitCanvas.offsetHeight;
    const fitScale = clamp(Math.min(stageW / canvasW, stageH / canvasH) * 0.95, minScale, 1);
    view.fitScale = fitScale;
    view.scale = fitScale;
    view.x = (stageW - canvasW * fitScale) / 2;
    view.y = (stageH - canvasH * fitScale) / 2;
    applyCanvasTransform();
  };

  const applyActiveFeature = (featureId) => {
    const activeFeature = orbitFeatures.find((feature) => feature.id === featureId);
    if (!activeFeature) return;

    activeFeatureId = featureId;
    orbitCardTitle.textContent = activeFeature.label;
    orbitCardDescription.textContent = activeFeature.description;

    orbitFeatures.forEach((feature) => {
      const node = nodeMap.get(feature.id);
      const lane = laneMap.get(feature.id);
      const isActive = feature.id === featureId;

      if (node) {
        node.classList.toggle("is-active", isActive);
        node.setAttribute("aria-pressed", isActive ? "true" : "false");
      }

      if (lane) {
        lane.classList.toggle("is-active", isActive);
      }
    });
  };

  const renderOrbit = () => {
    const canvasW = orbitCanvas.offsetWidth;
    const canvasH = orbitCanvas.offsetHeight;
    const centerX = canvasW / 2;
    const centerY = canvasH / 2;
    const centerSize = orbitCenter.offsetWidth;
    const nodeW = 112;
    const nodeH = 42;
    const minDimension = Math.min(canvasW, canvasH);
    const innerRadius = minDimension * 0.315;
    const outerRadius = minDimension * 0.425;
    const innerCount = Math.ceil(orbitFeatures.length / 2);
    const outerCount = orbitFeatures.length - innerCount;

    orbitNodeLayer.innerHTML = "";
    orbitLanes.innerHTML = "";
    nodeMap.clear();
    laneMap.clear();

    orbitFeatures.forEach((feature, index) => {
      const isInner = index < innerCount;
      const localIndex = isInner ? index : index - innerCount;
      const count = isInner ? innerCount : outerCount;
      const radius = isInner ? innerRadius : outerRadius;
      const angleOffset = isInner ? 0 : Math.PI / count;
      const angle = -Math.PI / 2 + angleOffset + (Math.PI * 2 * localIndex) / count;
      const nodeCenterX = centerX + Math.cos(angle) * radius;
      const nodeCenterY = centerY + Math.sin(angle) * radius;
      const nodeRect = { x: nodeCenterX - nodeW / 2, y: nodeCenterY - nodeH / 2, w: nodeW, h: nodeH };
      const side = toSide(nodeCenterX - centerX, nodeCenterY - centerY);
      const start = anchorFromRect(nodeRect, side.feature);
      const centerRect = { x: centerX - centerSize / 2, y: centerY - centerSize / 2, w: centerSize, h: centerSize };
      const end = anchorFromRect(centerRect, side.center);

      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.classList.add("elea-orbit-lane");
      path.dataset.featureId = feature.id;
      path.setAttribute("d", buildSmoothPath(start, end, side));
      orbitLanes.appendChild(path);

      const node = document.createElement("button");
      node.type = "button";
      node.className = "elea-orbit-node";
      node.dataset.featureId = feature.id;
      node.setAttribute("aria-pressed", "false");
      node.style.left = `${nodeCenterX}px`;
      node.style.top = `${nodeCenterY}px`;
      node.textContent = feature.label;
      node.addEventListener("click", () => applyActiveFeature(feature.id));
      orbitNodeLayer.appendChild(node);

      nodeMap.set(feature.id, node);
      laneMap.set(feature.id, path);
    });

    applyActiveFeature(activeFeatureId);
  };

  orbitZoomIn.addEventListener("click", () => {
    zoomTo(view.scale * (1 + zoomStep), orbitViewport.clientWidth / 2, orbitViewport.clientHeight / 2);
  });

  orbitZoomOut.addEventListener("click", () => {
    zoomTo(view.scale * (1 - zoomStep), orbitViewport.clientWidth / 2, orbitViewport.clientHeight / 2);
  });

  orbitFit.addEventListener("click", () => {
    fitOrbit();
  });

  orbitViewport.addEventListener(
    "wheel",
    (event) => {
      event.preventDefault();
      const rect = orbitViewport.getBoundingClientRect();
      const originX = event.clientX - rect.left;
      const originY = event.clientY - rect.top;
      const direction = event.deltaY < 0 ? 1 + zoomStep : 1 - zoomStep;
      zoomTo(view.scale * direction, originX, originY);
    },
    { passive: false }
  );

  orbitViewport.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    if (event.target.closest(".elea-orbit-node") || event.target.closest(".elea-orbit-controls")) return;
    dragState = { x: event.clientX, y: event.clientY, startX: view.x, startY: view.y };
    orbitViewport.classList.add("is-dragging");
    orbitViewport.setPointerCapture(event.pointerId);
  });

  orbitViewport.addEventListener("pointermove", (event) => {
    if (!dragState) return;
    const dx = event.clientX - dragState.x;
    const dy = event.clientY - dragState.y;
    view.x = dragState.startX + dx;
    view.y = dragState.startY + dy;
    applyCanvasTransform();
  });

  const stopDrag = () => {
    dragState = null;
    orbitViewport.classList.remove("is-dragging");
  };

  orbitViewport.addEventListener("pointerup", stopDrag);
  orbitViewport.addEventListener("pointercancel", stopDrag);
  orbitViewport.addEventListener("pointerleave", stopDrag);

  const rerenderAndFit = () => {
    renderOrbit();
    fitOrbit();
  };

  if (typeof ResizeObserver === "function") {
    const observer = new ResizeObserver(() => {
      rerenderAndFit();
    });
    observer.observe(orbitViewport);
    observer.observe(orbitCanvas);
  } else {
    window.addEventListener("resize", rerenderAndFit);
  }

  rerenderAndFit();
}
