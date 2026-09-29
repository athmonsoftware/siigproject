import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import { useArticles } from "../hooks/useArticles.js";

export const Articles = () => {
  const { articles, loading } = useArticles();
  const [selectedArticle, setSelectedArticle] = useState(null);

  if (loading || articles.length === 0) {
    return null;
  }

  return (
    <section id="articles" className="py-24 px-4 bg-brand-green">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block bg-white/15 text-brand-red text-xs px-3 py-1 rounded-full uppercase tracking-widest font-semibold mb-4 border border-white/10">
            LATEST UPDATES
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            News & Articles
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              onClick={() => setSelectedArticle(article)}
              className="cursor-pointer backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl overflow-hidden shadow-xl group hover:border-brand-red/50 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {article.cover_image && (
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={article.cover_image}
                      alt={article.cover_image_alt || article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>
                )}
                <div className="p-6">
                  <p className="text-xs font-medium text-gray-300 mb-2">
                    {new Date(article.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-brand-red transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-200 text-sm leading-relaxed line-clamp-3 mb-4">
                    {article.excerpt || article.content}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-white group-hover:text-brand-red transition">
                  Read Full Article{" "}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal View */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-brand-green border border-white/20 w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-3xl p-6 md:p-10 shadow-2xl relative text-white"
            >
              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>

              {selectedArticle.cover_image && (
                <img
                  src={selectedArticle.cover_image}
                  alt={selectedArticle.cover_image_alt || selectedArticle.title}
                  className="w-full h-64 object-cover rounded-2xl mb-6 shadow-md"
                />
              )}

              <p className="text-xs font-medium text-gray-300 mb-2">
                Published on{" "}
                {new Date(selectedArticle.created_at).toLocaleDateString(
                  "en-US",
                  {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  }
                )}
              </p>
              <h2 className="text-2xl md:text-3xl font-black mb-6 leading-tight">
                {selectedArticle.title}
              </h2>
              <div className="text-gray-100 space-y-4 whitespace-pre-wrap leading-relaxed text-base">
                {selectedArticle.content}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
