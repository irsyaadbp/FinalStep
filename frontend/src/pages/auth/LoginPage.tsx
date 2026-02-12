import { Link } from "react-router";
import { motion } from "motion/react";
import { GraduationCap, Mail, Lock } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@finalstep/shared";
import {
  FormGenerator,
  type FormField,
} from "../../components/common/FormGenerator";
import { Button } from "../../components/ui/Button";

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
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setLoading(true);
    try {
      // TODO: Implement login logic
      console.log(data);
    } finally {
      setLoading(false);
    }
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
    </>
  );
}
