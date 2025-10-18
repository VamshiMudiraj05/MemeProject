import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import {
  Laugh,
  Zap,
  BarChart2,
  MessageSquare,
  DollarSign,
  Search,
  Users,
} from "lucide-react";
import memeImage from "../assets/2.jpg"; // ✅ Correct import

function HeroSection() {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);
  const y = useTransform(scrollYProgress, [0, 0.5], ["20%", "0%"]);

  return (
    <section
      ref={ref}
      className="relative bg-gradient-to-r from-purple-900 via-blue-800 to-indigo-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative">
        <div className="md:w-2/3">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-pink-500 to-blue-400"
          >
            Connect Meme Pages Directly With Brands
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl mb-8 text-gray-200"
          >
            MemeEconomy helps anonymous content creators monetize their reach
            without middlemen.
            <span className="block text-yellow-300 mt-2">
              No face, no problem. Just memes and money.
            </span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap gap-4"
          >
            <a
              href="#"
              className="px-8 py-4 bg-gradient-to-r from-pink-500 to-yellow-500 text-white rounded-full hover:from-yellow-500 hover:to-pink-500 transition-all duration-500 shadow-lg hover:shadow-pink-500/40 font-bold transform hover:scale-105"
            >
              Get Started
            </a>
            <a
              href="#"
              className="px-8 py-4 bg-transparent border-2 border-yellow-400 text-yellow-400 rounded-full hover:bg-yellow-400 hover:text-purple-900 transition-all duration-300 font-bold hover:shadow-lg hover:shadow-yellow-400/30"
            >
              Learn More
            </a>
          </motion.div>
        </div>

        {/* Image on the right */}
        <motion.div
          style={{ opacity, scale, y }}
          className="absolute top-1/4 right-24 hidden md:block"
        >
          <img
            src={memeImage}
            alt="Meme creator illustration"
            className="h-64 w-64 object-contain rounded-xl shadow-2xl border-2 border-yellow-400"
          />
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent to-gray-900"></div>
    </section>
  );
}

function HowItWorksSection() {
  const [activeTab, setActiveTab] = useState("creators");
  const sectionRef = useRef(null);

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            How It Works
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            MemeEconomy connects meme creators directly with brands, no
            intermediaries needed.
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-12"
        >
          <div className="inline-flex rounded-full shadow-lg bg-gray-800 p-1">
            <button
              type="button"
              className={`px-8 py-3 text-lg font-bold rounded-full transition-all duration-300 ${
                activeTab === "creators"
                  ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg"
                  : "bg-transparent text-gray-300 hover:text-white"
              }`}
              onClick={() => setActiveTab("creators")}
            >
              For Creators
            </button>
            <button
              type="button"
              className={`px-8 py-3 text-lg font-bold rounded-full transition-all duration-300 ${
                activeTab === "brands"
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                  : "bg-transparent text-gray-300 hover:text-white"
              }`}
              onClick={() => setActiveTab("brands")}
            >
              For Brands
            </button>
          </div>
        </motion.div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {activeTab === "creators" ? (
            <>
              {/* Creator Steps */}
              {[
                {
                  title: "Create Your Profile",
                  desc: "Register as a meme page owner and showcase your metrics, audience demographics, and content style.",
                  icon: <Zap className="h-8 w-8" />,
                  color: "from-pink-500 to-purple-600",
                  badge: "from-pink-600 to-purple-700",
                },
                {
                  title: "Receive Brand Requests",
                  desc: "Browse and respond to direct campaign requests from brands looking to work with your meme page.",
                  icon: <MessageSquare className="h-8 w-8" />,
                  color: "from-blue-500 to-indigo-600",
                  badge: "from-blue-600 to-indigo-700",
                },
                {
                  title: "Collaborate & Get Paid",
                  desc: "Negotiate directly with brands, deliver content, and receive payment with no middlemen taking a cut.",
                  icon: <DollarSign className="h-8 w-8" />,
                  color: "from-yellow-500 to-orange-600",
                  badge: "from-yellow-600 to-orange-700",
                },
              ].map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8, y: 50 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: 0.2 * i }}
                  className={`bg-gray-800 p-8 rounded-xl shadow-xl border border-gray-700 hover:border-pink-500 transition-all duration-300 hover:-translate-y-2`}
                >
                  <div className="relative">
                    <div
                      className={`absolute top-0 left-0 -mt-6 -ml-6 bg-gradient-to-r ${step.badge} text-white h-12 w-12 rounded-full flex items-center justify-center text-2xl font-bold`}
                    >
                      {i + 1}
                    </div>
                    <div
                      className={`h-16 w-16 bg-gradient-to-r ${step.color} text-white rounded-xl flex items-center justify-center mb-6 ml-4`}
                    >
                      {step.icon}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">
                    {step.title}
                  </h3>
                  <p className="text-gray-300">{step.desc}</p>
                </motion.div>
              ))}
            </>
          ) : (
            <>
              {/* Brand Steps */}
              {[
                {
                  title: "Register & Browse Creators",
                  desc: "Sign up as a brand and browse curated meme pages with detailed metrics and samples.",
                  icon: <Search className="h-8 w-8" />,
                  color: "from-blue-400 to-cyan-600",
                  badge: "from-blue-500 to-cyan-700",
                },
                {
                  title: "Contact Meme Creators",
                  desc: "Reach out directly to creators with no agency gatekeepers.",
                  icon: <Users className="h-8 w-8" />,
                  color: "from-purple-400 to-pink-600",
                  badge: "from-purple-500 to-pink-700",
                },
                {
                  title: "Launch & Track Campaigns",
                  desc: "Collaborate on campaigns and track your content performance and ROI.",
                  icon: <BarChart2 className="h-8 w-8" />,
                  color: "from-green-400 to-teal-600",
                  badge: "from-green-500 to-teal-700",
                },
              ].map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8, y: 50 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: 0.2 * i }}
                  className={`bg-gray-800 p-8 rounded-xl shadow-xl border border-gray-700 hover:border-green-400 transition-all duration-300 hover:-translate-y-2`}
                >
                  <div className="relative">
                    <div
                      className={`absolute top-0 left-0 -mt-6 -ml-6 bg-gradient-to-r ${step.badge} text-white h-12 w-12 rounded-full flex items-center justify-center text-2xl font-bold`}
                    >
                      {i + 1}
                    </div>
                    <div
                      className={`h-16 w-16 bg-gradient-to-r ${step.color} text-white rounded-xl flex items-center justify-center mb-6 ml-4`}
                    >
                      {step.icon}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">
                    {step.title}
                  </h3>
                  <p className="text-gray-300">{step.desc}</p>
                </motion.div>
              ))}
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function LandingPage() {
  return (
    <div className="relative bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <HeroSection />
      <HowItWorksSection />
    </div>
  );
}

export default LandingPage;

