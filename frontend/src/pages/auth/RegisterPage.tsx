import { Link } from "react-router";
import { motion } from "motion/react";
import {
  GraduationCap,
  Mail,
  School,
  Target,
  User,
  Lock,
  type LucideIcon,
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import { useState } from "react";
import { Label } from "../../components/ui/Label";
import { Input } from "../../components/ui/Input";
import { PasswordInput } from "../../components/ui/PasswordInput";

const fields = [
  {
    id: "name",
    label: "Nama Lengkap",
    icon: User,
    placeholder: "Ahmad Rizky",
    type: "text",
    required: true,
  },
  {
    id: "email",
    label: "Email",
    icon: Mail,
    placeholder: "ahmad@email.com",
    type: "email",
    required: true,
  },
  {
    id: "password",
    label: "Password",
    icon: Lock,
    placeholder: "Min. 8 karakter",
    type: "password",
    required: true,
  },
  {
    id: "school",
    label: "Asal Sekolah",
    icon: School,
    placeholder: "SMAN 1 Jakarta",
    type: "text",
    required: true,
  },
  {
    id: "targetUniversity",
    label: "Universitas Impian",
    icon: Target,
    placeholder: "Universitas Indonesia",
    type: "text",
    required: false,
  },
];

export default function RegisterPage() {
  const [loading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    school: "",
    targetUniversity: "",
  });

  const update = (field: string, value: string) =>
    setForm({ ...form, [field]: value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  };
  return (
    <>
        {/* Logo */}
        <div className="mb-6 text-center">
          <motion.div
            initial={{ scale: 0, rotate: 20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.1,
            }}
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-primary shadow-[inset_0_2px_0_0_rgba(255,255,255,0.3),0_8px_24px_0_hsl(var(--primary)/0.35)]">
              <GraduationCap className="h-8 w-8 text-primary-foreground" />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="font-display text-2xl font-black">
              Mulai Petualanganmu! 🌟
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Buat akun dan raih universitas impianmu
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
          <form onSubmit={handleSubmit} className="space-y-3">
            {fields.map((f, i) => {
              const Icon = f.icon as LucideIcon;
              const Component = f.id === "password" ? PasswordInput : Input;
              return (
                <motion.div
                  key={f.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.06 }}
                  className="space-y-1.5"
                >
                  <Label htmlFor={f.id} className="text-xs font-bold">
                    {f.label}
                  </Label>
                  <div className="relative">
                    <Icon className="absolute z-10 left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
                    <Component
                      id={f.id}
                      type={f.id === "password" ? undefined : f.type}
                      placeholder={f.placeholder}
                      value={form[f.id as keyof typeof form]}
                      onChange={(e) => update(f.id, e.target.value)}
                      className="pl-10 h-11 rounded-xl border-2 bg-background shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.04)] focus:shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.04),0_0_0_3px_hsl(var(--primary)/0.12)] transition-shadow text-sm"
                      required={f.required}
                    />
                  </div>
                </motion.div>
              );
            })}

            <Button
              type="submit"
              className="w-full text-sm font-black"
              loading={loading}
            >
              {loading ? "Membuat akun..." : "DAFTAR SEKARANG"}
            </Button>
          </form>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-center text-sm text-muted-foreground"
        >
          Sudah punya akun?{" "}
          <Link to="/login" className="font-bold text-primary hover:underline">
            Masuk
          </Link>
        </motion.p>
    </>
  );
}
