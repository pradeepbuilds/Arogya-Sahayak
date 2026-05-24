import { useEffect, useState } from "react";
import { ShieldCheck, Plus, Trash2, ExternalLink } from "lucide-react";
import API from "../../api/axios";

const Schemes = () => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    benefits: "",
    applyLink: "",
    category: "health",
  });

  const fetchSchemes = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await API.get("/schemes");
      setSchemes(res.data.data || []);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load schemes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      await API.post("/schemes/admin", form);

      setForm({
        name: "",
        description: "",
        benefits: "",
        applyLink: "",
        category: "health",
      });

      fetchSchemes();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to add scheme");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this scheme?")) return;

    try {
      setError("");
      await API.delete(`/schemes/admin/${id}`);
      fetchSchemes();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete scheme");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-blue-600 font-semibold">Welfare Programs</p>
        <h1 className="text-4xl font-black text-slate-900 mt-1">
          Schemes Management
        </h1>
        <p className="text-slate-500 mt-2">
          Add, review and manage worker welfare schemes.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 rounded-2xl px-5 py-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-600 text-white p-3 rounded-2xl">
            <Plus size={22} />
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            Add New Scheme
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <input
            type="text"
            name="name"
            placeholder="Scheme Name"
            value={form.name}
            onChange={handleChange}
            required
            className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="health">Health</option>
            <option value="insurance">Insurance</option>
            <option value="pension">Pension</option>
            <option value="housing">Housing</option>
            <option value="other">Other</option>
          </select>

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            rows="4"
            className="md:col-span-2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <textarea
            name="benefits"
            placeholder="Benefits"
            value={form.benefits}
            onChange={handleChange}
            rows="3"
            className="md:col-span-2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="text"
            name="applyLink"
            placeholder="Apply Link"
            value={form.applyLink}
            onChange={handleChange}
            className="md:col-span-2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-2xl py-3 font-bold flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            {saving ? "Adding..." : "Add Scheme"}
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-2xl font-black text-slate-900 mb-5">
          All Schemes
        </h2>

        {loading ? (
          <div className="text-slate-500">Loading schemes...</div>
        ) : schemes.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 text-slate-500">
            No schemes found
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {schemes.map((scheme) => (
              <div
                key={scheme._id}
                className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex gap-4">
                    <div className="bg-indigo-50 text-indigo-600 p-3 rounded-2xl h-fit">
                      <ShieldCheck size={24} />
                    </div>

                    <div>
                      <h3 className="text-xl font-black text-slate-900">
                        {scheme.name}
                      </h3>
                      <p className="text-sm text-slate-500 capitalize mt-1">
                        {scheme.category}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      scheme.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {scheme.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <p className="text-slate-600 mt-5">
                  {scheme.description || "No description"}
                </p>

                <div className="mt-5 bg-slate-50 rounded-2xl p-4">
                  <h4 className="font-bold text-slate-800 mb-1">Benefits</h4>
                  <p className="text-slate-600 text-sm">
                    {scheme.benefits || "No benefits added"}
                  </p>
                </div>

                <div className="mt-5 flex gap-3">
                  {scheme.applyLink && (
                    <a
                      href={scheme.applyLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-blue-600 font-bold"
                    >
                      <ExternalLink size={17} />
                      Apply Now
                    </a>
                  )}

                  <button
                    onClick={() => handleDelete(scheme._id)}
                    className="ml-auto inline-flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-xl font-bold text-sm"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Schemes;