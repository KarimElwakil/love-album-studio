import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getAlbum } from "@/lib/albumStore";
import { Album } from "@/types/album";
import FloatingHearts from "@/components/FloatingHearts";
import ParticleBackground from "@/components/ParticleBackground";
import { Heart, Lock, Eye, EyeOff, Play, Pause, Music } from "lucide-react";

const RelationshipCounter: React.FC<{ startDate: string }> = ({ startDate }) => {
  const [elapsed, setElapsed] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!startDate) return;
    const update = () => {
      const start = new Date(startDate).getTime();
      const now = Date.now();
      const diff = now - start;
      setElapsed({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [startDate]);

  return (
    <div className="grid grid-cols-4 gap-4 text-center">
      {[
        { value: elapsed.days, label: "يوم" },
        { value: elapsed.hours, label: "ساعة" },
        { value: elapsed.minutes, label: "دقيقة" },
        { value: elapsed.seconds, label: "ثانية" },
      ].map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-muted/50 rounded-xl p-4 border border-gold/10"
        >
          <div className="text-3xl font-heading text-gradient-gold">{item.value}</div>
          <div className="text-xs text-muted-foreground mt-1">{item.label}</div>
        </motion.div>
      ))}
    </div>
  );
};

const AlbumViewer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [album, setAlbum] = useState<Album | null>(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [entered, setEntered] = useState(false);
  const [revealedMessages, setRevealedMessages] = useState<Set<string>>(new Set());
  const [passwordError, setPasswordError] = useState(false);

  useEffect(() => {
    if (!id) return;
    const a = getAlbum(id);
    setAlbum(a);
    if (a && !a.password) {
      setUnlocked(true);
    }
  }, [id]);

  const handleUnlock = () => {
    if (album && passwordInput === album.password) {
      setUnlocked(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  const toggleReveal = (blockId: string) => {
    setRevealedMessages((prev) => {
      const next = new Set(prev);
      if (next.has(blockId)) next.delete(blockId);
      else next.add(blockId);
      return next;
    });
  };

  if (!album) {
    return (
      <div className="min-h-screen bg-gradient-romantic flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <Heart className="w-16 h-16 text-primary/30 mx-auto mb-4 animate-pulse-slow" />
          <p className="text-muted-foreground text-lg">الألبوم غير موجود</p>
        </motion.div>
      </div>
    );
  }

  // Password screen
  if (!unlocked) {
    return (
      <div className="min-h-screen bg-gradient-romantic flex items-center justify-center relative overflow-hidden">
        <ParticleBackground />
        <FloatingHearts enabled={true} />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 bg-gradient-card border border-gold rounded-2xl p-8 max-w-sm w-full mx-4 shadow-gold text-center"
        >
          <Lock className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-xl font-heading text-gradient-gold mb-2">ألبوم محمي</h2>
          {album.passwordHint && (
            <p className="text-muted-foreground text-sm mb-4">💡 {album.passwordHint}</p>
          )}
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => { setPasswordInput(e.target.value); setPasswordError(false); }}
            placeholder="أدخل كلمة المرور"
            className="w-full bg-input border border-gold/30 rounded-xl px-4 py-3 text-foreground text-center mb-3 focus:outline-none focus:border-primary transition-colors"
            onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
          />
          {passwordError && (
            <p className="text-accent text-sm mb-3">كلمة المرور غير صحيحة</p>
          )}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleUnlock}
            className="w-full bg-gradient-gold text-primary-foreground py-3 rounded-xl font-bold shadow-gold"
          >
            فتح الألبوم
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Entrance animation
  if (!entered) {
    return (
      <div className="min-h-screen bg-gradient-romantic flex items-center justify-center relative overflow-hidden">
        <ParticleBackground />
        <FloatingHearts enabled={true} />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative z-10 text-center px-6"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Heart className="w-20 h-20 text-primary fill-primary/30 mx-auto mb-6" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-4xl font-heading text-gradient-gold mb-3"
          >
            إلى {album.receiverName || "حبيبي"}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-muted-foreground text-lg mb-8"
          >
            من {album.senderName || "محب"} ♥
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setEntered(true)}
            className="bg-gradient-gold text-primary-foreground px-10 py-4 rounded-2xl text-lg font-bold shadow-gold"
          >
            افتح الألبوم 💝
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Main album view
  const animDelay = album.animationSpeed === "slow" ? 0.4 : album.animationSpeed === "fast" ? 0.1 : 0.2;

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ backgroundColor: album.backgroundColor, color: album.textColor }}
    >
      <FloatingHearts enabled={album.enableHearts} />
      {album.enableLights && <ParticleBackground />}

      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-primary/5 blur-[150px]" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <Heart className="w-10 h-10 text-primary fill-primary/30 mx-auto mb-4" />
          <h1 className="text-4xl font-heading text-gradient-gold mb-4">
            {album.receiverName || "حبيبي"}
          </h1>
          {album.mainMessage && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-lg leading-relaxed max-w-md mx-auto font-amiri"
              style={{ color: album.textColor }}
            >
              {album.mainMessage}
            </motion.p>
          )}
        </motion.div>

        {/* Blocks */}
        <div className="space-y-8">
          {album.blocks.map((block, index) => (
            <motion.div
              key={block.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * animDelay + 0.5, duration: 0.6 }}
              className="rounded-2xl p-6 border"
              style={{
                backgroundColor: block.color || album.backgroundColor,
                borderColor: album.borderColor + "40",
                color: block.textColor || album.textColor,
              }}
            >
              {block.type === "text" && (
                <div>
                  {block.title && (
                    <h3 className="text-xl font-heading mb-3 text-gradient-gold">{block.title}</h3>
                  )}
                  <p className="leading-relaxed font-amiri text-lg whitespace-pre-wrap">{block.content}</p>
                </div>
              )}

              {block.type === "image" && block.content && (
                <div>
                  {block.title && <h3 className="text-xl font-heading mb-3 text-gradient-gold">{block.title}</h3>}
                  <img
                    src={block.content}
                    alt="صورة الألبوم"
                    className="w-full rounded-xl"
                    style={{ borderColor: album.borderColor }}
                  />
                </div>
              )}

              {block.type === "music" && block.content && (
                <div className="text-center">
                  <Music className="w-8 h-8 text-primary mx-auto mb-3" />
                  <audio controls className="w-full" src={block.content}>
                    المتصفح لا يدعم تشغيل الصوت
                  </audio>
                </div>
              )}

              {block.type === "video" && block.content && (
                <div>
                  {block.content.includes("youtube") || block.content.includes("youtu.be") ? (
                    <iframe
                      src={block.content.replace("watch?v=", "embed/")}
                      className="w-full aspect-video rounded-xl"
                      allowFullScreen
                    />
                  ) : (
                    <video controls className="w-full rounded-xl" src={block.content} />
                  )}
                </div>
              )}

              {block.type === "hidden-message" && (
                <div className="text-center">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleReveal(block.id)}
                    className="bg-gradient-gold text-primary-foreground px-6 py-3 rounded-xl font-bold shadow-gold"
                  >
                    {block.title || "اضغط لكشف السر 💌"}
                  </motion.button>
                  <AnimatePresence>
                    {revealedMessages.has(block.id) && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 text-lg font-amiri leading-relaxed"
                      >
                        {block.content}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {block.type === "counter" && album.relationshipStartDate && (
                <div>
                  <h3 className="text-xl font-heading text-center mb-4 text-gradient-gold">
                    مدة حبنا ♥
                  </h3>
                  <RelationshipCounter startDate={album.relationshipStartDate} />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: album.blocks.length * animDelay + 1 }}
          className="text-center mt-16 pb-8"
        >
          <Heart className="w-6 h-6 text-primary fill-primary mx-auto mb-2" />
          <p className="text-muted-foreground text-sm">
            صنع بـ ♥ بواسطة {album.senderName || "محب"}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AlbumViewer;
