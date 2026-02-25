import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import {
  getAlbum,
  saveAlbum,
  createDefaultAlbum,
  validateCode,
} from "@/lib/albumStore";
import { Album, AlbumBlock } from "@/types/album";
import FloatingHearts from "@/components/FloatingHearts";
import {
  Heart,
  Plus,
  Trash2,
  Copy,
  GripVertical,
  Save,
  Eye,
  Type,
  Image,
  Music,
  Video,
  MessageCircle,
  Timer,
  Palette,
  Settings,
  Link,
  Check,
  ArrowRight,
} from "lucide-react";

const BLOCK_TYPES = [
  { type: "text" as const, icon: Type, label: "نص / مقالة" },
  { type: "image" as const, icon: Image, label: "صورة" },
  { type: "music" as const, icon: Music, label: "موسيقى" },
  { type: "video" as const, icon: Video, label: "فيديو" },
  { type: "hidden-message" as const, icon: MessageCircle, label: "رسالة مخفية" },
  { type: "counter" as const, icon: Timer, label: "عداد العلاقة" },
];

const ROMANTIC_COLORS = [
  { name: "ذهبي", value: "#b8860b" },
  { name: "وردي", value: "#c44569" },
  { name: "أحمر نبيذي", value: "#722f37" },
  { name: "بنفسجي داكن", value: "#4a0e4e" },
  { name: "أزرق ليلي", value: "#1a1a40" },
  { name: "أسود فاخر", value: "#0d0d0d" },
  { name: "كريمي", value: "#f5e6d3" },
  { name: "وردي فاتح", value: "#f7cac9" },
];

