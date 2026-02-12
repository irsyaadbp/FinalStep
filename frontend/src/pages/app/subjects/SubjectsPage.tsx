
import { Link } from "react-router";

export default function SubjectsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Subjects</h1>
      <ul className="mt-4 space-y-2">
        <li><Link to="/subjects/math" className="text-indigo-600 hover:text-indigo-900">Mathematics</Link></li>
        <li><Link to="/subjects/science" className="text-indigo-600 hover:text-indigo-900">Science</Link></li>
      </ul>
    </div>
  );
}
