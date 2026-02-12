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
const featureStackMobileMq =
  typeof window.matchMedia === "function"
    ? window.matchMedia("(max-width: 767px)")
    : { matches: false };

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
        "5-Fragen, die deinen aktuellen Ist-Stand erfassen und dir einen passgenauen Plan (free, study, basic, pro) begruendet empfehlen.",
    },
    {
      id: "frag-elea",
      label: "Frag elea",
      description:
        "Stelle Fragen per Text- oder Sprachnachricht und bekomme eine einfache Erklaerung mit Beispielen und naechsten Schritten. Daraus kannst du direkt Aufgaben oder ein Lernlabor-Quiz erzeugen.",
    },
    {
      id: "elea-lernlabor",
      label: "elea Lernlabor",
      description:
        "Ueberpruefe dein Wissen: Erstelle aus deinen PDFs Lernfragen in verschiedenen Quiz-Leveln (easy, medium, hard) mit Timer, erhalte Feedback und trainiere strukturiert Lernaufgaben.",
    },
    {
      id: "academia",
      label: "Academia",
      description:
        "Deine zentrale Download-Bibliothek fuer Methodenwissen, Vorlagen und Checklisten.",
    },
    {
      id: "notehub",
      label: "Notehub",
      description:
        "Erstelle dir selbst Notizen mit Prioritaeten, Tags und verknuepfe sie mit deinen Dokumenten und Aufgaben. Per Spracheingabe und Live-Sync.",
    },
    {
      id: "smartsearch",
      label: "Smartsearch",
      description:
        "Finde deine Dokumente, Aufgaben und Notizen und springe direkt in den richtigen Bereich.",
    },
    {
      id: "dokumente-upload",
      label: "Document Upload",
      description:
        "Lade deine PDF/DOC/DOCX Dokumente direkt in elea. Nutze Such-/Filterfunktionen, Duplikatvermeidung und Dokument-Analytics.",
    },
    {
      id: "countdown",
      label: "Countdown",
      description:
        "Setze dir ein Ziel-Datum und behalte es im Blick.",
    },
    {
      id: "mental-health-checker",
      label: "Mental Health Tracker",
      description:
        "Tracke 2x taeglich dein Stress-Level, sieh deinen 7-Tage-Verlauf und erhalte eine Fruehwarnung bei anhaltend hoher Belastung.",
    },
    {
      id: "fortschrittsanzeige",
      label: "Fortschrittsanzeige",
      description:
        "Ueberpruefe deinen Fortschritt aus Status, Quiz, Uploads, Checklisten und Aufgaben.",
    },
    {
      id: "risiko-checker",
      label: "Risiko Checker",
      description:
        "Evaluiere dein Risiko-Level (niedrig/mittel/hoch) auf Basis deines Fortschritts, Stresslevels, der verbleibenden Zeit und deinem Betreuungsstatus.",
    },
    {
      id: "aufgaben-setzen",
      label: "Aufgaben setzen",
      description:
        "Priorisiere und filtere deine ToDos mit Deadline, verlinke sie direkt in deinem Dokument und markiere sie als erledigt.",
    },
    {
      id: "elea-school",
      label: "elea School",
      description:
        "Finde Video-Tutorials zu deinen Fragen und speichere deinen Fortschritt zum wissenschaftlichen Arbeiten geraeteuebergreifend.",
    },
    {
      id: "chat-support",
      label: "Chat Support",
      description:
        "Stelle Fragen, markiere sie mit Tags (z.B. Methodik/Deadline) und erhalte direkt Support.",
    },
    {
      id: "schwaechen-analyse",
      label: "Schwaechen-Analyse",
      description:
        "Werte deine Quiz-Leistung kapitelgenau aus. Ab 50 beantworteten Fragen erhaeltst du gezielte Quizfragen zum Verbessern deiner Schwaechen.",
    },
    {
      id: "community",
      label: "Community",
      description:
        "Finde deinen Study-Buddy, verfolge Trends und vergleiche dein Ranking im Leaderboard.",
    },
    {
      id: "elea-quality-score",
      label: "elea Quality Score",
      description:
        "Beurteile die Qualitaet deiner Arbeit und erhalte Feedback zu Struktur, Inhalt und Methodik sowie einer klaren Entwicklungsperspektive.",
    },
    {
      id: "panic-button",
      label: "Panic Button",
      description:
        "Deine Soforthilfe mit 3 Kurzfragen, um in akuten Blockaden schnell Struktur und naechste Schritte auszuloesen.",
    },
    {
      id: "betreuung-anna",
      label: "1:1 Betreuung mit Anna",
      description:
        "Buche deine persoenlichen Termine zum Thesis-Mentorat.",
    },
    {
      id: "gruppen-calls",
      label: "Interactive Help Sessions",
      description:
        "Besuche unsere regelmaessigen Live-Gruppen. Tausche dich mit Mentor:innen und Mitgliedern zu den haeufigsten Fragen aus.",
    },
    {
      id: "mock-defense",
      label: "Mock Defense",
      description:
        "Uebe die Praesentation deiner Arbeit in einer realistischen Simulation einer wissenschaftlichen Verteidigung.",
    },
  ];

  const minScale = 0.45;
  const maxScale = 1.55;
  const zoomStep = 0.14;
  const dragStartThreshold = 8;
  const suppressTapDelayMs = 260;
  const nodeMap = new Map();
  const laneMap = new Map();
  let activeFeatureId = orbitFeatures[0].id;
  let view = { x: 0, y: 0, scale: 1, fitScale: 1 };
  let dragState = null;
  let pinchState = null;
  let suppressNodeActivationUntil = 0;
  const activePointers = new Map();

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const now = () => (typeof performance !== "undefined" && typeof performance.now === "function" ? performance.now() : Date.now());
  const suppressNodeActivation = () => {
    suppressNodeActivationUntil = now() + suppressTapDelayMs;
  };
  const isNodeActivationSuppressed = () => now() < suppressNodeActivationUntil;
  const isInsideOrbitControls = (target) => Boolean(target && typeof target.closest === "function" && target.closest(".elea-orbit-controls"));
  const isInsideOrbitNode = (target) => Boolean(target && typeof target.closest === "function" && target.closest(".elea-orbit-node"));

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
    orbitCanvas.style.transform = `translate3d(${view.x}px, ${view.y}px, 0) scale(${view.scale})`;
  };

  const toLocalPoint = (clientX, clientY) => {
    const rect = orbitViewport.getBoundingClientRect();
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const getPointerPair = () => {
    const values = Array.from(activePointers.values());
    if (values.length < 2) return null;
    return [values[0], values[1]];
  };

  const beginPinch = () => {
    const pair = getPointerPair();
    if (!pair) return;
    const [first, second] = pair;
    const distance = Math.hypot(second.x - first.x, second.y - first.y);
    if (distance <= 0) return;
    const midClientX = (first.x + second.x) / 2;
    const midClientY = (first.y + second.y) / 2;
    const midpoint = toLocalPoint(midClientX, midClientY);
    pinchState = {
      startDistance: distance,
      startScale: view.scale,
      worldX: (midpoint.x - view.x) / view.scale,
      worldY: (midpoint.y - view.y) / view.scale,
    };
    dragState = null;
    suppressNodeActivation();
    orbitViewport.classList.add("is-dragging");
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
      node.addEventListener("click", (event) => {
        if (event.detail !== 0 && isNodeActivationSuppressed()) {
          return;
        }
        applyActiveFeature(feature.id);
      });
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

  const syncAfterPointerCountChange = () => {
    if (activePointers.size >= 2) {
      beginPinch();
      return;
    }

    pinchState = null;
    if (activePointers.size === 1) {
      const [pointerId, remaining] = Array.from(activePointers.entries())[0];
      dragState = {
        pointerId,
        startClientX: remaining.x,
        startClientY: remaining.y,
        startViewX: view.x,
        startViewY: view.y,
        hasMoved: false,
      };
      orbitViewport.classList.remove("is-dragging");
      return;
    }

    dragState = null;
    orbitViewport.classList.remove("is-dragging");
  };

  if (typeof window !== "undefined" && "PointerEvent" in window) {
    orbitViewport.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      if (isInsideOrbitControls(event.target)) return;
      if (isInsideOrbitNode(event.target)) return;

      activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

      if (
        event.pointerType === "mouse" &&
        typeof orbitViewport.setPointerCapture === "function"
      ) {
        orbitViewport.setPointerCapture(event.pointerId);
      }

      if (activePointers.size === 1) {
        dragState = {
          pointerId: event.pointerId,
          startClientX: event.clientX,
          startClientY: event.clientY,
          startViewX: view.x,
          startViewY: view.y,
          hasMoved: false,
        };
        pinchState = null;
      } else if (activePointers.size === 2) {
        beginPinch();
      }

    });

    orbitViewport.addEventListener("pointermove", (event) => {
      if (!activePointers.has(event.pointerId)) return;
      activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

      if (activePointers.size >= 2) {
        const pair = getPointerPair();
        if (!pair) return;
        const [first, second] = pair;
        const distance = Math.hypot(second.x - first.x, second.y - first.y);
        if (!pinchState) {
          beginPinch();
        }
        if (pinchState && distance > 0) {
          const nextScale = clamp((pinchState.startScale * distance) / pinchState.startDistance, minScale, maxScale);
          const midClientX = (first.x + second.x) / 2;
          const midClientY = (first.y + second.y) / 2;
          const midpoint = toLocalPoint(midClientX, midClientY);
          view.scale = nextScale;
          view.x = midpoint.x - pinchState.worldX * nextScale;
          view.y = midpoint.y - pinchState.worldY * nextScale;
          applyCanvasTransform();
        }
        if (event.cancelable) {
          event.preventDefault();
        }
        return;
      }

      if (!dragState || dragState.pointerId !== event.pointerId) return;
      const dx = event.clientX - dragState.startClientX;
      const dy = event.clientY - dragState.startClientY;

      if (!dragState.hasMoved) {
        if (Math.hypot(dx, dy) < dragStartThreshold) {
          return;
        }
        dragState.hasMoved = true;
        suppressNodeActivation();
        orbitViewport.classList.add("is-dragging");
      }

      view.x = dragState.startViewX + dx;
      view.y = dragState.startViewY + dy;
      applyCanvasTransform();

      if (event.pointerType !== "mouse" && event.cancelable) {
        event.preventDefault();
      }
    });

    const stopPointer = (event) => {
      const releasedWasDraggedPointer = dragState && dragState.pointerId === event.pointerId && dragState.hasMoved;

      if (
        typeof orbitViewport.hasPointerCapture === "function" &&
        typeof orbitViewport.releasePointerCapture === "function" &&
        orbitViewport.hasPointerCapture(event.pointerId)
      ) {
        orbitViewport.releasePointerCapture(event.pointerId);
      }
      activePointers.delete(event.pointerId);

      if (releasedWasDraggedPointer) {
        suppressNodeActivation();
      }

      syncAfterPointerCountChange();
    };

    orbitViewport.addEventListener("pointerup", stopPointer);
    orbitViewport.addEventListener("pointercancel", stopPointer);
    orbitViewport.addEventListener("lostpointercapture", (event) => {
      activePointers.delete(event.pointerId);
      syncAfterPointerCountChange();
    });
  } else {
    let touchDragState = null;
    let touchPinchState = null;

    const beginTouchPinch = (touches) => {
      if (touches.length < 2) return;
      const first = touches[0];
      const second = touches[1];
      const distance = Math.hypot(second.clientX - first.clientX, second.clientY - first.clientY);
      if (distance <= 0) return;
      const midpoint = toLocalPoint((first.clientX + second.clientX) / 2, (first.clientY + second.clientY) / 2);
      touchPinchState = {
        startDistance: distance,
        startScale: view.scale,
        worldX: (midpoint.x - view.x) / view.scale,
        worldY: (midpoint.y - view.y) / view.scale,
      };
      touchDragState = null;
      suppressNodeActivation();
      orbitViewport.classList.add("is-dragging");
    };

    orbitViewport.addEventListener(
      "touchstart",
      (event) => {
        if (isInsideOrbitControls(event.target)) return;
        if (isInsideOrbitNode(event.target)) return;

        if (event.touches.length >= 2) {
          beginTouchPinch(event.touches);
          if (event.cancelable) {
            event.preventDefault();
          }
          return;
        }

        if (event.touches.length === 1) {
          const touch = event.touches[0];
          touchDragState = {
            startClientX: touch.clientX,
            startClientY: touch.clientY,
            startViewX: view.x,
            startViewY: view.y,
            hasMoved: false,
          };
          touchPinchState = null;
        }
      },
      { passive: false }
    );

    orbitViewport.addEventListener(
      "touchmove",
      (event) => {
        if (event.touches.length >= 2) {
          if (!touchPinchState) {
            beginTouchPinch(event.touches);
          }
          const first = event.touches[0];
          const second = event.touches[1];
          const distance = Math.hypot(second.clientX - first.clientX, second.clientY - first.clientY);
          if (touchPinchState && distance > 0) {
            const nextScale = clamp((touchPinchState.startScale * distance) / touchPinchState.startDistance, minScale, maxScale);
            const midpoint = toLocalPoint((first.clientX + second.clientX) / 2, (first.clientY + second.clientY) / 2);
            view.scale = nextScale;
            view.x = midpoint.x - touchPinchState.worldX * nextScale;
            view.y = midpoint.y - touchPinchState.worldY * nextScale;
            applyCanvasTransform();
          }
          if (event.cancelable) {
            event.preventDefault();
          }
          return;
        }

        if (event.touches.length !== 1 || !touchDragState) return;
        const touch = event.touches[0];
        const dx = touch.clientX - touchDragState.startClientX;
        const dy = touch.clientY - touchDragState.startClientY;

        if (!touchDragState.hasMoved) {
          if (Math.hypot(dx, dy) < dragStartThreshold) {
            return;
          }
          touchDragState.hasMoved = true;
          suppressNodeActivation();
          orbitViewport.classList.add("is-dragging");
        }

        view.x = touchDragState.startViewX + dx;
        view.y = touchDragState.startViewY + dy;
        applyCanvasTransform();

        if (event.cancelable) {
          event.preventDefault();
        }
      },
      { passive: false }
    );

    const handleTouchEnd = (event) => {
      if (event.touches.length >= 2) {
        beginTouchPinch(event.touches);
        return;
      }

      touchPinchState = null;
      if (event.touches.length === 1) {
        const touch = event.touches[0];
        touchDragState = {
          startClientX: touch.clientX,
          startClientY: touch.clientY,
          startViewX: view.x,
          startViewY: view.y,
          hasMoved: false,
        };
        orbitViewport.classList.remove("is-dragging");
        return;
      }

      if (touchDragState && touchDragState.hasMoved) {
        suppressNodeActivation();
      }
      touchDragState = null;
      orbitViewport.classList.remove("is-dragging");
    };

    orbitViewport.addEventListener("touchend", handleTouchEnd, { passive: false });
    orbitViewport.addEventListener("touchcancel", handleTouchEnd, { passive: false });
  }

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