const Builder: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const [album, setAlbum] = useState<Album | null>(null);
  const [activeTab, setActiveTab] = useState<"content" | "design" | "settings">("content");
  const [showBlockPicker, setShowBlockPicker] = useState(false);
  const [saved, setSaved] = useState(false);
  const [published, setPublished] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    if (!code) return;
    const result = validateCode(code);
    if (!result.valid) {
      navigate("/");
      return;
    }
    const existing = getAlbum(code);
    setAlbum(existing || createDefaultAlbum(code));
  }, [code, navigate]);

  const updateAlbum = useCallback(
    (updates: Partial<Album>) => {
      if (!album) return;
      const updated = { ...album, ...updates };
      setAlbum(updated);
      setSaved(false);
    },
    [album]
  );

  const addBlock = (type: AlbumBlock["type"]) => {
    if (!album) return;
    const newBlock: AlbumBlock = {
      id: `block_${Date.now()}`,
      type,
      content: "",
      title: "",
      color: "#0d0d0d",
      textColor: "#e6d5b8",
      order: album.blocks.length,
    };
    updateAlbum({ blocks: [...album.blocks, newBlock] });
    setShowBlockPicker(false);
  };

  const updateBlock = (id: string, updates: Partial<AlbumBlock>) => {
    if (!album) return;
    updateAlbum({
      blocks: album.blocks.map((b) => (b.id === id ? { ...b, ...updates } : b)),
    });
  };

  const removeBlock = (id: string) => {
    if (!album) return;
    updateAlbum({ blocks: album.blocks.filter((b) => b.id !== id) });
  };

  const duplicateBlock = (id: string) => {
    if (!album) return;
    const block = album.blocks.find((b) => b.id === id);
    if (!block) return;
    const dup = { ...block, id: `block_${Date.now()}`, order: album.blocks.length };
    updateAlbum({ blocks: [...album.blocks, dup] });
  };

  const handleSave = () => {
    if (!album) return;
    saveAlbum(album);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handlePublish = () => {
    if (!album) return;
    saveAlbum(album);
    setPublished(true);
  };

  const copyLink = () => {
    const link = `${window.location.origin}/album/${album?.id}`;
    navigator.clipboard.writeText(link);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  if (!album) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-gold/20">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Heart className="w-6 h-6 text-primary fill-primary/30" />
            <h1 className="text-lg font-heading text-gradient-gold">بناء الألبوم</h1>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md" dir="ltr">
              {code}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg text-foreground text-sm hover:bg-muted/80 transition-colors"
            >
              {saved ? <Check className="w-4 h-4 text-green-400" /> : <Save className="w-4 h-4" />}
              {saved ? "تم الحفظ" : "حفظ"}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/album/${code}`)}
              className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg text-foreground text-sm hover:bg-muted/80 transition-colors"
            >
              <Eye className="w-4 h-4" />
              معاينة
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handlePublish}
              className="flex items-center gap-2 px-5 py-2 bg-gradient-gold rounded-lg text-primary-foreground text-sm font-bold shadow-gold hover:shadow-[0_0_40px_hsl(40_70%_50%/0.3)] transition-all"
            >
              إنشاء الألبوم
            </motion.button>
          </div>
        </div>
      </header>

      {/* Published overlay */}
      <AnimatePresence>
        {published && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-xl flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gradient-card border border-gold rounded-2xl p-10 max-w-md text-center shadow-gold"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6"
              >
                <Heart className="w-8 h-8 text-primary fill-primary" />
              </motion.div>
              <h2 className="text-2xl font-heading text-gradient-gold mb-3">تم إنشاء الألبوم! 🎉</h2>
              <p className="text-muted-foreground mb-6">شارك الرابط مع من تحب</p>
              <div className="bg-muted rounded-xl p-4 mb-5 text-sm font-mono" dir="ltr">
                {window.location.origin}/album/{album.id}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={copyLink}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-gold text-primary-foreground py-3 rounded-xl font-bold"
                >
                  {linkCopied ? <Check className="w-4 h-4" /> : <Link className="w-4 h-4" />}
                  {linkCopied ? "تم النسخ!" : "نسخ الرابط"}
                </button>
                <button
                  onClick={() => navigate(`/album/${album.id}`)}
                  className="flex-1 flex items-center justify-center gap-2 border border-gold rounded-xl py-3 text-foreground hover:bg-muted transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  فتح الألبوم
                </button>
              </div>
              <button
                onClick={() => setPublished(false)}
                className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                العودة للتعديل
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-1 bg-muted rounded-xl p-1 mb-8">
          {[
            { id: "content" as const, label: "المحتوى", icon: Type },
            { id: "design" as const, label: "التصميم", icon: Palette },
            { id: "settings" as const, label: "الإعدادات", icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-card text-foreground shadow-gold border border-gold/20"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Tab */}
        {activeTab === "content" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Basic Info */}
            <div className="bg-gradient-card border border-gold/20 rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-heading text-gradient-gold mb-4">المعلومات الأساسية</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">اسمك</label>
                  <input
                    value={album.senderName}
                    onChange={(e) => updateAlbum({ senderName: e.target.value })}
                    placeholder="اسمك هنا"
                    className="w-full bg-input border border-gold/20 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">اسم الشخص المرسل له</label>
                  <input
                    value={album.receiverName}
                    onChange={(e) => updateAlbum({ receiverName: e.target.value })}
                    placeholder="اسم حبيبك/حبيبتك"
                    className="w-full bg-input border border-gold/20 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-1 block">الرسالة الرئيسية</label>
                <textarea
                  value={album.mainMessage}
                  onChange={(e) => updateAlbum({ mainMessage: e.target.value })}
                  placeholder="اكتب رسالتك الرومانسية هنا..."
                  rows={4}
                  className="w-full bg-input border border-gold/20 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">كلمة المرور (اختياري)</label>
                  <input
                    type="text"
                    value={album.password}
                    onChange={(e) => updateAlbum({ password: e.target.value })}
                    placeholder="كلمة مرور للألبوم"
                    className="w-full bg-input border border-gold/20 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">تلميح كلمة المرور</label>
                  <input
                    value={album.passwordHint}
                    onChange={(e) => updateAlbum({ passwordHint: e.target.value })}
                    placeholder="مثال: أول يوم عرفنا بعض"
                    className="w-full bg-input border border-gold/20 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-1 block">تاريخ بداية العلاقة (للعداد)</label>
                <input
                  type="date"
                  value={album.relationshipStartDate}
                  onChange={(e) => updateAlbum({ relationshipStartDate: e.target.value })}
                  className="w-full bg-input border border-gold/20 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Blocks */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-heading text-gradient-gold">الأقسام</h3>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowBlockPicker(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-gold text-primary-foreground rounded-xl text-sm font-bold shadow-gold"
                >
                  <Plus className="w-4 h-4" />
                  إضافة قسم
                </motion.button>
              </div>

              {/* Block picker */}
              <AnimatePresence>
                {showBlockPicker && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-2 md:grid-cols-3 gap-3 overflow-hidden"
                  >
                    {BLOCK_TYPES.map((bt) => (
                      <motion.button
                        key={bt.type}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => addBlock(bt.type)}
                        className="flex flex-col items-center gap-2 p-4 bg-gradient-card border border-gold/20 rounded-xl hover:border-primary transition-colors"
                      >
                        <bt.icon className="w-6 h-6 text-primary" />
                        <span className="text-sm text-foreground">{bt.label}</span>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Block list */}
              {album.blocks.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <Heart className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>لا توجد أقسام بعد. أضف أقسام لبناء ألبومك!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {album.blocks.map((block, index) => (
                    <motion.div
                      key={block.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-gradient-card border border-gold/20 rounded-2xl p-5"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-md">
                            {BLOCK_TYPES.find((bt) => bt.type === block.type)?.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => duplicateBlock(block.id)}
                            className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeBlock(block.id)}
                            className="p-2 hover:bg-destructive/10 rounded-lg transition-colors text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Block content based on type */}
                      {block.type === "text" && (
                        <div className="space-y-3">
                          <input
                            value={block.title || ""}
                            onChange={(e) => updateBlock(block.id, { title: e.target.value })}
                            placeholder="عنوان القسم"
                            className="w-full bg-input border border-gold/20 rounded-xl px-4 py-2 text-foreground focus:outline-none focus:border-primary transition-colors text-sm"
                          />
                          <textarea
                            value={block.content}
                            onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                            placeholder="اكتب نص المقالة..."
                            rows={3}
                            className="w-full bg-input border border-gold/20 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors resize-none text-sm"
                          />
                        </div>
                      )}

                      {block.type === "image" && (
                        <input
                          value={block.content}
                          onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                          placeholder="رابط الصورة (URL)"
                          className="w-full bg-input border border-gold/20 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors text-sm"
                          dir="ltr"
                        />
                      )}

                      {block.type === "music" && (
                        <input
                          value={block.content}
                          onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                          placeholder="رابط الموسيقى (URL)"
                          className="w-full bg-input border border-gold/20 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors text-sm"
                          dir="ltr"
                        />
                      )}

                      {block.type === "video" && (
                        <input
                          value={block.content}
                          onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                          placeholder="رابط الفيديو (YouTube أو رابط مباشر)"
                          className="w-full bg-input border border-gold/20 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors text-sm"
                          dir="ltr"
                        />
                      )}

                      {block.type === "hidden-message" && (
                        <div className="space-y-3">
                          <input
                            value={block.title || ""}
                            onChange={(e) => updateBlock(block.id, { title: e.target.value })}
                            placeholder="نص الزر (مثال: اضغط لكشف السر 💌)"
                            className="w-full bg-input border border-gold/20 rounded-xl px-4 py-2 text-foreground focus:outline-none focus:border-primary transition-colors text-sm"
                          />
                          <textarea
                            value={block.content}
                            onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                            placeholder="الرسالة المخفية..."
                            rows={2}
                            className="w-full bg-input border border-gold/20 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors resize-none text-sm"
                          />
                        </div>
                      )}

                      {block.type === "counter" && (
                        <p className="text-sm text-muted-foreground">
                          سيظهر عداد تلقائي من تاريخ بداية العلاقة المحدد أعلاه ⏱️
                        </p>
                      )}

                      {/* Block color */}
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gold/10">
                        <span className="text-xs text-muted-foreground">لون القسم:</span>
                        <div className="flex gap-1">
                          {ROMANTIC_COLORS.slice(0, 5).map((c) => (
                            <button
                              key={c.value}
                              onClick={() => updateBlock(block.id, { color: c.value })}
                              className={`w-6 h-6 rounded-full border-2 transition-all ${
                                block.color === c.value ? "border-primary scale-110" : "border-transparent"
                              }`}
                              style={{ backgroundColor: c.value }}
                              title={c.name}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Design Tab */}
        {activeTab === "design" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-gradient-card border border-gold/20 rounded-2xl p-6">
              <h3 className="text-lg font-heading text-gradient-gold mb-6">الألوان</h3>
              
              {[
                { label: "لون الخلفية", key: "backgroundColor" as const },
                { label: "لون النص", key: "textColor" as const },
                { label: "لون الإطار", key: "borderColor" as const },
              ].map((item) => (
                <div key={item.key} className="mb-6">
                  <label className="text-sm text-muted-foreground mb-2 block">{item.label}</label>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg border border-gold/30"
                      style={{ backgroundColor: album[item.key] }}
                    />
                    <div className="flex gap-2 flex-wrap">
                      {ROMANTIC_COLORS.map((c) => (
                        <button
                          key={c.value}
                          onClick={() => updateAlbum({ [item.key]: c.value })}
                          className={`w-8 h-8 rounded-lg border-2 transition-all flex items-center justify-center ${
                            album[item.key] === c.value ? "border-primary scale-110" : "border-gold/20"
                          }`}
                          style={{ backgroundColor: c.value }}
                          title={c.name}
                        >
                          {album[item.key] === c.value && (
                            <Check className="w-3 h-3 text-foreground" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-gradient-card border border-gold/20 rounded-2xl p-6 space-y-6">
              <h3 className="text-lg font-heading text-gradient-gold mb-4">التأثيرات</h3>

              <div className="flex items-center justify-between">
                <span className="text-foreground">القلوب الطائرة</span>
                <button
                  onClick={() => updateAlbum({ enableHearts: !album.enableHearts })}
                  className={`w-12 h-7 rounded-full transition-all ${
                    album.enableHearts ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-foreground rounded-full transition-transform mx-1 ${
                      album.enableHearts ? "translate-x-0" : "translate-x-5"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-foreground">الإضاءة والتوهج</span>
                <button
                  onClick={() => updateAlbum({ enableLights: !album.enableLights })}
                  className={`w-12 h-7 rounded-full transition-all ${
                    album.enableLights ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-foreground rounded-full transition-transform mx-1 ${
                      album.enableLights ? "translate-x-0" : "translate-x-5"
                    }`}
                  />
                </button>
              </div>

              <div>
                <label className="text-sm text-foreground mb-2 block">سرعة الأنيميشن</label>
                <div className="flex gap-2">
                  {(["slow", "normal", "fast"] as const).map((speed) => (
                    <button
                      key={speed}
                      onClick={() => updateAlbum({ animationSpeed: speed })}
                      className={`flex-1 py-2 rounded-lg text-sm transition-all ${
                        album.animationSpeed === speed
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {speed === "slow" ? "بطيء" : speed === "normal" ? "عادي" : "سريع"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Builder;
