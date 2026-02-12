
import { useParams } from "react-router";

export default function QuizzesPage() {
    const { slug, materialSlug } = useParams();
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Quizzes for {materialSlug} in {slug}</h1>
      <p>Manage quizzes here.</p>
    </div>
  );
}
