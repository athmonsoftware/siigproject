import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowUp,
  Building2,
  ClipboardList,
  Clock3,
  Flame,
  GraduationCap,
  HandHeart,
  HardHat,
  Heart,
  Home,
  Instagram,
  Lock,
  Mail,
  Menu,
  Package,
  Phone,
  Send,
  Shield,
  Target,
  Users,
  X,
} from "lucide-react";
import { useSiteContent } from "./hooks/useSiteContent";
import { useTeamMembers } from "./hooks/useTeamMembers";
import { useGallery } from "./hooks/useGallery";
import { isSupabaseConfigured, supabase } from "./lib/supabase";
import AdminRouter from "./admin/AdminRouter";
import { Articles } from "./components/Articles";
import { useArticles } from "./hooks/useArticles";

const INTEREST_OPTIONS = [
  "General enquiry",
  "First Aid / CPR Training",
  "Fire Safety Training",
  "Workplace Safety & Compliance",
  "Event Safety & Care Support",
  "Community Partnership",
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, ease: [0.2, 0.7, 0.2, 1] },
};

function Brand({ light = false }) {
  return (
    <a href="#top" className="mr-auto inline-flex items-center gap-3">
      <img
        src="/logo.png"
        alt=""
        width="48"
        height="48"
        className="h-12 w-12 rounded-[10px] object-contain"
      />
      <span className="flex flex-col font-display leading-tight">
        <strong
          className={`text-[1.05rem] font-extrabold tracking-tight ${
            light ? "text-white" : "text-green-800"
          }`}
        >
          Safety Innovations
        </strong>
        <span
          className={`mt-[3px] text-[0.72rem] font-bold uppercase tracking-[0.16em] ${
            light ? "text-[#f3b5bf]" : "text-red-600"
          }`}
        >
          Impact Group
        </span>
      </span>
      <span className="sr-only">Safety Innovations Impact Group — home</span>
    </a>
  );
}

