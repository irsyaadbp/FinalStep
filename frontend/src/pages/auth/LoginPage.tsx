import { Link } from "react-router";
import { motion } from "motion/react";
import { GraduationCap, Mail, Lock } from "lucide-react";
import { useState } from "react";
import { Label } from "../../components/ui/Label";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { PasswordInput } from "../../components/ui/PasswordInput";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  function handleSubmit() {}
  return (
    <>
      {/* Logo + Title */}
      <div className="mb-8 text-center">
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
            delay: 0.1,
          }}
        >
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary shadow-[inset_0_2px_0_0_rgba(255,255,255,0.3),0_8px_24px_0_hsl(252 60% 50%/0.35)]">
            <GraduationCap className="h-10 w-10 text-primary-foreground" />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <h1 className="font-display text-3xl font-black">FinalStep</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Siap taklukkan ujianmu? 🚀
          </p>
        </motion.div>
      </div>

      {/* Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-3xl border-2 border-border bg-card p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.5),0_8px_24px_0_rgba(0,0,0,0.06)]"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-bold">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute z-10 left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
              <Input
                id="email"
                type="email"
                placeholder="ahmad@email.com"
                value={form.email}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, email: e.target.value }))
                }
                className="pl-10 h-12 rounded-xl border-2 bg-background shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.04)] focus:shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.04),0_0_0_3px_hsl(252 60% 50%/0.12)] transition-shadow"
                required
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs font-bold">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute z-10 left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
              <PasswordInput
                id="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, password: e.target.value }))
                }
                className="pl-10 h-12 rounded-xl border-2 bg-background shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.04)] focus:shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.04),0_0_0_3px_hsl(252 60% 50%/0.12)] transition-shadow"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full text-sm font-black"
            loading={loading}
          >
            {loading ? "Memproses..." : "MASUK"}
          </Button>
        </form>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 text-center text-sm text-muted-foreground"
      >
        Belum punya akun?{" "}
        <Link to="/register" className="font-bold text-primary hover:underline">
          Daftar Sekarang
        </Link>
      </motion.p>
    </>
  );
}
