import { useEffect, useState } from "react";
import { Users, CheckCircle, Clock, Activity } from "lucide-react";
import API from "../../api/axios";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      const res = await API.get("/admin/dashboard");
      setStats(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard");
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (error) return <div className="text-red-600 font-semibold">{error}</div>;
  if (!stats) return <div className="text-slate-600">Loading dashboard...</div>;

  const cards = stats.cards;

  const statCards = [
    {
      title: "Total Workers",
      value: cards.totalWorkers,
      icon: Users,
      color: "bg-blue-600",
    },
    {
      title: "Verified Workers",
      value: cards.verifiedWorkers,
      icon: CheckCircle,
      color: "bg-emerald-600",
    },
    {
      title: "Pending Workers",
      value: cards.pendingWorkers,
      icon: Clock,
      color: "bg-orange-500",
    },
    {
      title: "Active Workers",
      value: cards.activeWorkers,
      icon: Activity,
      color: "bg-indigo-600",
    },
  ];

  const ListCard = ({ title, data }) => (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
      <h2 className="font-bold text-lg text-slate-800 mb-5">{title}</h2>

      {data.length === 0 ? (
        <p className="text-slate-500">No data available</p>
      ) : (
        <div className="space-y-4">
          {data.map((item) => (
            <div key={item._id || "unknown"} className="flex justify-between items-center">
              <span className="text-slate-600 capitalize">
                {item._id || "Unknown"}
              </span>
              <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-bold text-sm">
                {item.count}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <p className="text-blue-600 font-semibold">Overview</p>
        <h1 className="text-4xl font-black text-slate-900 mt-1">
          Admin Dashboard
        </h1>
        <p className="text-slate-500 mt-2">
          Real-time worker welfare and health platform insights.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div className={`${card.color} text-white p-3 rounded-2xl`}>
                  <Icon size={24} />
                </div>
              </div>

              <p className="text-slate-500 mt-5">{card.title}</p>
              <h2 className="text-4xl font-black text-slate-900 mt-1">
                {card.value}
              </h2>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <ListCard title="State Distribution" data={stats.stateStats} />
        <ListCard title="Gender Distribution" data={stats.genderStats} />
        <ListCard title="Top Occupations" data={stats.occupationStats} />
      </div>
    </div>
  );
};

export default Dashboard;