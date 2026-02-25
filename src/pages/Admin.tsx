import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  getAllCodes,
  addCode,
  deleteCode,
  extendCode,
  CodeData,
} from "@/lib/albumStore";
import {
  Heart,
  Plus,
  Trash2,
  Clock,
  ArrowRight,
  Shield,
  Key,
  Eye,
} from "lucide-react";

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const [codes, setCodes] = useState<CodeData[]>([]);
  const [newCode, setNewCode] = useState("");

  useEffect(() => {
    setCodes(getAllCodes());
  }, []);

  const handleAdd = () => {
    if (!newCode.trim()) return;
    addCode(newCode.trim());
    setCodes(getAllCodes());
    setNewCode("");
  };

  const handleDelete = (code: string) => {
    deleteCode(code);
    setCodes(getAllCodes());
  };

  const handleExtend = (code: string) => {
    extendCode(code, 24);
    setCodes(getAllCodes());
  };

  const isExpired = (c: CodeData) => {
    if (!c.firstUsedAt) return false;
    return Date.now() - c.firstUsedAt > 24 * 60 * 60 * 1000;
  };

  const getRemainingTime = (c: CodeData) => {
    if (!c.firstUsedAt) return "غير مستخدم";
    const remaining = c.firstUsedAt + 24 * 60 * 60 * 1000 - Date.now();
    if (remaining <= 0) return "منتهي";
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining / (1000 * 60)) % 60);
    return `${hours}س ${minutes}د`;
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-gold/20">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-primary" />
            <h1 className="text-lg font-heading text-gradient-gold">لوحة التحكم</h1>
          </div>
          <button
            onClick={() => navigate("/")}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            الرئيسية
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Add Code */}
        <div className="bg-gradient-card border border-gold/20 rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-heading text-gradient-gold mb-4">إضافة كود جديد</h3>
          <div className="flex gap-3">
            <input
              value={newCode}
              onChange={(e) => setNewCode(e.target.value.toUpperCase())}
              placeholder="أدخل الكود الجديد"
              className="flex-1 bg-input border border-gold/20 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors"
              dir="ltr"
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleAdd}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-gold text-primary-foreground rounded-xl font-bold shadow-gold"
            >
              <Plus className="w-4 h-4" />
              إضافة
            </motion.button>
          </div>
        </div>

        {/* Codes List */}
        <div className="bg-gradient-card border border-gold/20 rounded-2xl p-6">
          <h3 className="text-lg font-heading text-gradient-gold mb-4">
            الأكواد ({codes.length})
          </h3>
          <div className="space-y-3">
            {codes.map((c) => (
              <motion.div
                key={c.code}
                layout
                className="flex items-center justify-between bg-muted/50 rounded-xl p-4 border border-gold/10"
              >
                <div className="flex items-center gap-4">
                  <Key className="w-5 h-5 text-primary" />
                  <div>
                    <span className="font-mono text-foreground tracking-wider">{c.code}</span>
                    <div className="flex items-center gap-3 mt-1">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          !c.used
                            ? "bg-green-500/10 text-green-400"
                            : isExpired(c)
                            ? "bg-destructive/10 text-destructive"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        {!c.used ? "جديد" : isExpired(c) ? "منتهي" : "مستخدم"}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {getRemainingTime(c)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {c.used && (
                    <button
                      onClick={() => navigate(`/album/${c.code}`)}
                      className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                      title="عرض الألبوم"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  )}
                  {c.used && isExpired(c) && (
                    <button
                      onClick={() => handleExtend(c.code)}
                      className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-primary"
                      title="تمديد 24 ساعة"
                    >
                      <Clock className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(c.code)}
                    className="p-2 hover:bg-destructive/10 rounded-lg transition-colors text-muted-foreground hover:text-destructive"
                    title="حذف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
