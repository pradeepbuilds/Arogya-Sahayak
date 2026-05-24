import { useEffect, useState } from "react";
import { Search, CheckCircle, Eye, Users } from "lucide-react";
import { Link } from "react-router-dom";
import API from "../../api/axios";

const Workers = () => {
  const [workers, setWorkers] = useState([]);
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const fetchWorkers = async () => {
    try {
      setLoading(true);

      const res = await API.get("/admin/workers");

      setWorkers(res.data.data || []);
      setFilteredWorkers(res.data.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  useEffect(() => {
    let updated = [...workers];

    if (search) {
      updated = updated.filter(
        (worker) =>
          worker.name.toLowerCase().includes(search.toLowerCase()) ||
          worker.workerId.toLowerCase().includes(search.toLowerCase()) ||
          worker.phone.includes(search)
      );
    }

    if (filter === "verified") {
      updated = updated.filter((worker) => worker.isVerified);
    }

    if (filter === "pending") {
      updated = updated.filter((worker) => !worker.isVerified);
    }

    setFilteredWorkers(updated);
  }, [search, filter, workers]);

  const verifyWorker = async (id) => {
    try {
      await API.put(`/admin/workers/${id}/verify`);
      fetchWorkers();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-blue-600 font-semibold">Worker Management</p>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mt-2">
          <div>
            <h1 className="text-4xl font-black text-slate-900">
              Registered Workers
            </h1>

            <p className="text-slate-500 mt-2">
              Monitor, verify and manage all registered workers.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 px-6 py-4 flex items-center gap-4">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-2xl">
              <Users size={24} />
            </div>

            <div>
              <p className="text-slate-500 text-sm">Total Workers</p>
              <h2 className="text-3xl font-black text-slate-900">
                {workers.length}
              </h2>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="relative lg:col-span-2">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search by name, phone or worker ID"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Workers</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-slate-500">Loading workers...</div>
      ) : filteredWorkers.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 text-slate-500">
          No workers found
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {filteredWorkers.map((worker) => (
            <div
              key={worker._id}
              className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-2xl font-black">
                    {worker.name?.charAt(0)}
                  </div>

                  <div>
                    <h2 className="text-2xl font-black text-slate-900">
                      {worker.name}
                    </h2>

                    <p className="text-slate-500 mt-1">
                      {worker.workerId}
                    </p>

                    <p className="text-slate-500 text-sm mt-1">
                      {worker.phone}
                    </p>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    worker.isVerified
                      ? "bg-green-100 text-green-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {worker.isVerified ? "Verified" : "Pending"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-slate-50 rounded-2xl p-4">
                  <p className="text-xs text-slate-400">Occupation</p>
                  <p className="font-bold text-slate-800 mt-1">
                    {worker.occupation || "-"}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4">
                  <p className="text-xs text-slate-400">Location</p>
                  <p className="font-bold text-slate-800 mt-1">
                    {worker.city}, {worker.state}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Link
                  to={`/workers/${worker._id}`}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl py-3 flex items-center justify-center gap-2 font-bold"
                >
                  <Eye size={18} />
                  View Details
                </Link>

                {!worker.isVerified && (
                  <button
                    onClick={() => verifyWorker(worker._id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-5 rounded-2xl flex items-center justify-center gap-2 font-bold"
                  >
                    <CheckCircle size={18} />
                    Verify
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Workers;