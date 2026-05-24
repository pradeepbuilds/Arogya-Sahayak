import { useEffect, useState } from "react";
import { Bell, Send, Users, MapPin, User, Clock } from "lucide-react";
import API from "../../api/axios";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    message: "",
    targetType: "all",
    targetState: "",
    targetWorkers: "",
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const notificationRes = await API.get("/notifications/admin/all");
      const workersRes = await API.get("/admin/workers");

      setNotifications(notificationRes.data.data || []);
      setWorkers(workersRes.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const buildPayload = () => {
    const payload = {
      title: form.title,
      message: form.message,
      targetType: form.targetType,
    };

    if (form.targetType === "state") payload.targetState = form.targetState;
    if (form.targetType === "individual") {
      payload.targetWorkers = [form.targetWorkers];
    }

    return payload;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSending(true);
      setError("");

      await API.post("/notifications/admin/send", buildPayload());

      setForm({
        title: "",
        message: "",
        targetType: "all",
        targetState: "",
        targetWorkers: "",
      });

      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send notification");
    } finally {
      setSending(false);
    }
  };

  const uniqueStates = [
    ...new Set(workers.map((worker) => worker.state).filter(Boolean)),
  ];

  const targetIcon = (type) => {
    if (type === "state") return <MapPin size={16} />;
    if (type === "individual") return <User size={16} />;
    return <Users size={16} />;
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-blue-600 font-semibold">Communication</p>
        <h1 className="text-4xl font-black text-slate-900 mt-1">
          Notifications
        </h1>
        <p className="text-slate-500 mt-2">
          Send alerts, health camp updates and welfare announcements.
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
            <Send size={22} />
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            Send Notification
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <input
            type="text"
            name="title"
            placeholder="Notification Title"
            value={form.title}
            onChange={handleChange}
            required
            className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            name="targetType"
            value={form.targetType}
            onChange={handleChange}
            className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Workers</option>
            <option value="state">By State</option>
            <option value="individual">Individual Worker</option>
          </select>

          {form.targetType === "state" && (
            <select
              name="targetState"
              value={form.targetState}
              onChange={handleChange}
              required
              className="md:col-span-2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select State</option>
              {uniqueStates.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          )}

          {form.targetType === "individual" && (
            <select
              name="targetWorkers"
              value={form.targetWorkers}
              onChange={handleChange}
              required
              className="md:col-span-2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Worker</option>
              {workers.map((worker) => (
                <option key={worker._id} value={worker._id}>
                  {worker.name} - {worker.workerId}
                </option>
              ))}
            </select>
          )}

          <textarea
            name="message"
            placeholder="Notification message"
            value={form.message}
            onChange={handleChange}
            required
            rows="4"
            className="md:col-span-2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={sending}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-2xl py-3 font-bold flex items-center justify-center gap-2"
          >
            <Send size={18} />
            {sending ? "Sending..." : "Send Notification"}
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-2xl font-black text-slate-900 mb-5">
          Notification History
        </h2>

        {loading ? (
          <div className="text-slate-500">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 text-slate-500">
            No notifications found
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {notifications.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6"
              >
                <div className="flex justify-between gap-4">
                  <div className="flex gap-4">
                    <div className="bg-indigo-50 text-indigo-600 p-3 rounded-2xl h-fit">
                      <Bell size={22} />
                    </div>

                    <div>
                      <h3 className="font-black text-xl text-slate-900">
                        {item.title}
                      </h3>
                      <p className="text-slate-600 mt-2">{item.message}</p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full h-fit capitalize font-bold">
                    {targetIcon(item.targetType)}
                    {item.targetType}
                  </span>
                </div>

                <div className="mt-5 bg-slate-50 rounded-2xl p-4 text-sm text-slate-600 space-y-1">
                  <p>Sent By: {item.sentBy?.name || "-"}</p>
                  <p>Type: {item.type}</p>
                  {item.targetState && <p>State: {item.targetState}</p>}
                  <p className="flex items-center gap-2 text-slate-400 pt-2">
                    <Clock size={15} />
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;