function CheckList({ items, light = false, columns = false }) {
  return (
    <ul
      className={`checklist grid gap-2.5 ${light ? "checklist-light" : ""} ${
        columns ? "sm:grid-cols-2 sm:gap-x-6" : ""
      }`}
    >
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function Topbar({ contact }) {
  return (
    <div className="bg-green-950 text-[0.84rem] text-white/80">
      <div className="mx-auto flex min-h-10 max-w-site items-center justify-between gap-4 px-[clamp(16px,4vw,32px)]">
        <p className="hidden text-[0.74rem] font-semibold uppercase tracking-[0.08em] text-white sm:block">
          Your Safety, Our Mission
        </p>
        <ul className="flex items-center justify-center gap-4 sm:gap-[22px]">
          <li>
            <a
              href={`tel:${contact.phone_link}`}
              className="inline-flex items-center gap-[7px] transition hover:text-white"
            >
              <Phone className="h-4 w-4" />
              {contact.phone}
            </a>
          </li>
          <li>
            <a
              href={`mailto:${contact.email}`}
              className="inline-flex items-center gap-[7px] transition hover:text-white"
            >
              <Mail className="h-4 w-4" />
              <span className="hidden sm:inline">{contact.email}</span>
            </a>
          </li>
          <li>
            <a
              href={contact.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-[7px] transition hover:text-white"
            >
              <Instagram className="h-4 w-4" />
              <span className="sr-only">Instagram</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const { articles } = useArticles();
  const hasArticles = articles && articles.length > 0;

  const navLinks = [
    ...(hasArticles ? [{ name: "Articles", href: "#articles" }] : []),
    { name: "Services", href: "#services" },
    { name: "Event Safety", href: "#events" },
    { name: "Our Approach", href: "#training" },
    { name: "About", href: "#about" },
    { name: "Community", href: "#community" },
    { name: "Team", href: "#team" },
    { name: "Gallery", href: "#gallery" },
  ];

  const close = () => setIsOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);

      // Calculate active section
      const sections = navLinks.map((link) => link.href.replace("#", ""));
      const scrollPosition = window.scrollY + 100;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [navLinks]);

  return (
    <header
      className={`sticky top-0 z-[100] border-b bg-white/92 backdrop-blur-[12px] backdrop-saturate-150 transition ${
        scrolled ? "border-line shadow-sm" : "border-transparent"
      }`}
    >
      <div className="mx-auto flex h-[76px] max-w-site items-center gap-6 px-[clamp(16px,4vw,32px)] max-[980px]:h-[68px]">
        <Brand />
        <nav
          className={`max-[980px]:fixed max-[980px]:inset-x-0 max-[980px]:top-[calc(40px+68px)] max-[980px]:max-h-[calc(100vh-108px)] max-[980px]:overflow-y-auto max-[980px]:border-t max-[980px]:border-line max-[980px]:bg-white max-[980px]:px-[clamp(16px,4vw,32px)] max-[980px]:pb-6 max-[980px]:pt-3 max-[980px]:shadow-brand-lg ${
            isOpen
              ? "max-[980px]:visible max-[980px]:opacity-100"
              : "max-[980px]:invisible max-[980px]:opacity-0"
          }`}
          aria-label="Primary"
        >
          <ul className="flex items-center gap-1 max-[980px]:flex-col max-[980px]:items-stretch">
            {navLinks.map((link) => {
              const sectionId = link.href.replace("#", "");
              const isActive = activeSection === sectionId;
              return (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={close}
                    className={`relative block rounded-lg px-3 py-2 text-[0.94rem] font-medium transition hover:bg-green-50 hover:text-green-800 max-[980px]:rounded-none max-[980px]:border-b max-[980px]:border-line max-[980px]:px-1 max-[980px]:py-3.5 max-[980px]:text-[1.05rem] max-[980px]:hover:bg-transparent ${
                      isActive
                        ? "text-red-800 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:h-0.5 after:w-8 after:bg-green-800 max-[980px]:after:left-0 max-[980px]:after:translate-x-0 max-[980px]:after:w-full"
                        : "text-body"
                    }`}
                  >
                    {link.name}
                  </a>
                </li>
              );
            })}
            <li className="mt-[18px] hidden max-[980px]:block">
              <a
                href="#contact"
                onClick={close}
                className="btn-primary w-full py-3.5"
              >
                Book a Consultation
              </a>
            </li>
          </ul>
        </nav>
        <a
          href="#contact"
          className="btn-primary hidden min-[981px]:inline-flex"
        >
          Book a Consultation
        </a>
        <button
          className="ml-2 hidden rounded-lg p-2 text-green-800 max-[980px]:inline-grid max-[980px]:place-items-center"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((open) => !open)}
        >
          {isOpen ? (
            <X className="h-[26px] w-[26px]" />
          ) : (
            <Menu className="h-[26px] w-[26px]" />
          )}
        </button>
      </div>
    </header>
  );
}

function Hero({ content }) {
  const title =
    content.title || "Next-generation safety.\nUncompromising protection.";
  const [first, ...rest] = title.split("\n");

  return (
    <section className="relative isolate overflow-hidden bg-green-900 pb-0 pt-[clamp(72px,12vw,140px)] text-white">
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <img
          src="/images/fire-safety-training.jpg"
          alt=""
          className="h-full w-full object-cover object-[60%_40%]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(95deg,rgba(6,42,31,.97)_0%,rgba(8,48,36,.9)_42%,rgba(10,53,40,.55)_75%,rgba(10,53,40,.35)_100%),linear-gradient(0deg,rgba(6,42,31,.9)_0%,rgba(6,42,31,0)_40%)]" />
      </div>
      <div className="mx-auto max-w-site px-[clamp(16px,4vw,32px)]">
        <div className="max-w-[800px]">
          <p className="eyebrow-light">{content.eyebrow}</p>
          <h1 className="font-display text-[clamp(2.3rem,5.2vw,3.9rem)] font-extrabold leading-[1.08] tracking-[-0.025em] text-white">
            {first}
            {rest.length > 0 && (
              <>
                <br />
                <span className="text-[#f5c6cd]">{rest.join(" ")}</span>
              </>
            )}
          </h1>
          <p className="mb-9 mt-6 max-w-[580px] text-[clamp(1.05rem,1.6vw,1.2rem)] text-white/85">
            {content.description}
          </p>
          <div className="flex flex-wrap gap-3.5">
            <a href="#services" className="btn-primary-lg max-[480px]:w-full">
              {content.primary_button}
              <ArrowRight className="h-[1.15em] w-[1.15em]" />
            </a>
            <a href="#contact" className="btn-ghost max-[480px]:w-full">
              {content.secondary_button}
            </a>
          </div>
        </div>
        <ul className="mt-[clamp(64px,9vw,110px)] grid grid-cols-4 border-t border-white/16 max-[980px]:grid-cols-2 max-[480px]:grid-cols-1">
          {[
            {
              icon: Heart,
              title: "First Aid & CPR",
              note: "Certification & refreshers",
            },
            {
              icon: Flame,
              title: "Fire Safety",
              note: "Wardens, drills & evacuation",
            },
            {
              icon: ClipboardList,
              title: "Compliance",
              note: "Audits & risk assessments",
            },
            { icon: Users, title: "Event Cover", note: "On-site responders" },
          ].map((item, index) => (
            <li
              key={item.title}
              className={`flex items-start gap-3.5 py-[28px] pr-6 max-[480px]:border-l-0 max-[480px]:px-0 max-[480px]:py-[18px] ${
                index > 0
                  ? "border-l border-white/12 pl-6 max-[980px]:[&:nth-child(3)]:border-l-0 max-[980px]:[&:nth-child(3)]:pl-0 max-[980px]:[&:nth-child(n+3)]:border-t max-[980px]:[&:nth-child(n+3)]:border-white/12 max-[480px]:border-l-0 max-[480px]:border-t max-[480px]:pl-0"
                  : ""
              }`}
            >
              <item.icon className="mt-0.5 h-7 w-7 shrink-0 text-[#f5c6cd]" />
              <div>
                <strong className="block font-display text-[1.02rem] font-bold text-white">
                  {item.title}
                </strong>
                <span className="text-[0.88rem] text-white/70">
                  {item.note}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ServicesOverview() {
  const cards = [
    {
      href: "#first-aid",
      icon: Heart,
      title: "First Aid Training",
      text: "Hands-on first aid, CPR and AED programmes focused on realistic response, not memorisation.",
    },
    {
      href: "#fire-safety",
      icon: Flame,
      title: "Fire Safety Training",
      text: "Teaches staff what to do in the first critical minutes of a fire, from extinguisher use to evacuation.",
    },
    {
      href: "#compliance",
      icon: ClipboardList,
      title: "Workplace Compliance",
      text: "Risk assessments, audits and evacuation planning that move organisations beyond paperwork.",
    },
    {
      href: "#events",
      icon: Users,
      title: "Event Safety & Care",
      text: "Trained responders and guest-support personnel for gatherings of any size.",
    },
  ];

  return (
    <section id="services" className="py-[clamp(72px,10vw,120px)]">
      <div className="mx-auto max-w-site px-[clamp(16px,4vw,32px)]">
        <motion.header
          {...fadeUp}
          className="mx-auto mb-[clamp(40px,6vw,64px)] max-w-[720px] text-center"
        >
          <p className="eyebrow justify-center">What We Do</p>
          <h2 className="text-[clamp(1.75rem,3.2vw,2.5rem)] font-extrabold tracking-tight">
            Safety services built for real-world readiness
          </h2>
          <p className="mt-3 text-[1.06rem] text-muted">
            Many workplaces meet safety requirements on paper but are not ready
            for a real emergency. Our training and advisory services close that
            gap.
          </p>
        </motion.header>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <motion.a
              key={card.href}
              {...fadeUp}
              href={card.href}
              className="group relative flex flex-col rounded-[22px] border border-line bg-white px-7 py-[30px] transition hover:-translate-y-1 hover:border-green-100 hover:shadow-brand"
            >
              <span className="absolute inset-x-7 top-[-1px] h-[3px] origin-center scale-x-0 rounded-b bg-red-600 transition group-hover:scale-x-100" />
              <span className="mb-5 grid h-[52px] w-[52px] place-items-center rounded-[14px] bg-green-50 text-green-700">
                <card.icon className="h-[26px] w-[26px]" />
              </span>
              <h3 className="text-[1.2rem] font-bold">{card.title}</h3>
              <p className="mt-2 text-[0.96rem] text-muted">{card.text}</p>
              <span className="mt-auto inline-flex items-center gap-1.5 pt-[18px] text-[0.92rem] font-semibold text-red-600">
                Learn more
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-[3px]" />
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

function SplitService({
  id,
  eyebrow,
  title,
  lead,
  image,
  alt,
  reverse = false,
  altBg = false,
  lists,
  extra,
}) {
  return (
    <section
      id={id}
      className={`py-[clamp(72px,10vw,120px)] ${altBg ? "bg-bg-alt" : ""}`}
    >
      <div
        className={`mx-auto grid max-w-site items-center gap-[clamp(40px,6vw,80px)] px-[clamp(16px,4vw,32px)] max-[980px]:grid-cols-1 ${
          reverse ? "lg:grid-cols-[1.15fr_1fr]" : "lg:grid-cols-[1fr_1.15fr]"
        }`}
      >
        <motion.figure
          {...fadeUp}
          className={`relative max-h-[640px] overflow-hidden rounded-[22px] shadow-brand-lg max-[980px]:aspect-[16/10] max-[980px]:max-h-[460px] lg:aspect-[4/5] ${
            reverse ? "lg:order-2" : ""
          }`}
        >
          <img
            src={image}
            alt={alt}
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <span className="absolute bottom-0 left-0 h-[5px] w-[38%] bg-red-600" />
        </motion.figure>
        <motion.div {...fadeUp}>
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="mb-[0.6em] text-[clamp(1.75rem,3.2vw,2.5rem)] font-extrabold tracking-tight">
            {title}
          </h2>
          <p className="text-[1.1rem] text-body">{lead}</p>
          <div
            className={`mt-8 grid gap-8 ${
              lists.length > 1 ? "sm:grid-cols-2" : ""
            }`}
          >
            {lists.map((list) => (
              <div key={list.title}>
                <h3 className="mb-3.5 font-sans text-[0.8rem] font-bold uppercase tracking-[0.12em] text-green-700">
                  {list.title}
                </h3>
                <CheckList items={list.items} />
              </div>
            ))}
          </div>
          {extra}
        </motion.div>
      </div>
    </section>
  );
}

function EventSafety() {
  const cards = [
    {
      icon: Heart,
      title: "On-Site Event First Aid Cover",
      text: "Trained responders equipped to handle everything from minor injuries to urgent emergencies.",
      items: [
        "Fainting and dehydration",
        "Cuts and minor injuries",
        "Allergic reactions",
        "Breathing difficulties",
        "Medical episodes",
        "Stabilisation before ambulance arrival",
      ],
      note: (
        <>
          <strong className="text-white">Includes:</strong> pre-event risk
          assessment, strategically positioned responders, communication
          coordination and incident documentation.
        </>
      ),
    },
    {
      icon: HandHeart,
      title: "Elderly & Assisted Guest Support",
      text: "Respectful, non-intrusive assistance for attendees who need extra care, supervision or mobility support, preserving comfort and dignity throughout.",
      items: [
        "Mobility assistance",
        "Monitoring health conditions",
        "Medication reminders (non-clinical)",
        "Heat and fatigue monitoring",
        "Calm reassurance in crowded situations",
        "Escorting to rest or medical areas",
      ],
      note: (
        <>
          <strong className="text-white">Ideal for:</strong> family gatherings,
          community events, conferences, religious gatherings and corporate
          functions.
        </>
      ),
    },
    {
      icon: Flame,
      title: "Fire & Emergency Preparedness Presence",
      text: "Where required, we support organisers with preventative safety oversight throughout the event.",
      items: [
        "Identifying hazards",
        "Monitoring exits and crowd flow",
        "Assisting with evacuation if necessary",
        "Coordinating with emergency services",
      ],
    },
  ];

  return (
    <section
      id="events"
      className="bg-green-800 py-[clamp(72px,10vw,120px)] text-white/80"
    >
      <div className="mx-auto max-w-site px-[clamp(16px,4vw,32px)]">
        <motion.header
          {...fadeUp}
          className="mx-auto mb-[clamp(40px,6vw,64px)] max-w-[860px] text-center"
        >
          <p className="eyebrow-light justify-center">Service 04</p>
          <h2 className="text-[clamp(1.75rem,3.2vw,2.5rem)] font-extrabold tracking-tight text-white">
            Event Safety & Care Support
          </h2>
          <p className="mt-3 text-[1.06rem] text-white/80">
            Professional protection for gatherings of any size. Crowds,
            unfamiliar venues, medical conditions and unexpected incidents all
            call for a calm, qualified response.
          </p>
          <p className="mt-4 text-[1.06rem] text-white/80">
            We provide trained safety personnel to manage medical situations,
            assist vulnerable guests and support organisers in keeping the event
            safe. You focus on your event; we focus on safety.
          </p>
        </motion.header>
        <div className="grid gap-6 lg:grid-cols-3">
          {cards.map((card) => (
            <motion.article
              key={card.title}
              {...fadeUp}
              className="flex flex-col rounded-[22px] border border-white/12 bg-white/5 px-7 py-[30px]"
            >
              <span className="mb-5 grid h-[52px] w-[52px] place-items-center rounded-[14px] bg-white/10 text-[#f5c6cd]">
                <card.icon className="h-[26px] w-[26px]" />
              </span>
              <h3 className="text-[1.2rem] font-bold text-white">
                {card.title}
              </h3>
              <p className="mt-2 text-[0.96rem] text-white/75">{card.text}</p>
              <div className="mt-4 mb-[22px]">
                <CheckList items={card.items} light />
              </div>
              {card.note && (
                <p className="mt-auto border-t border-white/12 pt-5 text-[0.9rem] text-white/75">
                  {card.note}
                </p>
              )}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrainingApproach() {
  return (
    <section id="training" className="py-[clamp(72px,10vw,120px)]">
      <div className="mx-auto max-w-site px-[clamp(16px,4vw,32px)]">
        <motion.header
          {...fadeUp}
          className="mx-auto mb-[clamp(40px,6vw,64px)] max-w-[720px] text-center"
        >
          <p className="eyebrow justify-center">Our Training Approach</p>
          <h2 className="text-[clamp(1.75rem,3.2vw,2.5rem)] font-extrabold tracking-tight">
            Learn. Practise. Perform.
          </h2>
          <p className="mt-3 text-[1.06rem] text-muted">
            People remember what they do, not what they hear. Our sessions are
            interactive, practical and designed to build confidence.
          </p>
        </motion.header>
        <ol className="mb-[clamp(48px,7vw,80px)] grid gap-6 md:grid-cols-3 md:gap-7">
          {[
            {
              num: "01",
              title: "Learn",
              text: "Understand the emergency: what is happening, the risks involved and the right priorities.",
            },
            {
              num: "02",
              title: "Practise",
              text: "Practise each skill repeatedly under guidance until it becomes instinct.",
            },
            {
              num: "03",
              title: "Perform",
              text: "Perform in realistic scenarios modelled on the environments where it will count.",
            },
          ].map((step, index) => (
            <motion.li
              key={step.num}
              {...fadeUp}
              className="relative rounded-[22px] border border-line bg-bg-alt px-7 py-8"
            >
              {index < 2 && (
                <span className="absolute right-[-18px] top-1/2 z-[1] hidden h-3 w-3 -translate-y-1/2 rotate-45 border-r-2 border-t-2 border-red-600 md:block" />
              )}
              <span className="mb-3.5 block font-display text-[2.6rem] font-extrabold leading-none text-red-600">
                {step.num}
              </span>
              <h3 className="text-[1.35rem] font-bold">{step.title}</h3>
              <p className="mt-2 text-muted">{step.text}</p>
            </motion.li>
          ))}
        </ol>
        <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
          <motion.div
            {...fadeUp}
            className="rounded-[22px] bg-green-800 p-9 text-white/80 max-sm:px-[22px]"
          >
            <h3 className="mb-7 text-[1.3rem] font-bold text-white">
              What defines our training
            </h3>
            <ul className="grid gap-[22px]">
              {[
                {
                  icon: HandHeart,
                  title: "Hands-on skills",
                  text: "Practical instruction that builds confidence through guided participation.",
                },
                {
                  icon: Target,
                  title: "Realistic scenarios",
                  text: "Activities shaped around real workplace and community situations.",
                },
                {
                  icon: Clock3,
                  title: "24/7 response readiness",
                  text: "Preparedness for emergencies that can happen at any hour.",
                },
              ].map((item) => (
                <li key={item.title} className="flex gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/10 text-[#f5c6cd]">
                    <item.icon className="h-[22px] w-[22px]" />
                  </span>
                  <div>
                    <strong className="mb-0.5 block font-display text-[1.05rem] text-white">
                      {item.title}
                    </strong>
                    <p className="text-[0.95rem]">{item.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            {...fadeUp}
            className="rounded-[22px] border border-line p-9 max-sm:px-[22px]"
          >
            <h3 className="mb-4 text-[1.3rem] font-bold">Who we serve</h3>
            <ul>
              {[
                { icon: Building2, label: "Corporate offices" },
                {
                  icon: GraduationCap,
                  label: "Schools & training institutions",
                },
                { icon: HardHat, label: "Construction & industrial sites" },
                { icon: Lock, label: "Security companies" },
                { icon: Home, label: "Community organisations" },
              ].map((item, index) => (
                <li
                  key={item.label}
                  className={`flex items-center gap-3.5 py-3 font-medium text-ink ${
                    index > 0 ? "border-t border-line" : ""
                  }`}
                >
                  <item.icon className="h-[22px] w-[22px] text-red-600" />
                  {item.label}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function About({ content }) {
  return (
    <section id="about" className="bg-bg-alt py-[clamp(72px,10vw,120px)]">
      <div className="mx-auto max-w-site px-[clamp(16px,4vw,32px)]">
        <div className="grid items-start gap-[clamp(40px,6vw,80px)] lg:grid-cols-[1fr_1.15fr]">
          <motion.div {...fadeUp}>
            <p className="eyebrow">{content.story_title || "About Us"}</p>
            <h2 className="mb-6 text-[clamp(1.75rem,3.2vw,2.5rem)] font-extrabold tracking-tight">
              {content.heading}
            </h2>
            <p className="mb-4">{content.story_paragraph_1}</p>
            <p className="mb-4">{content.story_paragraph_2}</p>
            <p className="mb-4">{content.story_paragraph_3}</p>
            <blockquote className="mt-7 border-l-4 border-red-600 py-[18px] pl-6 font-display text-[1.3rem] font-bold leading-snug text-green-800">
              {content.statement}
            </blockquote>
          </motion.div>
          <motion.figure {...fadeUp} className="lg:sticky lg:top-[100px]">
            <img
              src="/images/siig-team-photo.png"
              alt="SIIG representatives at a community safety event stand"
              className="aspect-[239/282] w-full rounded-[22px] bg-green-50 object-cover shadow-brand-lg"
              loading="lazy"
            />
            <figcaption className="mt-3 text-[0.86rem] text-muted">
              SIIG representatives at a community safety outreach event.
            </figcaption>
          </motion.figure>
        </div>
        <div className="mt-[clamp(56px,8vw,88px)] grid gap-6 md:grid-cols-2">
          <motion.article
            {...fadeUp}
            className="rounded-[22px] border border-line bg-white p-[34px]"
          >
            <span className="mb-5 grid h-[52px] w-[52px] place-items-center rounded-[14px] bg-green-50 text-green-700">
              <Target className="h-[26px] w-[26px]" />
            </span>
            <h3 className="text-[1.2rem] font-bold">Our Mission</h3>
            <p className="mt-2 text-[1.02rem] text-muted">
              To deliver practical, engaging and compliant safety training that
              empowers people, reduces risk, prevents injuries and ultimately
              saves lives.
            </p>
          </motion.article>
          <motion.article
            {...fadeUp}
            className="rounded-[22px] border border-line bg-white p-[34px]"
          >
            <span className="mb-5 grid h-[52px] w-[52px] place-items-center rounded-[14px] bg-green-50 text-green-700">
              <Shield className="h-[26px] w-[26px]" />
            </span>
            <h3 className="text-[1.2rem] font-bold">Our Vision</h3>
            <p className="mt-2 text-[1.02rem] text-muted">
              Safer communities and workplaces where every individual is
              confident, capable and prepared to respond effectively in an
              emergency.
            </p>
          </motion.article>
        </div>
        <motion.div
          {...fadeUp}
          className="mt-6 rounded-[22px] bg-green-800 px-9 py-9 max-sm:px-5"
        >
          <h3 className="mb-7 text-center text-[1.3rem] font-bold text-white">
            Our values{" "}
            <span className="font-semibold text-[#f5c6cd]">(PIIPE)</span>
          </h3>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              {
                letter: "P",
                title: "Preparedness",
                text: "Training must translate into action.",
              },
              {
                letter: "I",
                title: "Integrity",
                text: "Compliance delivered honestly and correctly.",
              },
              {
                letter: "I",
                title: "Impact",
                text: "Every person trained increases community safety.",
              },
              {
                letter: "P",
                title: "Practicality",
                text: "Skills must work in real situations.",
              },
              {
                letter: "E",
                title: "Empowerment",
                text: "Confidence is as important as knowledge.",
              },
            ].map((value) => (
              <li
                key={value.title}
                className="rounded-[14px] border border-white/10 bg-white/5 px-[18px] py-[22px] text-center"
              >
                <span className="mx-auto mb-3.5 grid h-12 w-12 place-items-center rounded-full bg-red-600 font-display text-[1.3rem] font-extrabold text-white">
                  {value.letter}
                </span>
                <strong className="mb-1.5 block font-display text-white">
                  {value.title}
                </strong>
                <p className="m-0 text-[0.9rem] text-white/70">{value.text}</p>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}

function CommunityInitiative() {
  return (
    <section id="community" className="py-[clamp(72px,10vw,120px)]">
      <div className="mx-auto max-w-site px-[clamp(16px,4vw,32px)]">
        <motion.header
          {...fadeUp}
          className="mx-auto mb-[clamp(40px,6vw,64px)] max-w-[860px] text-center"
        >
          <p className="eyebrow justify-center">
            Community Medical Support Initiative
          </p>
          <h2 className="text-[clamp(1.75rem,3.2vw,2.5rem)] font-extrabold tracking-tight">
            Supporting health through essential equipment donations
          </h2>
          <p className="mt-3 text-[1.06rem] text-muted">
            Access to basic medical supplies and emergency equipment can make
            the difference between life and loss. Many community institutions
            operate with limited resources, which leaves them exposed during
            medical or fire emergencies.
          </p>
          <p className="mt-4 text-[1.06rem] text-muted">
            As part of our social commitment, we run targeted donation
            initiatives to improve immediate response capability in underserved
            environments. No emergency response should fail because the right
            equipment was unavailable.
          </p>
        </motion.header>
        <motion.blockquote
          {...fadeUp}
          className="mx-auto mb-[clamp(40px,6vw,56px)] max-w-[860px] rounded-[22px] bg-red-50 px-8 py-[26px] text-center font-display text-[clamp(1.1rem,2vw,1.35rem)] font-bold leading-snug text-red-700"
        >
          Preparedness should not depend on resources. It should be available to
          everyone.
        </motion.blockquote>
        <div className="grid gap-6 md:grid-cols-2">
          <motion.article
            {...fadeUp}
            className="rounded-[22px] border border-line bg-white px-7 py-[30px]"
          >
            <span className="mb-5 grid h-[52px] w-[52px] place-items-center rounded-[14px] bg-green-50 text-green-700">
              <Heart className="h-[26px] w-[26px]" />
            </span>
            <h3 className="mb-4 text-[1.2rem] font-bold">Medical supplies</h3>
            <CheckList
              items={[
                "First aid kits",
                "Wound care materials",
                "Gloves and protective barriers",
                "CPR face shields",
                "Basic trauma supplies",
              ]}
            />
          </motion.article>
          <motion.article
            {...fadeUp}
            className="rounded-[22px] border border-line bg-white px-7 py-[30px]"
          >
            <span className="mb-5 grid h-[52px] w-[52px] place-items-center rounded-[14px] bg-green-50 text-green-700">
              <Package className="h-[26px] w-[26px]" />
            </span>
            <h3 className="mb-4 text-[1.2rem] font-bold">
              Emergency equipment
            </h3>
            <CheckList
              items={[
                "Fire extinguishers",
                "Emergency signage",
                "Basic evacuation equipment",
                "Safety instruction posters",
              ]}
            />
          </motion.article>
        </div>
        <div className="mt-[clamp(48px,7vw,72px)] grid gap-12 md:grid-cols-2">
          <motion.div {...fadeUp}>
            <h3 className="mb-4 text-[1.3rem] font-bold">Where we focus</h3>
            <p className="text-muted">
              We prioritise environments where immediate assistance is critical
              but resources are often limited:
            </p>
            <ul className="mt-3.5 flex flex-wrap gap-2">
              {[
                "Schools & early learning centres",
                "Community centres",
                "Non-profit organisations",
                "Small community workplaces",
                "Public gathering facilities",
              ].map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-green-100 bg-green-50 px-3.5 py-1.5 text-[0.88rem] font-medium text-green-800"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div {...fadeUp}>
            <h3 className="mb-4 text-[1.3rem] font-bold">
              Purpose of the initiative
            </h3>
            <p className="mb-4 text-muted">
              The aim is not only to provide items but to improve emergency
              readiness. Each donation is meant to:
            </p>
            <CheckList
              columns
              items={[
                "Increase response capability",
                "Reduce preventable injuries",
                "Support safer environments",
                "Strengthen community resilience",
              ]}
            />
          </motion.div>
        </div>
        <motion.div
          {...fadeUp}
          className="mt-[clamp(48px,7vw,72px)] flex items-center justify-between gap-8 rounded-[22px] border border-line bg-bg-alt px-10 py-9 max-md:flex-col max-md:items-start max-md:px-6"
        >
          <div>
            <h3 className="text-[1.4rem] font-bold">Partner with us</h3>
            <p className="mt-2 max-w-[680px] text-muted">
              We are committed to making safety accessible beyond our commercial
              services. We welcome organisations, sponsors and stakeholders who
              want to extend safety readiness in their communities.
            </p>
          </div>
          <a href="#contact" className="btn-primary shrink-0">
            Discuss a Partnership
            <ArrowRight className="h-4 w-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

function Team({ members }) {
  const placeholders = Array.from({ length: 4 }, (_, index) => ({
    id: `placeholder-${index}`,
  }));

  return (
    <section id="team" className="bg-bg-alt py-[clamp(72px,10vw,120px)]">
      <div className="mx-auto max-w-site px-[clamp(16px,4vw,32px)]">
        <motion.header
          {...fadeUp}
          className="mx-auto mb-[clamp(40px,6vw,64px)] max-w-[720px] text-center"
        >
          <p className="eyebrow justify-center">Our Team</p>
          <h2 className="text-[clamp(1.75rem,3.2vw,2.5rem)] font-extrabold tracking-tight">
            The people behind SIIG
          </h2>
        </motion.header>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-6">
          {members.length > 0
            ? members.map((member) => {
                const name = member.full_name || member.name;
                const role = member.position || member.role;
                const bio = member.biography || member.description;
                const initials = name
                  ?.split(/\s+/)
                  .slice(0, 2)
                  .map((part) => part[0])
                  .join("");
                return (
                  <motion.article
                    key={member.id}
                    {...fadeUp}
                    className="overflow-hidden rounded-[22px] border border-line bg-white"
                  >
                    <div className="grid aspect-square place-items-center bg-green-50 font-display text-[2.4rem] font-extrabold text-green-700">
                      {member.image_url ? (
                        <img
                          src={member.image_url}
                          alt={member.image_alt || `${name}, ${role}`}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        initials
                      )}
                    </div>
                    <div className="px-[22px] pb-6 pt-5">
                      <h3 className="mb-0.5 text-[1.2rem] font-bold">{name}</h3>
                      <p className="mb-2.5 text-[0.9rem] font-semibold text-red-600">
                        {role}
                      </p>
                      {bio && (
                        <p className="text-[0.92rem] text-muted">{bio}</p>
                      )}
                    </div>
                  </motion.article>
                );
              })
            : placeholders.map((placeholder, index) => (
                <motion.article
                  key={placeholder.id}
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: index * 0.06 }}
                  className="overflow-hidden rounded-[22px] border border-line bg-white"
                  aria-label="Team member profile placeholder"
                >
                  <div className="grid aspect-square place-items-center bg-green-50 text-green-700">
                    <Users
                      className="h-16 w-16 opacity-60"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="px-[22px] pb-6 pt-5">
                    <div className="mb-3 h-5 w-3/4 rounded bg-green-100" />
                    <div className="h-4 w-1/2 rounded bg-red-100" />
                  </div>
                </motion.article>
              ))}
        </div>
      </div>
    </section>
  );
}

function Gallery({ images }) {
  const galleryImages = images || [];
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = "";
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? galleryImages.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) =>
      prev === galleryImages.length - 1 ? 0 : prev + 1
    );
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "ArrowRight") goToNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen]);

  const currentImage = galleryImages[currentIndex];

  return (
    <section id="gallery" className="bg-bg-alt py-[clamp(72px,10vw,120px)]">
      <div className="mx-auto max-w-site px-[clamp(16px,4vw,32px)]">
        <motion.div {...fadeUp} className="mb-12 text-center">
          <p className="eyebrow">Our Gallery</p>
          <h2 className="text-[clamp(1.75rem,3.2vw,2.5rem)] font-extrabold tracking-tight">
            Moments of Impact
          </h2>
          <p className="mt-3 text-[1.05rem] text-muted">
            A glimpse into our training sessions, events, and community
            initiatives.
          </p>
        </motion.div>

        {galleryImages.length > 0 ? (
          <motion.div
            {...fadeUp}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {galleryImages.map((image, index) => (
              <motion.article
                key={image.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group overflow-hidden rounded-2xl bg-white shadow-sm cursor-pointer"
                onClick={() => openLightbox(index)}
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={image.image_url}
                    alt={image.image_alt || image.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-ink">{image.title}</h3>
                  {image.description && (
                    <p className="mt-2 text-sm text-muted line-clamp-2">
                      {image.description}
                    </p>
                  )}
                </div>
              </motion.article>
            ))}
          </motion.div>
        ) : (
          <motion.div
            {...fadeUp}
            className="rounded-2xl border-2 border-dashed border-line bg-white p-12 text-center"
          >
            <Package className="mx-auto h-16 w-16 text-muted" />
            <p className="mt-4 font-bold text-ink">No gallery images yet</p>
            <p className="mt-2 text-muted">
              Check back soon to see our training sessions and events.
            </p>
          </motion.div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && currentImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            className="fixed inset-0 z-[150] flex items-center justify-center bg-black/90 p-4"
          >
            <button
              onClick={closeLightbox}
              className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition"
              aria-label="Close lightbox"
            >
              <X className="h-6 w-6" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition"
              aria-label="Previous image"
            >
              <ArrowUp className="h-6 w-6 -rotate-90" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition"
              aria-label="Next image"
            >
              <ArrowUp className="h-6 w-6 rotate-90" />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="flex max-h-[90vh] max-w-[90vw] flex-col items-center justify-center"
            >
              <img
                src={currentImage.image_url}
                alt={currentImage.image_alt || currentImage.title}
                className="max-h-[calc(90vh-120px)] max-w-[90vw] object-contain"
              />
              <div className="mt-4 text-center px-4">
                <h3 className="text-xl font-bold text-white">
                  {currentImage.title}
                </h3>
                {currentImage.description && (
                  <p className="mt-2 text-white/80">
                    {currentImage.description}
                  </p>
                )}
                <p className="mt-2 text-sm text-white/60">
                  {currentIndex + 1} / {galleryImages.length}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function CallToAction({ content }) {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(120deg,#8f1a2b,#a51f33_55%,#b8283d)] py-[clamp(56px,8vw,88px)] text-white">
      <span className="pointer-events-none absolute -right-[120px] -top-[120px] h-[420px] w-[420px] rounded-full border-[60px] border-white/5" />
      <div className="relative mx-auto flex max-w-site items-center justify-between gap-10 px-[clamp(16px,4vw,32px)] max-[980px]:flex-col max-[980px]:items-start">
        <div>
          <p className="eyebrow mb-4 text-white/80 before:bg-white/80">
            {content.eyebrow}
          </p>
          <h2 className="m-0 max-w-[760px] text-[clamp(1.75rem,3.2vw,2.5rem)] font-extrabold tracking-tight text-white">
            {content.title}
          </h2>
        </div>
        <a href="#contact" className="btn-light shrink-0">
          {content.button}
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}

function Contact({ content }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: INTEREST_OPTIONS[0],
    message: "",
  });
  const [submitState, setSubmitState] = useState({
    loading: false,
    message: "",
    error: false,
  });

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSupabaseConfigured) {
      setSubmitState({ loading: true, message: "", error: false });
      const { error } = await supabase.from("enquiries").insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        interested_in: formData.service,
        message: formData.message,
      });
      if (!error) {
        setSubmitState({
          loading: false,
          message: "Thank you for your message! We will get back to you soon.",
          error: false,
        });
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          service: INTEREST_OPTIONS[0],
          message: "",
        });
      } else {
        setSubmitState({
          loading: false,
          message: "Error submitting form. Please try again.",
          error: true,
        });
      }
    } else {
      const mailtoLink = `mailto:${content.email}?subject=${encodeURIComponent(
        `${formData.service} from${formData.name}`
      )}&body=${encodeURIComponent(
        `Name: ${formData.name}\nEmail:${formData.email}\nPhone: ${formData.phone}\nOrganisation:${formData.company}\nInterest: ${formData.service}\n\nMessage:\n${formData.message}`
      )}`;
      window.location.href = mailtoLink;
    }
  };

  const fieldClass =
    "w-full rounded-[10px] border-[1.5px] border-line bg-white px-3.5 py-3 text-[0.96rem] text-ink outline-none transition placeholder:text-[#9aa8a1] focus:border-green-600 focus:shadow-[0_0_0_4px_rgba(27,106,82,0.14)]";

  return (
    <section id="contact" className="py-[clamp(72px,10vw,120px)]">
      <div className="mx-auto grid max-w-site items-start gap-[clamp(40px,6vw,80px)] px-[clamp(16px,4vw,32px)] lg:grid-cols-[1fr_1.15fr]">
        <motion.div {...fadeUp}>
          <p className="eyebrow">Contact Us</p>
          <h2 className="text-[clamp(1.75rem,3.2vw,2.5rem)] font-extrabold tracking-tight">
            {content.heading}
          </h2>
          <p className="mt-3 text-[1.05rem] text-muted">{content.intro}</p>
          <ul className="mt-8 grid gap-3.5">
            {[
              {
                icon: Phone,
                label: "Phone",
                href: `tel:${content.phone_link}`,
                value: content.phone,
              },
              {
                icon: Mail,
                label: "Email",
                href: `mailto:${content.email}`,
                value: content.email,
              },
              {
                icon: Instagram,
                label: "Instagram",
                href: content.instagram_url,
                value: content.instagram,
                external: true,
              },
            ].map((item) => (
              <li
                key={item.label}
                className="flex items-center gap-4 rounded-[14px] border border-line px-5 py-[18px] transition hover:border-green-100 hover:shadow-sm"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-green-50 text-green-700">
                  <item.icon className="h-5 w-5" />
                </span>
                <div>
                  <span className="block text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-muted">
                    {item.label}
                  </span>
                  <a
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    className="break-words font-semibold text-ink hover:text-red-600"
                  >
                    {item.value}
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>
        <motion.form
          {...fadeUp}
          onSubmit={handleSubmit}
          className="rounded-[22px] border border-line bg-bg-alt p-[clamp(24px,4vw,40px)]"
        >
          <h3 className="mb-5 text-[1.4rem] font-bold">Send us a message</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="mb-[18px] block text-[0.88rem] font-semibold text-ink">
              Full name <span className="text-red-600">*</span>
              <input
                className={`${fieldClass} mt-1.5`}
                type="text"
                name="name"
                autoComplete="name"
                placeholder="Your name"
                required
                value={formData.name}
                onChange={handleChange}
              />
            </label>
            <label className="mb-[18px] block text-[0.88rem] font-semibold text-ink">
              Email <span className="text-red-600">*</span>
              <input
                className={`${fieldClass} mt-1.5`}
                type="email"
                name="email"
                autoComplete="email"
                placeholder="you@company.com"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="mb-[18px] block text-[0.88rem] font-semibold text-ink">
              Phone
              <input
                className={`${fieldClass} mt-1.5`}
                type="tel"
                name="phone"
                autoComplete="tel"
                placeholder="+233 XX XXX XXXX"
                value={formData.phone}
                onChange={handleChange}
              />
            </label>
            <label className="mb-[18px] block text-[0.88rem] font-semibold text-ink">
              Organisation
              <input
                className={`${fieldClass} mt-1.5`}
                type="text"
                name="company"
                autoComplete="organization"
                placeholder="Company or organisation"
                value={formData.company}
                onChange={handleChange}
              />
            </label>
          </div>
          <label className="mb-[18px] block text-[0.88rem] font-semibold text-ink">
            I'm interested in
            <select
              className={`${fieldClass} mt-1.5`}
              name="service"
              value={formData.service}
              onChange={handleChange}
            >
              {INTEREST_OPTIONS.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>
          <label className="mb-[18px] block text-[0.88rem] font-semibold text-ink">
            Message <span className="text-red-600">*</span>
            <textarea
              className={`${fieldClass} mt-1.5 min-h-[130px] resize-y`}
              name="message"
              placeholder="How can we help you?"
              required
              value={formData.message}
              onChange={handleChange}
            />
          </label>
          <button
            type="submit"
            disabled={submitState.loading}
            className="btn-primary-lg w-full disabled:opacity-60"
          >
            {submitState.loading ? "Sending..." : "Send Message"}
            <Send className="h-4 w-4" />
          </button>
          {!isSupabaseConfigured && (
            <p className="mt-1.5 text-[0.82rem] text-muted">
              Submitting opens your email app with the message pre-filled.
            </p>
          )}
          {submitState.message && (
            <p
              className={`mt-3.5 text-[0.92rem] font-medium ${
                submitState.error ? "text-red-600" : "text-green-700"
              }`}
            >
              {submitState.message}
            </p>
          )}
        </motion.form>
      </div>
    </section>
  );
}

function Footer({ contact }) {
  return (
    <footer className="bg-green-950 pt-[clamp(56px,8vw,80px)] text-[0.94rem] text-white/70">
      <div className="mx-auto grid max-w-site gap-10 px-[clamp(16px,4vw,32px)] pb-12 md:grid-cols-2 xl:grid-cols-[1.5fr_1fr_1fr_1.4fr]">
        <div>
          <Brand light />
          <p className="mt-[18px] max-w-[320px]">
            Practical safety training and emergency preparedness for workplaces,
            events and communities.
          </p>
        </div>
        <div>
          <h4 className="mb-[18px] font-sans text-[0.82rem] uppercase tracking-[0.12em] text-white">
            Services
          </h4>
          <ul className="grid gap-2.5">
            <li>
              <a className="hover:text-white" href="#first-aid">
                First Aid Training
              </a>
            </li>
            <li>
              <a className="hover:text-white" href="#fire-safety">
                Fire Safety Training
              </a>
            </li>
            <li>
              <a className="hover:text-white" href="#compliance">
                Workplace Compliance
              </a>
            </li>
            <li>
              <a className="hover:text-white" href="#events">
                Event Safety & Care
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="mb-[18px] font-sans text-[0.82rem] uppercase tracking-[0.12em] text-white">
            Company
          </h4>
          <ul className="grid gap-2.5">
            <li>
              <a className="hover:text-white" href="#about">
                About Us
              </a>
            </li>
            <li>
              <a className="hover:text-white" href="#training">
                Our Approach
              </a>
            </li>
            <li>
              <a className="hover:text-white" href="#community">
                Community Initiative
              </a>
            </li>
            <li>
              <a className="hover:text-white" href="#contact">
                Contact
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="mb-[18px] font-sans text-[0.82rem] uppercase tracking-[0.12em] text-white">
            Get in touch
          </h4>
          <ul className="grid gap-2.5">
            <li>
              <a
                className="inline-flex items-center gap-2.5 hover:text-white"
                href={`tel:${contact.phone_link}`}
              >
                <Phone className="h-4 w-4 text-[#f5c6cd]" />
                {contact.phone}
              </a>
            </li>
            <li>
              <a
                className="inline-flex items-center gap-2.5 break-words hover:text-white"
                href={`mailto:${contact.email}`}
              >
                <Mail className="h-4 w-4 text-[#f5c6cd]" />
                {contact.email}
              </a>
            </li>
            <li>
              <a
                className="inline-flex items-center gap-2.5 hover:text-white"
                href={contact.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="h-4 w-4 text-[#f5c6cd]" />
                {contact.instagram}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="mx-auto flex max-w-site items-center justify-between gap-4 border-t border-white/10 px-[clamp(16px,4vw,32px)] py-6 text-[0.86rem] max-sm:flex-col max-sm:items-start">
        <p className="m-0">
          © {new Date().getFullYear()} Safety Innovations Impact Group Limited.
          All rights reserved.
        </p>
        <a
          href="#top"
          className="inline-flex items-center gap-1.5 font-semibold hover:text-white"
        >
          Back to top
          <ArrowUp className="h-4 w-4" />
        </a>
      </div>
    </footer>
  );
}

function PublicSite() {
  const content = useSiteContent();
  const { members } = useTeamMembers();
  const { images } = useGallery();
  const hero = content.hero || {};
  const about = content.about || {};
  const cta = content.call_to_action || {};
  const contact = content.contact || {};

  return (
    <div id="top" className="public-site min-h-screen bg-white text-body">
      <a
        href="#services"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[200] focus:rounded-lg focus:bg-green-800 focus:px-4 focus:py-2.5 focus:text-white"
      >
        Skip to content
      </a>

      {/* Sticky Header Wrapper for Topbar and Navbar */}
      <div className="sticky top-0 z-[100] w-full bg-white shadow-sm">
        <Topbar contact={contact} />
        <Navbar />
      </div>

      <Hero content={hero} />
      <Articles />
      <ServicesOverview />
      <SplitService
        id="first-aid"
        altBg
        eyebrow="Service 01"
        title="First Aid Training"
        lead="Our first aid programmes focus on realistic response, not memorisation. Participants practise repeatedly until they can act confidently and without hesitation."
        image="/images/first-aid-cpr-training.jpg"
        alt="Participant practising chest compressions on a CPR manikin during a first aid training session"
        lists={[
          {
            title: "Courses include",
            items: [
              "Basic First Aid",
              "CPR & AED Use",
              "Workplace First Aid Certification",
              "Paediatric First Aid",
              "Emergency Scene Management",
              "Refresher & Recertification Training",
            ],
          },
          {
            title: "Participants learn to",
            items: [
              "Assess an emergency safely",
              "Stabilise injured persons",
              "Perform CPR correctly",
              "Control bleeding and shock",
              "Manage medical emergencies until professionals arrive",
            ],
          },
        ]}
      />
      <SplitService
        id="fire-safety"
        reverse
        eyebrow="Service 02"
        title="Fire Safety Training"
        lead="Fire emergencies escalate rapidly. Our fire safety training ensures staff know exactly what to do in the first critical minutes."
        image="/images/fire-safety-training.jpg"
        alt="Participants practising fire extinguisher use during an outdoor safety exercise"
        lists={[
          {
            title: "Programmes include",
            items: [
              "Fire Awareness",
              "Fire Warden / Fire Marshal Training",
              "Fire Extinguisher Identification & Use",
              "Evacuation Procedures",
              "Practical Fire Drills",
            ],
          },
        ]}
      />
      <SplitService
        id="compliance"
        altBg
        eyebrow="Service 03"
        title="Workplace Safety & Compliance Support"
        lead="We help organisations move beyond paperwork toward real readiness."
        image="/images/workplace-safety.jpg"
        alt="Safety professionals in hard hats reviewing a workplace plan on site"
        lists={[
          {
            title: "Services include",
            items: [
              "Emergency Evacuation Planning",
              "Risk Assessments",
              "Safety Audits & Inspections",
              "Safety File Guidance",
              "Toolbox Talks & Staff Safety Briefings",
            ],
          },
        ]}
        extra={
          <div className="mt-[30px]">
            <h3 className="mb-3.5 font-sans text-[0.8rem] font-bold uppercase tracking-[0.12em] text-green-700">
              Safety equipment guidance
            </h3>
            <p className="mb-3 text-[0.93rem] text-muted">
              We advise on the right selection and placement of:
            </p>
            <ul className="flex flex-wrap gap-2">
              {[
                "First Aid Kits",
                "Fire Extinguishers",
                "Emergency Signage",
                "AED Devices",
              ].map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-green-100 bg-green-50 px-3.5 py-1.5 text-[0.88rem] font-medium text-green-800"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        }
      />
      <EventSafety />
      <TrainingApproach />
      <About content={about} />
      <CommunityInitiative />
      <Team members={members} />
      <Gallery images={images} />
      <CallToAction content={cta} />
      <Contact content={contact} />
      <Footer contact={contact} />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/*" element={<AdminRouter />} />
        <Route path="*" element={<PublicSite />} />
      </Routes>
    </Router>
  );
}

export default App;
