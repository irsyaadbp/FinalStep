import { motion } from "motion/react";
import { GraduationCap, Mail, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/types/shared";
import {
  FormGenerator,
  type FormField,
} from "../../components/common/FormGenerator";
import { Button } from "../../components/ui/Button";
import { Link, useNavigate } from "react-router";
import { useAsyncFetch } from "../../hooks/useAsyncFetch";
import { authService } from "../../service/auth";
import { type AuthResponse } from "@/types/shared";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";

const fields: FormField<LoginInput>[] = [
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
    placeholder: "••••••••",
    type: "password",
    required: true,
  },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { login: setAuthUser } = useAuth();
  
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const { execute: login, isLoading: loading } = useAsyncFetch<AuthResponse>(
    async () => {
        const values = getValues();
        return await authService.login(values);
    },
    {
      immediate: false,
      onSuccess: (response: AuthResponse) => {
        setAuthUser(response.data!);
        toast.success("Login berhasil! Selamat datang kembali.");

        if (response.data?.user.role === 'admin') {
            navigate("/dashboard");
        } else {
            navigate("/");
        }
      },
      onError: (error: unknown) => {
        const err = error as Error;
        toast.error(err.message || "Gagal login. Silakan coba lagi.");
      },
    }
  );

  const onSubmit = async () => {
    await login();
  };

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
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-primary shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2),0_6px_0_0_color-mix(in_srgb,var(--color-primary),black_20%),0_6px_15px_0_color-mix(in_srgb,var(--color-primary)_30%,transparent)]">
            <GraduationCap className="h-8 w-8 text-primary-foreground" />
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormGenerator fields={fields} register={register} errors={errors} />

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
        transition={{ delay: 0.6 }}
        className="mt-6 text-center text-sm text-muted-foreground"
      >
        Belum punya akun?{" "}
        <Link to="/register" className="font-bold text-primary hover:underline">
          Daftar
        </Link>
      </motion.p>
    </>
  );
}
