export default function AdminTools({ onSchoolsDeleted }) {
  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Database Management</h2>
        <div className="space-y-4">
          <button
            onClick={onSchoolsDeleted}
            className="btn btn-danger"
          >
            Delete All Schools
          </button>
          <p className="text-sm text-gray-500">
            Warning: This will permanently delete all schools from the database. This action cannot be undone.
          </p>
        </div>
      </div>
    </div>
  );
} 