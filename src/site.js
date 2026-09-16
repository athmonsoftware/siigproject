document.documentElement.classList.add("js");
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

// A small progress trace makes long pages feel navigable without covering content.
const progress = document.createElement("div");
progress.className = "scroll-progress";
progress.setAttribute("aria-hidden", "true");
document.body.prepend(progress);
let scrollFrame = 0;
function updateScrollProgress() {
  scrollFrame = 0;
  const distance = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = `scaleX(${distance > 0 ? scrollY / distance : 0})`;
}
addEventListener(
  "scroll",
  () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScrollProgress);
  },
  { passive: true },
);
addEventListener("resize", updateScrollProgress);
updateScrollProgress();

const menuButton = document.querySelector("[data-menu-button]");
const menu = document.querySelector("[data-menu]");

if (menuButton && menu) {
  menuButton.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(open));
    menu.classList.toggle("is-open", open);
  });
  menu.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      menuButton.setAttribute("aria-expanded", "false");
      menu.classList.remove("is-open");
    }
  });
}

const chooser = document.querySelector("[data-chooser]");
if (chooser) {
  const choices = {
    team: {
      number: "01 / TEAM",
      title: "Build the confidence to act.",
      text: "Practical first aid and fire safety sessions help people rehearse the decisions they may need to make at work.",
      points: [
        "First aid, CPR and AED",
        "Fire awareness and evacuation drills",
        "Workplace-specific scenarios",
      ],
      href: "/services.html#training",
      link: "Explore training",
    },
    workplace: {
      number: "02 / PLACE",
      title: "Make readiness visible.",
      text: "Review the environment, equip the site, and give staff a clear way to respond when routine breaks.",
      points: [
        "Risk assessments and inspections",
        "Emergency evacuation planning",
        "Equipment and signage guidance",
      ],
      href: "/services.html#workplace",
      link: "Explore workplace support",
    },
    event: {
      number: "03 / GATHERING",
      title: "Plan for the people in the room.",
      text: "Event support starts with the setting, the audience, and the response arrangements needed on the day.",
      points: [
        "Pre-event risk review",
        "On-site first aid cover",
        "Guest and emergency response support",
      ],
      href: "/services.html#events",
      link: "Explore event cover",
    },
  };
  const buttons = [...chooser.querySelectorAll("[data-choice]")];
  const output = chooser.querySelector("[data-choice-output]");
  let firstChoice = true;
  function renderChoice(key) {
    const choice = choices[key];
    if (!choice) return;
    buttons.forEach((button) => {
      const selected = button.dataset.choice === key;
      button.setAttribute("aria-selected", String(selected));
      button.tabIndex = selected ? 0 : -1;
    });
    output.innerHTML = `<div class="chooser-kicker">${choice.number}</div><h3>${choice.title}</h3><p>${choice.text}</p><ul class="check-list">${choice.points.map((point) => `<li>${point}</li>`).join("")}</ul><a class="text-link" href="${choice.href}">${choice.link}<span aria-hidden="true">↗</span></a>`;
    if (!firstChoice && !reducedMotion.matches) {
      output.animate(
        [
          { opacity: 0.45, transform: "translateY(12px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        { duration: 280, easing: "cubic-bezier(.22,1,.36,1)" },
      );
    }
    firstChoice = false;
  }
  buttons.forEach((button, index) => {
    button.addEventListener("click", () => renderChoice(button.dataset.choice));
    button.addEventListener("keydown", (event) => {
      if (!["ArrowRight", "ArrowLeft"].includes(event.key)) return;
      event.preventDefault();
      const next =
        buttons[
          (index + (event.key === "ArrowRight" ? 1 : buttons.length - 1)) %
            buttons.length
        ];
      next.focus();
      renderChoice(next.dataset.choice);
    });
  });
  renderChoice("team");
}

const heroArt = document.querySelector(".hero-art");
if (
  heroArt &&
  !reducedMotion.matches &&
  matchMedia("(pointer: fine)").matches
) {
  const hero = heroArt.closest(".hero");
  const heroLight = hero.querySelector(".hero-light");
  hero.addEventListener(
    "pointermove",
    (event) => {
      const bounds = heroArt.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      heroArt.style.setProperty(
        "--art-x",
        `${Math.max(-12, Math.min(12, x * 20))}px`,
      );
      heroArt.style.setProperty(
        "--art-y",
        `${Math.max(-12, Math.min(12, y * 20))}px`,
      );
      if (heroLight) {
        const heroBounds = hero.getBoundingClientRect();
        heroLight.style.transform = `translate3d(${event.clientX - heroBounds.left}px, ${event.clientY - heroBounds.top}px, 0)`;
      }
    },
    { passive: true },
  );
  hero.addEventListener("pointerleave", () => {
    heroArt.style.setProperty("--art-x", "0px");
    heroArt.style.setProperty("--art-y", "0px");
    if (heroLight) heroLight.style.transform = "translate3d(70vw, 13rem, 0)";
  });
}

const serviceNav = document.querySelector("[data-service-nav]");
if (serviceNav && "IntersectionObserver" in window) {
  const links = [...serviceNav.querySelectorAll('a[href^="#"]')];
  const sections = links.map((link) =>
    document.querySelector(link.getAttribute("href")),
  );
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (!visible) return;
      links.forEach((link) => {
        if (link.hash === `#${visible.target.id}`)
          link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    },
    { rootMargin: "-15% 0px -60% 0px" },
  );
  sections
    .filter(Boolean)
    .forEach((section) => sectionObserver.observe(section));
}

const serviceSelect = document.querySelector('[name="service"]');
if (serviceSelect) {
  const requested = new URLSearchParams(location.search).get("service");
  if (
    requested &&
    [...serviceSelect.options].some((option) => option.value === requested)
  )
    serviceSelect.value = requested;
}

const enquiryForm = document.querySelector("[data-enquiry-form]");
if (enquiryForm) {
  enquiryForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!enquiryForm.reportValidity()) return;
    const data = new FormData(enquiryForm);
    const subject = `SIIG enquiry: ${data.get("service")}`;
    const body = [
      `Name: ${data.get("name")}`,
      `Organisation: ${data.get("organisation") || "Not provided"}`,
      `Phone: ${data.get("phone")}`,
      `Email: ${data.get("email")}`,
      `Service: ${data.get("service")}`,
      `Location: ${data.get("location") || "Not provided"}`,
      "",
      `What is needed:`,
      data.get("message"),
    ].join("\n");
    location.href = `mailto:safetyinnovations.ltd@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const note = enquiryForm.querySelector("[data-form-note]");
    note.textContent =
      "Your email app should open with a prepared message. Please send it there to complete your enquiry.";
  });
}

const staggerGroups = [
  ".section-top > *",
  ".service-card",
  ".method-steps > div",
  ".detail-grid > *",
  ".method-feature article",
  ".initiative-list article",
  ".purpose-grid article",
  ".values-grid article",
  ".editorial-photo",
  ".actual-photo",
  ".contact-grid > *",
  ".closing-grid > *",
  ".page-intro-grid > *",
  ".page-hero-grid > *",
];
staggerGroups.forEach((selector) => {
  document.querySelectorAll(selector).forEach((element, index) => {
    element.dataset.reveal = "";
    element.style.setProperty("--reveal-delay", `${(index % 3) * 50}ms`);
  });
});
const reveals = document.querySelectorAll("[data-reveal]");
if ("IntersectionObserver" in window && !reducedMotion.matches) {
  document.documentElement.classList.add("motion-ready");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 },
  );
  reveals.forEach((element) => observer.observe(element));
} else {
  reveals.forEach((element) => element.classList.add("is-visible"));
}
