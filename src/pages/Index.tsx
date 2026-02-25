import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { validateCode } from "@/lib/albumStore";
import FloatingHearts from "@/components/FloatingHearts";
import ParticleBackground from "@/components/ParticleBackground";
import { Heart, KeyRound, ArrowLeft } from "lucide-react";

const Index: React.FC = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setError("الرجاء إدخال الكود");
      return;
    }

    setLoading(true);
    setError("");

    // Simulate brief loading
    await new Promise((r) => setTimeout(r, 800));

    const result = validateCode(code.trim());
    setLoading(false);

    if (result.valid) {
      if (result.editable) {
        navigate(`/builder/${code.trim().toUpperCase()}`);
      } else {
        navigate(`/album/${code.trim().toUpperCase()}`);
      }
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-romantic flex items-center justify-center relative overflow-hidden">
      <ParticleBackground />
      <FloatingHearts enabled={true} />

      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent/5 blur-[120px]" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md px-6"
      >
        {/* Logo / Brand */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 rounded-full border border-gold mb-6 shadow-gold"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Heart className="w-10 h-10 text-primary fill-primary/30" />
          </motion.div>

          <h1 className="text-4xl font-heading font-bold text-gradient-gold mb-3">
            ألبوم الحب
          </h1>
          <p className="text-muted-foreground text-lg font-light">
            أنشئ لحظات لا تُنسى لمن تحب
          </p>
        </motion.div>

        {/* Code Entry Card */}
        <motion.div
          className="bg-gradient-card rounded-2xl p-8 border border-gold shadow-gold backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <KeyRound className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-heading text-foreground">أدخل كود الشراء</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <input
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase());
                  setError("");
                }}
                placeholder="مثال: LOVE2024"
                className="w-full bg-input border border-gold/30 rounded-xl px-5 py-4 text-foreground text-center text-lg tracking-widest placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:shadow-gold transition-all duration-300 font-body"
                dir="ltr"
                maxLength={20}
              />
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-accent text-sm text-center"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-gold text-primary-foreground py-4 rounded-xl text-lg font-bold tracking-wide transition-all duration-300 disabled:opacity-50 shadow-gold hover:shadow-[0_0_40px_hsl(40_70%_50%/0.3)]"
            >
              {loading ? (
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  جاري التحقق...
                </motion.span>
              ) : (
                "دخول"
              )}
            </motion.button>
          </form>

          <p className="text-muted-foreground text-xs text-center mt-5">
            أكواد تجريبية: LOVE2024 • HEART999 • ROSE1234
          </p>
        </motion.div>

        {/* Admin link */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <button
            onClick={() => navigate("/admin")}
            className="text-muted-foreground/40 text-xs hover:text-primary transition-colors"
          >
            لوحة التحكم
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Index;
