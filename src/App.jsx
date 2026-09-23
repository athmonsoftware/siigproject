import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Shield,
  CheckCircle,
  ArrowRight,
  Users,
  Target,
  Award,
  Mail,
  Phone,
  Send,
  Menu,
  X,
} from "lucide-react";
import { useSiteContent } from "./hooks/useSiteContent";
import { isSupabaseConfigured, supabase } from "./lib/supabase";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [scrollProgress, setScrollProgress] = useState(0);

  const navLinks = [
    { name: "Home", href: "#home", id: "home" },
    { name: "Services", href: "#services" },
    { name: "Training", href: "#training" },
    { name: "About", href: "#about" },
    { name: "Community", href: "#community" },
    { name: "Contact", href: "#contact", id: "contact" },
  ];

  useEffect(() => {
    const sectionIds = navLinks.map((link) => link.id || link.href.slice(1));
    const updateProgress = () => {
      const available = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(available > 0 ? Math.min(100, (window.scrollY / available) * 100) : 0);
    };
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: "-24% 0px -60% 0px", threshold: [0.05, 0.2, 0.5] },
    );
    sectionIds.forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateProgress);
    };
  }, []);

  const navigate = (id) => {
    setActiveSection(id);
    setIsOpen(false);
  };

  return (
    <nav aria-label="Primary navigation" className="fixed inset-x-0 top-0 z-50 border-b border-white/15 bg-[#123d2f]/95 shadow-[0_12px_35px_rgba(0,0,0,0.2)] backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#home" onClick={() => navigate("home")} className="flex min-w-0 items-center gap-3" aria-label="SIIG home">
          <img src="/logo.png" alt="" className="h-11 w-11 shrink-0 object-contain" />
          <div className="min-w-0">
            <div className="text-lg font-black leading-none tracking-[0.12em] text-white">SIIG</div>
            <div className="mt-1 hidden truncate text-[9px] font-bold uppercase tracking-[0.16em] text-white/55 sm:block">Safety Innovations Impact Group</div>
          </div>
        </a>

        <div className="hidden items-center border border-white/15 bg-black/10 p-1 md:flex" aria-label="Website sections">
          {navLinks.map((link) => {
            const id = link.id || link.href.slice(1);
            const active = activeSection === id;
            return (
              <a
                key={link.name}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`relative px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] transition-colors lg:px-4 ${active ? "bg-white text-[#123d2f]" : "text-white/70 hover:bg-white/10 hover:text-white"}`}
                onClick={() => navigate(id)}
              >
                {link.name}
              </a>
            );
          })}
        </div>

        <button
          className="grid h-11 w-11 place-items-center border border-white/25 text-white transition hover:bg-white/10 md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          aria-label={isOpen ? "Close navigation" : "Open navigation"}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-[2px] bg-white/10" aria-hidden="true">
        <div className="h-full bg-brand-red transition-[width] duration-150" style={{ width: `${scrollProgress}%` }} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-navigation"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22 }}
            className="absolute inset-x-0 top-full border-b border-white/15 bg-[#123d2f] p-4 shadow-2xl md:hidden"
          >
            <div className="mx-auto grid max-w-7xl grid-cols-2 gap-2">
              {navLinks.map((link) => {
                const id = link.id || link.href.slice(1);
                const active = activeSection === id;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`border px-4 py-4 text-sm font-bold uppercase tracking-[0.08em] transition ${active ? "border-white bg-white text-[#123d2f]" : "border-white/15 text-white/80 hover:bg-white/10"}`}
                    onClick={() => navigate(id)}
                  >
                    <span className="mr-2 text-white/35">0{navLinks.indexOf(link) + 1}</span>{link.name}
                  </a>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = ({ content }) => {
  return (
    <section id="home" className="relative min-h-screen scroll-mt-20 flex items-center justify-center overflow-hidden bg-gradient-to-br from-brand-green via-brand-green/90 to-brand-green/80 text-white pt-28 pb-12">

      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-brand-red/30 rounded-full"
            initial={{
              x: Math.random() * 100 + "%",
              y: Math.random() * 100 + "%",
              scale: Math.random() * 0.5 + 0.5,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-red rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-pulse pointer-events-none"></div>
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-blue rounded-full mix-blend-screen filter blur-[120px] opacity-15 animate-pulse pointer-events-none"
        style={{ animationDelay: "-3s" }}
      ></div>

      {/* Hero Content Area */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-4xl mx-auto px-4 text-center mt-12"
      >
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 p-8 md:p-16 rounded-3xl shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="inline-block bg-white/15 text-brand-red text-xs px-3 py-1 rounded-full uppercase tracking-widest font-semibold mb-6 border border-white/10">
                {content.eyebrow}
              </span>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-4xl md:text-6xl font-black tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400 leading-tight"
              >
                {content.title.split("\n").map((line, index) => (
                  <React.Fragment key={line}>{index > 0 && <br />}{line}</React.Fragment>
                ))}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
              >
                {content.description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="flex flex-col sm:flex-row justify-center items-center gap-4"
              >
                <a
                  href="#services"
                  className="w-full sm:w-auto bg-white text-black hover:bg-gray-200 px-8 py-4 rounded-xl font-bold transition shadow-xl flex items-center justify-center"
                >
                  {content.primary_button}
                  <ArrowRight className="inline ml-2 w-5 h-5" />
                </a>
                <a
                  href="#contact"
                  className="w-full sm:w-auto backdrop-blur-md bg-white/10 border border-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-bold transition"
                >
                  {content.secondary_button}
                </a>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="relative"
            >
              <img
                src="/images/siig-team-photo.png"
                alt="SIIG team members beside a safety display"
                className="rounded-2xl shadow-2xl w-full max-h-[32rem] object-contain mx-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-green/50 to-transparent rounded-2xl"></div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

const ServiceCard = ({ icon: Icon, title, description, features, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
      className="backdrop-blur-xl bg-white/10 border border-white/20 p-8 rounded-3xl shadow-xl group hover:border-brand-green/50 transition-all duration-300"
    >
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-brand-green to-brand-red mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-brand-green/20">
        <Icon className="w-8 h-8 text-white" />
      </div>

      <h3 className="text-2xl font-bold mb-4 text-white">{title}</h3>
      <p className="text-gray-300 mb-6 leading-relaxed">{description}</p>

      {features && (
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center text-gray-400">
              <CheckCircle className="w-4 h-4 mr-2 text-brand-red shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
};

const Services = () => {
  return (
    <section id="services" className="py-24 px-4 relative bg-brand-green">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center mb-16 text-white"
        >
          Our Services
        </motion.h2>

        {/* First Aid Training */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="backdrop-blur-xl bg-white/10 border border-white/20 p-8 md:p-12 rounded-3xl shadow-xl mb-12 hover:shadow-2xl hover:border-brand-red/50 transition-all duration-500 group"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-brand-green/30 rounded-xl">
              <Heart className="w-8 h-8 text-brand-red" />
            </div>
            <h3 className="text-2xl font-bold text-white">
              First Aid Training
            </h3>
          </div>
          <p className="text-gray-300 leading-relaxed mb-6">
            Our first aid programs focus on realistic response, not
            memorisation. Participants practice repeatedly until they can act
            confidently without hesitation.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-bold text-white mb-4">
                Courses Include:
              </h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-brand-red shrink-0" />
                  Basic First Aid
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-brand-red shrink-0" />
                  CPR & AED Use
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-brand-red shrink-0" />
                  Workplace First Aid Certification
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-brand-red shrink-0" />
                  Pediatric First Aid
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-brand-red shrink-0" />
                  Emergency Scene Management
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-brand-red shrink-0" />
                  Refresher & Recertification Training
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold text-white mb-4">
                Participants Learn How To:
              </h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-brand-red shrink-0" />
                  Assess an emergency safely
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-brand-red shrink-0" />
                  Stabilise injured persons
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-brand-red shrink-0" />
                  Perform CPR correctly
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-brand-red shrink-0" />
                  Control bleeding and shock
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-brand-red shrink-0" />
                  Manage medical emergencies until professionals arrive
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Fire Safety Training */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-8 md:p-12 rounded-3xl shadow-xl mb-12 hover:shadow-2xl hover:border-brand-red/50 transition-all duration-500 group"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-brand-green/30 rounded-xl">
              <Shield className="w-8 h-8 text-brand-red" />
            </div>
            <h3 className="text-2xl font-bold text-white">
              Fire Safety Training
            </h3>
          </div>
          <p className="text-gray-300 leading-relaxed mb-6">
            Fire emergencies escalate rapidly. Our fire safety training ensures
            staff know exactly what to do in the first critical minutes.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-bold text-white mb-4">
                Programs Include:
              </h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-brand-red shrink-0" />
                  Fire Awareness
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-brand-red shrink-0" />
                  Fire Warden / Fire Marshal Training
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-brand-red shrink-0" />
                  Fire Extinguisher Identification & Use
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-brand-red shrink-0" />
                  Evacuation Procedures
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-brand-red shrink-0" />
                  Practical Fire Drills
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold text-white mb-4">
                Participants Learn How To:
              </h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-brand-red shrink-0" />
                  Assess an emergency safely
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-brand-red shrink-0" />
                  Stabilise injured persons
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-brand-red shrink-0" />
                  Perform CPR correctly
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-brand-red shrink-0" />
                  Control bleeding and shock
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-brand-red shrink-0" />
                  Manage medical emergencies until professionals arrive
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Workplace Safety & Compliance Support */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="backdrop-blur-xl bg-white/10 border border-white/20 p-8 md:p-12 rounded-3xl shadow-xl mb-12 hover:shadow-2xl hover:border-brand-red/50 transition-all duration-500 group"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-brand-green/30 rounded-xl">
              <CheckCircle className="w-8 h-8 text-brand-red" />
            </div>
            <h3 className="text-2xl font-bold text-white">
              Workplace Safety & Compliance Support
            </h3>
          </div>
          <p className="text-gray-300 leading-relaxed mb-6">
            We assist organisations in moving beyond paperwork toward real
            readiness.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-bold text-white mb-4">
                Services Include:
              </h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-brand-red shrink-0" />
                  Emergency Evacuation Planning
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-brand-red shrink-0" />
                  Risk Assessments
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-brand-red shrink-0" />
                  Safety Audits & Inspections
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-brand-red shrink-0" />
                  Safety File Guidance
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-brand-red shrink-0" />
                  Toolbox Talks & Staff Safety Briefings
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-brand-red shrink-0" />
                  Safety Equipment Guidance
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold text-white mb-4">
                Equipment Guidance:
              </h4>
              <p className="text-gray-400 mb-4">
                We advise organisations on appropriate placement and selection
                of:
              </p>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-brand-red shrink-0" />
                  First Aid Kits
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-brand-red shrink-0" />
                  Fire Extinguishers
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-brand-red shrink-0" />
                  Emergency Signage
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-brand-red shrink-0" />
                  AED Devices
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Event Safety and Care Support Services */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="backdrop-blur-xl bg-white/10 border border-white/20 p-8 md:p-12 rounded-3xl shadow-xl hover:shadow-2xl hover:border-brand-red/50 transition-all duration-500 group"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-brand-green/30 rounded-xl">
              <Users className="w-8 h-8 text-brand-red" />
            </div>
            <h3 className="text-2xl font-bold text-white">
              Event Safety and Care Support Services
            </h3>
          </div>
          <p className="text-gray-300 leading-relaxed mb-6">
            Professional Protection for Gatherings of Any Size. Public and
            private events bring people together — but they also increase risk.
            Large crowds, unfamiliar environments, medical conditions, and
            unexpected incidents require immediate, calm, and qualified
            response.
          </p>
          <p className="text-gray-300 leading-relaxed mb-6">
            Safety Innovations Impact Group provides trained safety personnel to
            manage medical situations, assist vulnerable guests, and support
            organisers in maintaining a safe event environment. Our presence
            allows organisers to focus on the event while we focus on safety.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h4 className="text-lg font-bold text-white mb-4">
                On-Site Event First Aid Cover
              </h4>
              <p className="text-gray-400 mb-4">
                We deploy trained responders equipped to handle medical
                incidents from minor injuries to urgent emergencies.
              </p>
              <p className="text-gray-400 mb-4">We manage:</p>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-brand-red shrink-0" />
                  Fainting and dehydration
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-brand-red shrink-0" />
                  Cuts and minor injuries
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-brand-red shrink-0" />
                  Allergic reactions
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-brand-red shrink-0" />
                  Breathing difficulties
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-brand-red shrink-0" />
                  Medical episodes
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-brand-red shrink-0" />
                  Stabilisation before ambulance arrival
                </li>
              </ul>
              <p className="text-gray-400 mt-4">
                Service includes: Pre-event risk assessment, Strategically
                positioned responders, Communication coordination, Incident
                documentation
              </p>
            </div>

            <div>
              <h4 className="text-lg font-bold text-white mb-4">
                Elderly & Assisted Guest Support
              </h4>
              <p className="text-gray-400 mb-4">
                Some attendees require additional care, supervision, or mobility
                assistance during events. Our team provides respectful,
                non-intrusive assistance ensuring comfort and dignity throughout
                the event.
              </p>
              <p className="text-gray-400 mb-4">Support services:</p>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-brand-red shrink-0" />
                  Mobility assistance
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-brand-red shrink-0" />
                  Monitoring health conditions
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-brand-red shrink-0" />
                  Medication reminders (non-clinical)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-brand-red shrink-0" />
                  Heat and fatigue monitoring
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-brand-red shrink-0" />
                  Calm reassurance during crowded situations
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-brand-red shrink-0" />
                  Escorting to rest or medical areas
                </li>
              </ul>
              <p className="text-gray-400 mt-4">
                Especially valuable for: Family gatherings, Community events,
                Conferences, Religious gatherings, Corporate functions
              </p>
            </div>
          </div>

          <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-6 rounded-2xl">
            <h4 className="text-lg font-bold text-white mb-4">
              Fire & Emergency Preparedness Presence
            </h4>
            <p className="text-gray-400 mb-4">
              Where required, we support event organisers with preventative
              safety oversight. Includes:
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-400">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-brand-red shrink-0" />
                Identifying hazards
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-brand-red shrink-0" />
                Monitoring exits and crowd flow
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-brand-red shrink-0" />
                Assisting with evacuation if necessary
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-brand-red shrink-0" />
                Coordinating with emergency services
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div>
              <h4 className="text-lg font-bold text-white mb-4">
                Why Event Organisers Choose Us
              </h4>
              <ul className="space-y-2 text-gray-400">
                {[
                  "Visible safety presence for peace of mind",
                  "Reduced liability risk",
                  "Faster response times",
                  "Professional guest care",
                  "Support for vulnerable attendees",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-red shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold text-white mb-4">
                Ideal for Events Such As
              </h4>
              <p className="text-gray-400 leading-relaxed">
                Corporate events, school functions, community gatherings,
                sporting events, festivals, private celebrations, and religious
                events.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const TrainingApproach = () => {
  return (
    <section
      id="training"
      className="py-24 px-4 bg-gradient-to-br from-brand-green via-brand-green/95 to-brand-green/90 relative overflow-hidden"
    >
      {/* Decorative background elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-red/10 rounded-full blur-3xl animate-pulse"></div>
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-blue/10 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "-2s" }}
      ></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center mb-16 text-white"
        >
          Our Training Approach
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="backdrop-blur-xl bg-white/10 border border-white/20 p-8 md:p-12 rounded-3xl shadow-xl mb-12"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <img
                src="/images/siig-team-photo.png"
                alt="SIIG team members at a community safety event"
                className="rounded-2xl shadow-2xl w-full max-h-[32rem] object-contain mx-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-green/30 to-transparent rounded-2xl"></div>
            </motion.div>
            <div>
              <p className="text-gray-300 leading-relaxed mb-8">
                We use a Learn — Practice — Perform methodology.
              </p>

              <div className="grid grid-cols-1 gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-green to-brand-red flex items-center justify-center shrink-0">
                    <span className="text-lg font-bold text-white">1</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">
                      Understand the emergency
                    </h4>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-green to-brand-red flex items-center justify-center shrink-0">
                    <span className="text-lg font-bold text-white">2</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">
                      Practice the skill repeatedly
                    </h4>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-green to-brand-red flex items-center justify-center shrink-0">
                    <span className="text-lg font-bold text-white">3</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">
                      Perform in realistic scenarios
                    </h4>
                  </div>
                </div>
              </div>

              <p className="text-gray-300 leading-relaxed mt-8">
                People remember what they do, not what they hear. Our sessions
                are interactive, practical, and confidence-building.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="backdrop-blur-xl bg-white/10 border border-white/20 p-8 md:p-12 rounded-3xl shadow-xl"
        >
          <h3 className="text-2xl font-bold text-white mb-6">Who We Serve</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-brand-red shrink-0" />
              <span className="text-gray-300">Corporate offices</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-brand-red shrink-0" />
              <span className="text-gray-300">
                Schools & training institutions
              </span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-brand-red shrink-0" />
              <span className="text-gray-300">
                Construction & industrial sites
              </span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-brand-red shrink-0" />
              <span className="text-gray-300">Warehouses & logistics</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-brand-red shrink-0" />
              <span className="text-gray-300">Retail & hospitality</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-brand-red shrink-0" />
              <span className="text-gray-300">Security companies</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-brand-red shrink-0" />
              <span className="text-gray-300">Community organisations</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const About = ({ content }) => {
  return (
    <section
      id="about"
      className="py-24 px-4 bg-gradient-to-br from-brand-green via-brand-green/95 to-brand-green/90 relative overflow-hidden"
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-blue/10 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center mb-16 text-white"
        >
          {content.heading}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="backdrop-blur-xl bg-white/10 border border-white/20 p-8 md:p-12 rounded-3xl shadow-xl mb-12"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">{content.story_title}</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                {content.story_paragraph_1}
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                {content.story_paragraph_2}
              </p>
              <p className="text-gray-300 leading-relaxed">
                {content.story_paragraph_3}
              </p>
              <p className="text-brand-red font-semibold mt-4 italic">
                {content.statement}
              </p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <img
                src="/images/siig-team-photo.png"
                alt="SIIG team members beside a safety display"
                className="rounded-2xl shadow-2xl w-full max-h-[32rem] object-contain mx-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-green/30 to-transparent rounded-2xl"></div>
            </motion.div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="backdrop-blur-xl bg-white/10 border border-white/20 p-8 rounded-3xl shadow-xl"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-brand-green/30 rounded-xl">
                <Target className="w-8 h-8 text-brand-red" />
              </div>
              <h3 className="text-2xl font-bold text-white">Our Mission</h3>
            </div>
            <p className="text-gray-300 leading-relaxed">
              To deliver practical, engaging, and compliant safety training that
              empowers people, reduces risk, prevents injuries, and ultimately
              saves lives.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="backdrop-blur-xl bg-white/10 border border-white/20 p-8 rounded-3xl shadow-xl"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-brand-green/30 rounded-xl">
                <Award className="w-8 h-8 text-brand-red" />
              </div>
              <h3 className="text-2xl font-bold text-white">Our Vision</h3>
            </div>
            <p className="text-gray-300 leading-relaxed">
              To build safer communities and workplaces where every individual
              is confident, capable, and prepared to respond effectively in an
              emergency.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="backdrop-blur-xl bg-white/10 border border-white/20 p-8 md:p-12 rounded-3xl shadow-xl"
        >
          <h3 className="text-2xl font-bold text-white mb-6">
            Our Values (PIIPE)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-brand-green/30 rounded-lg shrink-0">
                <Shield className="w-6 h-6 text-brand-red" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-2">
                  Preparedness
                </h4>
                <p className="text-gray-400 text-sm">
                  Training must translate into action.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 bg-brand-green/30 rounded-lg shrink-0">
                <Shield className="w-6 h-6 text-brand-red" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-2">Integrity</h4>
                <p className="text-gray-400 text-sm">
                  Compliance delivered honestly and correctly.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 bg-brand-green/30 rounded-lg shrink-0">
                <Shield className="w-6 h-6 text-brand-red" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-2">Impact</h4>
                <p className="text-gray-400 text-sm">
                  Every person trained increases community safety.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 bg-brand-green/30 rounded-lg shrink-0">
                <Shield className="w-6 h-6 text-brand-red" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-2">
                  Practicality
                </h4>
                <p className="text-gray-400 text-sm">
                  Skills must work in real situations.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 md:col-span-2">
              <div className="p-2 bg-brand-green/30 rounded-lg shrink-0">
                <Shield className="w-6 h-6 text-brand-red" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-2">
                  Empowerment
                </h4>
                <p className="text-gray-400 text-sm">
                  Confidence is as important as knowledge.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const CommunityInitiative = () => {
  return (
    <section
      id="community"
      className="py-24 px-4 bg-gradient-to-br from-brand-green via-brand-green/95 to-brand-green/90 relative overflow-hidden"
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/2 w-96 h-96 bg-brand-red/10 rounded-full blur-3xl animate-pulse"></div>
      <div
        className="absolute bottom-0 right-1/4 w-64 h-64 bg-brand-blue/10 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "-3s" }}
      ></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center mb-16 text-white"
        >
          Community Medical Support Initiative
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="backdrop-blur-xl bg-white/10 border border-white/20 p-8 md:p-12 rounded-3xl shadow-xl mb-12"
        >
          <h3 className="text-2xl font-bold text-white mb-6">
            Supporting Health Through Essential Equipment Donations
          </h3>
          <p className="text-gray-300 leading-relaxed mb-6">
            At Safety Innovations Impact Group, we recognise that access to
            basic medical supplies and emergency equipment can make the
            difference between life and loss. Many community institutions
            operate with limited resources, leaving them vulnerable during
            medical or fire emergencies.
          </p>
          <p className="text-gray-300 leading-relaxed mb-6">
            As part of our social commitment, we conduct targeted donation
            initiatives aimed at improving immediate response capability in
            underserved environments. Our goal is simple: no emergency response
            should fail because the right equipment was unavailable.
          </p>
          <p className="text-brand-red font-semibold italic">
            Preparedness should not depend on resources — it should be available
            to everyone.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="backdrop-blur-xl bg-white/10 border border-white/20 p-8 rounded-3xl shadow-xl"
          >
            <h3 className="text-2xl font-bold text-white mb-6">
              What We Provide
            </h3>
            <p className="text-gray-300 leading-relaxed mb-6">
              We donate essential emergency response materials to selected
              community institutions and organisations.
            </p>

            <div className="mb-6">
              <h4 className="text-lg font-bold text-white mb-4">
                Medical Supplies
              </h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-brand-red shrink-0" />
                  First aid kits
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-brand-red shrink-0" />
                  Wound care materials
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-brand-red shrink-0" />
                  Gloves and protective barriers
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-brand-red shrink-0" />
                  CPR face shields
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-brand-red shrink-0" />
                  Basic trauma supplies
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold text-white mb-4">
                Emergency Equipment
              </h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-brand-red shrink-0" />
                  Fire extinguishers
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-brand-red shrink-0" />
                  Emergency signage
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-brand-red shrink-0" />
                  Basic evacuation equipment
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-brand-red shrink-0" />
                  Safety instruction posters
                </li>
              </ul>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="backdrop-blur-xl bg-white/10 border border-white/20 p-8 rounded-3xl shadow-xl"
          >
            <h3 className="text-2xl font-bold text-white mb-6">
              Where We Focus
            </h3>
            <p className="text-gray-300 leading-relaxed mb-6">
              Our donation efforts prioritise environments where immediate
              assistance is most critical but resources are often limited:
            </p>
            <ul className="space-y-3 text-gray-400 mb-8">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-brand-red shrink-0" />
                Schools and early learning centres
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-brand-red shrink-0" />
                Community centres
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-brand-red shrink-0" />
                Non-profit organisations
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-brand-red shrink-0" />
                Small community workplaces
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-brand-red shrink-0" />
                Public gathering facilities
              </li>
            </ul>

            <h3 className="text-2xl font-bold text-white mb-6">
              Purpose of the Initiative
            </h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              The objective of this program is not only to provide items, but to
              improve emergency readiness. Each donation aims to:
            </p>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-brand-red shrink-0" />
                Increase response capability
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-brand-red shrink-0" />
                Reduce preventable injuries
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-brand-red shrink-0" />
                Support safer environments
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-brand-red shrink-0" />
                Strengthen community resilience
              </li>
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="backdrop-blur-xl bg-white/10 border border-white/20 p-8 md:p-12 rounded-3xl shadow-xl"
        >
          <h3 className="text-2xl font-bold text-white mb-6">Our Commitment</h3>
          <p className="text-gray-300 leading-relaxed mb-6">
            Safety Innovations Impact Group is committed to making safety
            accessible beyond commercial services. By equipping organisations
            with essential emergency tools, we help communities become better
            prepared for unexpected situations.
          </p>
          <p className="text-gray-300 leading-relaxed mb-6">
            Preparedness should not depend on resources — it should be available
            to everyone.
          </p>
          <h3 className="text-2xl font-bold text-white mb-6">
            Partnership Opportunities
          </h3>
          <p className="text-gray-300 leading-relaxed">
            We welcome collaboration with organisations, sponsors, and
            stakeholders who share our goal of expanding safety readiness within
            communities. Together, we can extend protection where it is needed
            most.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

const ProfileCallToAction = ({ content }) => (
  <section className="py-20 px-4 bg-brand-green">
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="max-w-5xl mx-auto backdrop-blur-xl bg-white/10 border border-white/20 p-8 md:p-12 rounded-3xl shadow-xl text-center"
    >
      <p className="text-brand-red font-semibold uppercase tracking-widest mb-4">
        {content.eyebrow}
      </p>
      <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">
        {content.title}
      </h2>
      <a
        href="#contact"
        className="inline-flex items-center justify-center gap-2 bg-white text-black hover:bg-gray-200 px-8 py-4 rounded-xl font-bold transition"
      >
        {content.button} <ArrowRight className="w-5 h-5" />
      </a>
    </motion.div>
  </section>
);

const Contact = ({ content }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });

  const [submitState, setSubmitState] = useState({ loading: false, message: "", error: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSupabaseConfigured) {
      setSubmitState({ loading: true, message: "", error: false });
      const { error } = await supabase.from("enquiries").insert(formData);
      if (!error) {
        setFormData({ name: "", email: "", phone: "", company: "", message: "" });
        setSubmitState({ loading: false, message: "Thank you. Your message has been received.", error: false });
        return;
      }
      setSubmitState({ loading: false, message: "We could not submit your message. Please use the email option instead.", error: true });
      return;
    }
    const subject = `SIIG enquiry from ${formData.name}`;
    const body = [
      `Name: ${formData.name}`,
      `Email: ${formData.email}`,
      `Phone: ${formData.phone || "Not provided"}`,
      `Organisation: ${formData.company || "Not provided"}`,
      "",
      formData.message,
    ].join("\n");
    window.location.href = `mailto:safetyinnovations.ltd@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="contact" className="py-24 px-4 bg-brand-green">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center mb-16 text-white"
        >
          {content.heading}
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="backdrop-blur-xl bg-white/10 border border-white/20 p-8 rounded-3xl shadow-xl"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Get in Touch</h3>
            <p className="text-gray-300 leading-relaxed mb-8">
              {content.intro}
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-brand-green/30 rounded-xl">
                  <Phone className="w-6 h-6 text-brand-red" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Phone</p>
                  <a
                    href={`tel:${content.phone_link}`}
                    className="text-white font-semibold hover:text-brand-red transition"
                  >
                    {content.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-brand-green/30 rounded-xl">
                  <Mail className="w-6 h-6 text-brand-red" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <a
                    href={`mailto:${content.email}`}
                    className="text-white font-semibold hover:text-brand-red transition"
                  >
                    {content.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-brand-green/30 rounded-xl">
                  <Phone className="w-6 h-6 text-brand-red" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">WhatsApp</p>
                  <a
                    href={`https://wa.me/${content.phone_link.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-white font-semibold hover:text-brand-red transition"
                  >
                    {content.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-brand-green/30 rounded-xl">
                  <Users className="w-6 h-6 text-brand-red" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Instagram</p>
                  <a
                    href={content.instagram_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-white font-semibold hover:text-brand-red transition"
                  >
                    {content.instagram}
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="backdrop-blur-xl bg-white/10 border border-white/20 p-8 rounded-3xl shadow-xl"
          >
            <h3 className="text-2xl font-bold text-white mb-6">
              Send us a Message
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-brand-green transition"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-brand-green transition"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-brand-green transition"
                  placeholder="+233 XX XXX XXXX"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Company
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-brand-green transition"
                  placeholder="Your company name"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-brand-green transition resize-none"
                  placeholder="How can we help you?"
                />
              </div>

              {submitState.message && <p role="status" className={`p-3 text-sm font-semibold ${submitState.error ? "bg-red-950/40 text-red-200" : "bg-emerald-950/50 text-emerald-100"}`}>{submitState.message}</p>}
              <button
                type="submit"
                disabled={submitState.loading}
                className="w-full bg-brand-green hover:bg-brand-green/80 text-white px-6 py-3 rounded-xl font-semibold transition shadow-lg shadow-brand-green/20 flex items-center justify-center gap-2"
              >
                {submitState.loading ? "Sending…" : isSupabaseConfigured ? "Send Message" : "Prepare Email"}
                <Send className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="py-12 px-4 border-t border-white/10 bg-brand-green">
      <div className="max-w-7xl mx-auto text-center text-gray-400 text-sm">
        <p>
          &copy; {new Date().getFullYear()} Safety Innovations Impact Group. All
          rights reserved.
        </p>
      </div>
    </footer>
  );
};

function App() {
  const content = useSiteContent();
  return (
    <div className="min-h-screen overflow-x-hidden bg-brand-green text-white font-sans antialiased selection:bg-brand-red selection:text-white">
      <Navbar />
      <Hero content={content.hero} />
      <Services />
      <TrainingApproach />
      <About content={content.about} />
      <CommunityInitiative />
      <ProfileCallToAction content={content.call_to_action} />
      <Contact content={content.contact} />
      <Footer />
    </div>
  );
}

export default App;
