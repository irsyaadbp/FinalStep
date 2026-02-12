
import { useParams } from "react-router";

export default function SubjectDetailPage() {
  const { slug } = useParams();
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Subject: {slug}</h1>
      <p>Content for {slug} will appear here.</p>
    </div>
  );
}
