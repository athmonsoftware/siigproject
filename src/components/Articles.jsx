import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X, FileText, ArrowUp } from "lucide-react";
import { useArticles } from "../hooks/useArticles.js";

const parseBoldText = (text) => {
  if (!text) return "";
  // Replace *text* with styled strong tag
  return text.replace(
    /\*([^*]+)\*/g,
    '<strong class="text-lg font-bold text-red-400">$1</strong>'
  );
};

export const Articles = () => {
  const { articles, loading } = useArticles();
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [articlesPerSlide, setArticlesPerSlide] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setArticlesPerSlide(3);
      } else if (window.innerWidth >= 768) {
        setArticlesPerSlide(2);
      } else {
        setArticlesPerSlide(1);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Ensure carouselIndex stays valid when articlesPerSlide changes
  useEffect(() => {
    if (articles && carouselIndex > articles.length - articlesPerSlide) {
      setCarouselIndex(Math.max(0, articles.length - articlesPerSlide));
    }
  }, [articlesPerSlide, articles, carouselIndex]);

  if (loading || !articles || articles.length === 0) {
    return null;
  }

  // Updated to page backward by articlesPerSlide to show entirely new articles
  const carouselPrevious = () => {
    setCarouselIndex((prev) => {
      const nextIndex = prev - articlesPerSlide;
      return nextIndex < 0
        ? Math.max(0, articles.length - articlesPerSlide)
        : nextIndex;
    });
  };

  // Updated to page forward by articlesPerSlide to show entirely new articles
  const carouselNext = () => {
    setCarouselIndex((prev) => {
      const nextIndex = prev + articlesPerSlide;
      return nextIndex >= articles.length ? 0 : nextIndex;
    });
  };

  const visibleArticles = articles.slice(
    carouselIndex,
    carouselIndex + articlesPerSlide
  );

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
            SIIG News
          </h2>
        </motion.div>

        {/* Articles Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visibleArticles.map((article, index) => {
              return (
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
                    {article.cover_image ? (
                      <div className="w-full h-52 overflow-hidden relative bg-black/40 flex items-center justify-center">
                        <img
                          src={article.cover_image}
                          alt={article.cover_image_alt || article.title}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
                      </div>
                    ) : (
                      <div className="w-full h-52 overflow-hidden relative bg-black/40 flex items-center justify-center">
                        <FileText className="h-16 w-16 text-white/30" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
                      </div>
                    )}
                    <div className="p-6">
                      <p className="text-xs font-medium text-gray-300 mb-2">
                        {new Date(article.created_at).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </p>
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-brand-red transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      {/* Added whitespace-pre-line to respect summary line breaks */}
                      <p className="text-gray-200 text-sm leading-relaxed line-clamp-3 mb-4 whitespace-pre-line">
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
              );
            })}
          </div>

          {/* Carousel Navigation */}
          {articles.length > articlesPerSlide && (
            <div className="flex items-center justify-center gap-4 mt-12">
              <button
                onClick={carouselPrevious}
                className="rounded-full bg-white/20 p-3 text-white hover:bg-white/30 transition shadow-lg"
                aria-label="Previous slide"
              >
                <ArrowUp className="h-5 w-5 -rotate-90" />
              </button>
              <div className="flex items-center gap-2">
                {Array.from({
                  length: Math.ceil(articles.length / articlesPerSlide),
                }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCarouselIndex(i * articlesPerSlide)}
                    className={`h-2 w-2 rounded-full transition ${
                      Math.floor(carouselIndex / articlesPerSlide) === i
                        ? "bg-white w-6"
                        : "bg-white/30 hover:bg-white/50"
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={carouselNext}
                className="rounded-full bg-white/20 p-3 text-white hover:bg-white/30 transition shadow-lg"
                aria-label="Next slide"
              >
                <ArrowUp className="h-5 w-5 rotate-90" />
              </button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Modal View */}
      <AnimatePresence>
        {selectedArticle && (
          <div
            onClick={() => setSelectedArticle(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-brand-green border border-white/20 w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-3xl p-6 md:p-10 shadow-2xl relative text-white"
            >
              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition z-10"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>

              {selectedArticle.cover_image ? (
                <div className="w-full max-h-96 overflow-hidden rounded-2xl mb-6 shadow-lg bg-black/40 flex items-center justify-center">
                  <img
                    src={selectedArticle.cover_image}
                    alt={
                      selectedArticle.cover_image_alt || selectedArticle.title
                    }
                    className="w-full max-h-96 object-contain"
                  />
                </div>
              ) : (
                <div className="w-full max-h-96 overflow-hidden rounded-2xl mb-6 shadow-lg bg-black/40 flex items-center justify-center">
                  <FileText className="h-24 w-24 text-white/30" />
                </div>
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
              {/* Added text-brand-red to highlight the title in full modal mode */}
              <h2 className="text-2xl md:text-3xl font-black mb-6 leading-tight text-brand-red">
                {selectedArticle.title}
              </h2>
              <div
                className="text-gray-100 space-y-4 whitespace-pre-wrap leading-relaxed text-base"
                dangerouslySetInnerHTML={{
                  __html: parseBoldText(selectedArticle.content),
                }}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
