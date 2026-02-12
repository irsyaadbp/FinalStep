
import { Link, useParams } from "react-router";

export default function MaterialsPage() {
  const { slug } = useParams();
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Materials for {slug}</h1>
      <div className="mt-4">
        <Link to={`/dashboard/subjects/${slug}/materials/quiz-1/quizzes`} className="text-indigo-600 hover:text-indigo-900 block">Manage Quizzes for Material 1</Link>
      </div>
    </div>
  );
}
