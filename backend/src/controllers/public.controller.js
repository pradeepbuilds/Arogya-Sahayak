const Worker = require("../models/Worker");

exports.getPublicWorkerProfile = async (req, res) => {
  try {
    const { workerId } = req.params;

    const worker = await Worker.findOne({ workerId });

    if (!worker) {
      return res.status(404).send(`
        <h1 style="font-family: Arial; color: #dc2626;">
          Worker not found
        </h1>
      `);
    }

    res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Arogya Sahayak Worker Profile</title>

          <style>
            body {
              margin: 0;
              font-family: Arial, sans-serif;
              background: #eef4fb;
              padding: 24px;
            }

            .container {
              max-width: 480px;
              margin: 0 auto;
            }

            .brand {
              display: flex;
              align-items: center;
              gap: 12px;
              margin-bottom: 24px;
            }

            .logo {
              width: 54px;
              height: 54px;
              border-radius: 18px;
              background: #2563eb;
              color: white;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: 900;
              font-size: 22px;
            }

            .brand h1 {
              margin: 0;
              color: #0f172a;
              font-size: 22px;
            }

            .brand p {
              margin: 4px 0 0;
              color: #64748b;
              font-size: 14px;
            }

            .card {
              background: white;
              border-radius: 28px;
              padding: 24px;
              box-shadow: 0 12px 30px rgba(15, 23, 42, 0.12);
            }

            .status {
              display: inline-block;
              padding: 9px 14px;
              border-radius: 999px;
              font-size: 13px;
              font-weight: 800;
              margin-bottom: 20px;
            }

            .verified {
              background: #dcfce7;
              color: #15803d;
            }

            .pending {
              background: #fef3c7;
              color: #b45309;
            }

            .name {
              font-size: 30px;
              font-weight: 900;
              color: #0f172a;
              margin: 0;
            }

            .worker-id {
              color: #2563eb;
              font-weight: 800;
              margin-top: 6px;
              margin-bottom: 24px;
            }

            .row {
              border-top: 1px solid #e2e8f0;
              padding: 14px 0;
            }

            .label {
              color: #64748b;
              font-size: 13px;
              margin-bottom: 4px;
            }

            .value {
              color: #0f172a;
              font-size: 17px;
              font-weight: 800;
            }

            .footer {
              text-align: center;
              color: #94a3b8;
              font-size: 12px;
              margin-top: 20px;
              line-height: 18px;
            }
          </style>
        </head>

        <body>
          <div class="container">
            <div class="brand">
              <div class="logo">AS</div>
              <div>
                <h1>Arogya Sahayak</h1>
                <p>Worker Welfare Verification</p>
              </div>
            </div>

            <div class="card">
              <div class="status ${worker.isVerified ? "verified" : "pending"}">
                ${worker.isVerified ? "Verified Worker" : "Pending Verification"}
              </div>

              <h2 class="name">${worker.name || "-"}</h2>
              <div class="worker-id">${worker.workerId || "-"}</div>

              <div class="row">
                <div class="label">Occupation</div>
                <div class="value">${worker.occupation || "-"}</div>
              </div>

              <div class="row">
                <div class="label">Blood Group</div>
                <div class="value">${worker.bloodGroup || "-"}</div>
              </div>

              <div class="row">
                <div class="label">Location</div>
                <div class="value">${worker.city || "-"}, ${worker.state || "-"}</div>
              </div>

              <div class="row">
                <div class="label">Emergency Contact</div>
                <div class="value">
                  ${worker.emergencyContact?.name || "-"}
                  ${worker.emergencyContact?.phone ? " - " + worker.emergencyContact.phone : ""}
                </div>
              </div>
            </div>

            <div class="footer">
              This is a public verification profile.<br />
              Sensitive data like Aadhaar, phone number, address and health records are protected.
            </div>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send(`
      <h1 style="font-family: Arial; color: #dc2626;">
        Something went wrong
      </h1>
    `);
  }
};