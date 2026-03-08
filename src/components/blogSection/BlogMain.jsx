import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { FaMedium } from "react-icons/fa";

const MEDIUM_RSS_URL = "https://medium.com/feed/@jermaine73";

const parseRSSFromXML = (xmlText) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, "text/xml");
  const items = doc.querySelectorAll("item");
  return Array.from(items).map((item) => {
    const content =
      item.querySelector("content\\:encoded")?.textContent ||
      item.querySelector("description")?.textContent ||
      "";
    const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/);
    return {
      title: item.querySelector("title")?.textContent || "",
      link: item.querySelector("link")?.textContent || "",
      pubDate: item.querySelector("pubDate")?.textContent || "",
      thumbnail: imgMatch ? imgMatch[1] : "",
    };
  });
};

const fetchViaRss2Json = async () => {
  const res = await fetch(
    `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(MEDIUM_RSS_URL)}`
  );
  if (!res.ok) throw new Error(`rss2json returned ${res.status}`);
  const data = await res.json();
  if (data.status !== "ok") throw new Error("rss2json status not ok");
  return (data.items || []).map((item) => ({
    title: item.title,
    link: item.link,
    pubDate: item.pubDate,
    thumbnail: item.thumbnail || "",
  }));
};

const fetchViaDirectRSS = async () => {
  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(MEDIUM_RSS_URL)}`;
  const res = await fetch(proxyUrl);
  if (!res.ok) throw new Error(`allorigins returned ${res.status}`);
  const xmlText = await res.text();
  return parseRSSFromXML(xmlText);
};

const BlogMain = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(false);

    const strategies = [fetchViaRss2Json, fetchViaDirectRSS];

    for (const strategy of strategies) {
      try {
        const items = await strategy();
        if (items && items.length > 0) {
          setPosts(items);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn("RSS fetch strategy failed, trying next:", err.message);
      }
    }

    console.error("All RSS fetch strategies failed");
    setError(true);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <div className="pt-[4rem] min-h-screen container mx-auto" id="blog">
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="flex flex-col items-center gap-4 text-center mb-12"
      >
        <h2 className="text-3xl xl:text-4xl font-bold text-accent">
          Recent Articles
        </h2>
        <p className="text-primary/70 text-lg max-w-[600px]">
          Thoughts on AI, Engineering, and Tech.
        </p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-[200px] gap-4">
          <p className="text-primary/60 text-lg">
            Unable to load articles right now.
          </p>
          <button
            onClick={fetchPosts}
            className="px-6 py-2 rounded-full border border-accent text-accent hover:bg-accent hover:text-secondary transition-all duration-300 font-medium"
          >
            Try Again
          </button>
        </div>
      ) : posts.length === 0 ? (
        <div className="flex justify-center items-center h-[200px]">
          <p className="text-primary/60 text-lg">No articles found.</p>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-8 px-4">
          {posts.map((post, index) => (
            <motion.a
              key={index}
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-secondary/40 backdrop-blur-md border border-white/10 p-6 rounded-3xl shadow-xl hover:shadow-neonBlue hover:-translate-y-2 transition-all duration-300 w-full md:w-[45%] xl:w-[30%] flex flex-col justify-between"
            >
              <div className="flex flex-col gap-4">
                {post.thumbnail && (
                  <div className="w-full h-[200px] rounded-2xl overflow-hidden mb-2">
                    <img
                      src={post.thumbnail}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <h3 className="text-xl font-bold text-primary leading-tight">
                  {post.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-accent/80">
                  <span>{new Date(post.pubDate).toLocaleDateString()}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <FaMedium /> Medium
                  </span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      )}

      <div className="flex justify-center mt-12 mb-20">
        <a
          href="https://medium.com/@jermaine73"
          target="_blank"
          rel="noopener noreferrer"
          className="px-8 py-3 rounded-full border border-accent text-accent hover:bg-accent hover:text-secondary transition-all duration-300 font-medium"
        >
          View All Posts
        </a>
      </div>
    </div>
  );
};

export default BlogMain;
