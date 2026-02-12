
import { Link } from "react-router";

export default function SubjectsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Manage Subjects</h1>
      <div className="mt-4">
        <Link to="/dashboard/subjects/math/materials" className="text-indigo-600 hover:text-indigo-900 block">Manage Math Materials</Link>
      </div>
    </div>
  );
}
