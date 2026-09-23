import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Shield,
  CheckCircle,
  ArrowRight,
  Calendar,
  Users,
  Target,
  Award,
  Mail,
  Phone,
  MapPin,
  Send,
  Menu,
  X,
  ArrowUp,
} from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Services", href: "#services" },
    { name: "Training", href: "#training" },
    { name: "About", href: "#about" },
    { name: "Community", href: "#community" },
    { name: "Compliance", href: "#compliance" },
    { name: "Team", href: "#team" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 w-full max-w-6xl mx-auto px-4 backdrop-blur-md border rounded-2xl p-4 flex justify-between items-center z-50 transition-all duration-300 ${
        scrolled
          ? "bg-brand-green/95 border-white/30 shadow-xl my-0"
          : "bg-white/10 border-white/20 my-6"
      }`}
    >
      <div className="flex items-center gap-3">
        <img src="/logo.png" alt="SIIG Logo" className="h-12 w-auto" />
        <div className="hidden sm:block">
          <div className="font-bold text-xl tracking-wide text-white">SIIG</div>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex space-x-8 text-sm text-gray-300">
        {navLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            className="hover:text-white transition relative group"
            onClick={() => setIsOpen(false)}
          >
            {link.name}
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-red transition-all duration-300 group-hover:w-full"></span>
          </a>
        ))}
      </div>

      <a
        href="#contact"
        className="hidden md:block bg-brand-green hover:bg-brand-green/80 text-white px-4 py-2 rounded-xl text-sm font-semibold transition shadow-lg shadow-brand-green/20"
      >
        Contact Us
      </a>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden p-2 text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute top-full left-0 right-0 mt-2 backdrop-blur-xl bg-brand-green/95 border border-white/20 rounded-2xl p-6 md:hidden"
          >
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-white hover:text-brand-red transition text-lg font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <a
                href="#contact"
                className="bg-brand-green hover:bg-brand-green/80 text-white px-6 py-3 rounded-xl font-semibold transition shadow-lg shadow-brand-green/20 text-center"
                onClick={() => setIsOpen(false)}
              >
                Contact Us
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-brand-green via-brand-green/90 to-brand-green/80 text-white pt-32 pb-12">
      {/* Glassmorphic Navbar */}
      <Navbar />

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
                YOUR SAFETY, OUR MISSION
              </span>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-4xl md:text-6xl font-black tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400 leading-tight"
              >
                Next-Gen Safety.
                <br />
                Uncompromising Protection.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
              >
                A Trusted Partner in Health Security-Prepared people.
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
                  Explore Solutions
                  <ArrowRight className="inline ml-2 w-5 h-5" />
                </a>
                <a
                  href="#contact"
                  className="w-full sm:w-auto backdrop-blur-md bg-white/10 border border-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-bold transition"
                >
                  Book a Consultation
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
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=500&fit=crop"
                alt="Safety Training"
                className="rounded-2xl shadow-2xl w-full h-auto object-cover hue-rotate-15"
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
                src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&h=400&fit=crop"
                alt="Training Session"
                className="rounded-2xl shadow-2xl w-full h-auto object-cover"
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

const ImpactAttribute = ({ icon: Icon, title, description }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.4 }}
    className="text-center"
  >
    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10">
      <Icon className="h-8 w-8 text-brand-red" aria-hidden="true" />
    </div>
    <h3 className="text-xl font-bold text-white md:text-2xl">{title}</h3>
    <p className="mx-auto mt-3 max-w-xs text-base leading-relaxed text-gray-300">
      {description}
    </p>
  </motion.div>
);

const Impact = () => {
  return (
    <section className="py-24 px-4 bg-brand-green">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="backdrop-blur-xl bg-white/10 border border-white/20 p-8 md:p-12 rounded-3xl shadow-2xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
            <ImpactAttribute
              icon={Shield}
              title="Practical Training"
              description="Hands-on instruction designed for confident action in real emergencies."
            />
            <ImpactAttribute
              icon={Target}
              title="Scenario-Based Learning"
              description="Repeated practice turns safety knowledge into usable response skills."
            />
            <ImpactAttribute
              icon={Users}
              title="Workplace & Community Focus"
              description="Training shaped around the people, setting, and risks of each organisation."
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const About = () => {
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
          About Us
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
              <h3 className="text-2xl font-bold text-white mb-6">Our Story</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Safety Innovations Impact Group is a professional safety
                training and compliance company established in February 2025,
                dedicated to equipping organisations and communities with
                life-saving skills and practical emergency preparedness.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                Founded in February 2025, the company was created in response to
                a growing need: many workplaces meet safety requirements on
                paper but remain unprepared in real emergencies. Our goal is to
                bridge the gap between compliance and real-world readiness.
              </p>
              <p className="text-gray-300 leading-relaxed">
                We provide hands-on first aid and fire safety training designed
                not just to certify participants, but to give them the
                confidence to act when seconds matter. Our instructors bring
                practical experience, structured teaching methods, and
                scenario-based learning to ensure that knowledge becomes
                instinct. Every program is tailored to the environment in which
                it will be used, because emergencies never happen in a classroom
                — they happen in real workplaces.
              </p>
              <p className="text-brand-red font-semibold mt-4 italic">
                At Safety Innovations Impact Group, safety is not a checklist,
                it's our culture.
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
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop"
                alt="Safety Training"
                className="rounded-2xl shadow-2xl w-full h-auto object-cover"
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
            Our Values (CAPE)
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

const Compliance = () => {
  const certifications = [
    {
      name: "Ghana Standards Authority",
      description: "Certified safety training provider",
    },
    {
      name: "Occupational Safety & Health",
      description: "OSHA compliant protocols",
    },
    {
      name: "First Aid Certification",
      description: "Red Cross certified training",
    },
    { name: "Fire Safety Compliance", description: "GNFS approved procedures" },
  ];

  return (
    <section id="compliance" className="py-24 px-4 bg-brand-green">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center mb-16 text-white"
        >
          Compliance & Certifications
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="backdrop-blur-xl bg-white/10 border border-white/20 p-8 md:p-12 rounded-3xl shadow-xl mb-12"
        >
          <h3 className="text-2xl font-bold text-white mb-6">
            Regulatory Compliance
          </h3>
          <p className="text-gray-300 leading-relaxed mb-6">
            We ensure full compliance with Ghana's workplace safety regulations
            and international standards. Our team stays updated with the latest
            regulatory requirements to help your business maintain compliance
            and avoid penalties.
          </p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-gray-300">
              <CheckCircle className="w-5 h-5 text-brand-red shrink-0 mt-0.5" />
              <span>Labor Act compliance and workplace safety standards</span>
            </li>
            <li className="flex items-start gap-3 text-gray-300">
              <CheckCircle className="w-5 h-5 text-brand-red shrink-0 mt-0.5" />
              <span>Fire safety regulations and emergency protocols</span>
            </li>
            <li className="flex items-start gap-3 text-gray-300">
              <CheckCircle className="w-5 h-5 text-brand-red shrink-0 mt-0.5" />
              <span>Health and safety risk assessments</span>
            </li>
            <li className="flex items-start gap-3 text-gray-300">
              <CheckCircle className="w-5 h-5 text-brand-red shrink-0 mt-0.5" />
              <span>Industry-specific compliance requirements</span>
            </li>
          </ul>
        </motion.div>

        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl font-bold text-center mb-8 text-white"
        >
          Our Certifications
        </motion.h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certifications.map((cert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="backdrop-blur-xl bg-white/10 border border-white/20 p-6 rounded-2xl shadow-xl hover:border-brand-green/50 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-brand-green/30 rounded-xl">
                  <Award className="w-6 h-6 text-brand-red" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">{cert.name}</h4>
                  <p className="text-gray-400 text-sm">{cert.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
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

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Thank you for your message! We will get back to you soon.");
    setFormData({ name: "", email: "", phone: "", company: "", message: "" });
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
          Contact Us
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
              Ready to enhance your workplace safety? Contact us today for a
              consultation or to learn more about our services.
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-brand-green/30 rounded-xl">
                  <Phone className="w-6 h-6 text-brand-red" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Phone</p>
                  <p className="text-white font-semibold">+233 26 137 0547</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-brand-green/30 rounded-xl">
                  <Mail className="w-6 h-6 text-brand-red" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="text-white font-semibold">
                    safetyinnovations.ltd@gmail.com
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-brand-green/30 rounded-xl">
                  <MapPin className="w-6 h-6 text-brand-red" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Location</p>
                  <p className="text-white font-semibold">Accra, Ghana</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-brand-green/30 rounded-xl">
                  <Users className="w-6 h-6 text-brand-red" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Instagram</p>
                  <p className="text-white font-semibold">
                    @safety_innovationsimpactgh
                  </p>
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

              <button
                type="submit"
                className="w-full bg-brand-green hover:bg-brand-green/80 text-white px-6 py-3 rounded-xl font-semibold transition shadow-lg shadow-brand-green/20 flex items-center justify-center gap-2"
              >
                Send Message
                <Send className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Team = () => {
  const teamMembers = [
    {
      name: "Kwame Mensah",
      role: "Chief Executive Officer",
      description: "20+ years in occupational safety and industrial management",
    },
    {
      name: "Ama Ofori",
      role: "Head of Training",
      description:
        "Certified safety trainer with expertise in emergency response",
    },
    {
      name: "Kofi Asante",
      role: "Compliance Director",
      description:
        "Specialist in Ghanaian labor laws and international safety standards",
    },
    {
      name: "Efia Boateng",
      role: "Operations Manager",
      description:
        "Expert in implementing safety protocols across various industries",
    },
  ];

  return (
    <section id="team" className="py-24 px-4 bg-brand-green">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center mb-16 text-white"
        >
          Our Team
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="backdrop-blur-xl bg-white/10 border border-white/20 p-6 rounded-3xl shadow-xl group hover:border-brand-green/50 transition-all duration-300 text-center"
            >
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-brand-green to-brand-red flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Users className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {member.name}
              </h3>
              <p className="text-brand-red font-semibold mb-3">{member.role}</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                {member.description}
              </p>
            </motion.div>
          ))}
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
          &copy; {new Date().getFullYear()} Safety Innovations Impact Group
          Limited. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-brand-green hover:bg-brand-green/80 text-white p-4 rounded-full shadow-xl shadow-brand-green/30 transition-all duration-300 z-50 hover:scale-110"
          aria-label="Back to top"
        >
          <ArrowUp className="w-6 h-6" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

const ScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", updateScrollProgress);
    return () => window.removeEventListener("scroll", updateScrollProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-white/10 z-[60]">
      <motion.div
        className="h-full bg-gradient-to-r from-brand-red to-brand-green"
        style={{ width: `${scrollProgress}%` }}
        transition={{ duration: 0.1 }}
      />
    </div>
  );
};

function App() {
  return (
    <div className="min-h-screen bg-brand-green text-white font-sans antialiased selection:bg-brand-red selection:text-white">
      <ScrollProgress />
      <Hero />
      <Services />
      <TrainingApproach />
      <Impact />
      <About />
      <Compliance />
      <CommunityInitiative />
      <Team />
      <Contact />
      <Footer />
      <BackToTop />
    </div>
  );
}

export default App;
