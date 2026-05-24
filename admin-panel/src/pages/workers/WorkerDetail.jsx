import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/axios";

const WorkerDetail = () => {
  const { id } = useParams();

  const [worker, setWorker] = useState(null);
  const [healthRecords, setHealthRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWorker = async () => {
    try {
      const res = await API.get(`/admin/workers`);

      const foundWorker = res.data.data.find(
        (item) => item._id === id
      );

      setWorker(foundWorker);

      const healthRes = await API.get(
        `/health-records/admin/${id}`
      );

      setHealthRecords(healthRes.data.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorker();
  }, []);

  if (loading) {
    return <div>Loading worker...</div>;
  }

  if (!worker) {
    return <div>Worker not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div>
            <img
              src={
                worker.qrCode ||
                "https://via.placeholder.com/200"
              }
              alt="QR"
              className="w-52 h-52 object-cover border rounded-xl"
            />
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-slate-500 text-sm">
                Worker ID
              </p>

              <h2 className="font-bold text-lg">
                {worker.workerId}
              </h2>
            </div>

            <div>
              <p className="text-slate-500 text-sm">
                Name
              </p>

              <h2 className="font-bold text-lg">
                {worker.name}
              </h2>
            </div>

            <div>
              <p className="text-slate-500 text-sm">
                Phone
              </p>

              <h2 className="font-bold text-lg">
                {worker.phone}
              </h2>
            </div>

            <div>
              <p className="text-slate-500 text-sm">
                Gender
              </p>

              <h2 className="font-bold text-lg">
                {worker.gender}
              </h2>
            </div>

            <div>
              <p className="text-slate-500 text-sm">
                Occupation
              </p>

              <h2 className="font-bold text-lg">
                {worker.occupation}
              </h2>
            </div>

            <div>
              <p className="text-slate-500 text-sm">
                Blood Group
              </p>

              <h2 className="font-bold text-lg">
                {worker.bloodGroup}
              </h2>
            </div>

            <div>
              <p className="text-slate-500 text-sm">
                State
              </p>

              <h2 className="font-bold text-lg">
                {worker.state}
              </h2>
            </div>

            <div>
              <p className="text-slate-500 text-sm">
                City
              </p>

              <h2 className="font-bold text-lg">
                {worker.city}
              </h2>
            </div>

            <div>
              <p className="text-slate-500 text-sm">
                Verified
              </p>

              <h2
                className={`font-bold text-lg ${
                  worker.isVerified
                    ? "text-green-600"
                    : "text-orange-500"
                }`}
              >
                {worker.isVerified
                  ? "Verified"
                  : "Pending"}
              </h2>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-2xl font-bold mb-4">
          Health Records
        </h2>

        {healthRecords.length === 0 ? (
          <p className="text-slate-500">
            No health records
          </p>
        ) : (
          <div className="space-y-4">
            {healthRecords.map((record) => (
              <div
                key={record._id}
                className="border rounded-xl p-4"
              >
                <div className="flex justify-between">
                  <h3 className="font-bold text-lg">
                    {record.title}
                  </h3>

                  <span className="text-sm text-slate-500">
                    {record.recordType}
                  </span>
                </div>

                <p className="text-slate-600 mt-2">
                  {record.description}
                </p>

                <div className="mt-3 text-sm text-slate-500">
                  Doctor: {record.doctorName || "-"}
                </div>

                <div className="text-sm text-slate-500">
                  Hospital:{" "}
                  {record.hospitalName || "-"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkerDetail;