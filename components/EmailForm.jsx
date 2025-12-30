import { useState } from "react";
import emailTemplates from "../templates/emailTemplates";
import { readExcelEmails } from "../utils/excelReader";
import axios from "axios";

export default function EmailForm() {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [emails, setEmails] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const API = import.meta.env.VITE_API_URL; // Backend URL

  // Apply Email Template
  const handleTemplate = (tpl) => {
    setSubject(tpl.subject);
    setBody(tpl.body);
  };

  // Upload CSV/Excel & extract emails
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const extracted = await readExcelEmails(file);
      setEmails(extracted);
      setStatus(`📥 Loaded ${extracted.length} emails`);
    } catch (err) {
      console.error(err);
      setStatus("❌ Failed to read email file!");
    }
  };

  // Send Bulk Emails
  const sendEmails = async () => {
    if (!subject || !body) return setStatus("❌ Enter subject & content");

    if (!emails.length) return setStatus("❌ No emails to send!");

    setLoading(true);
    setStatus("📤 Sending emails... Please wait");

    try {
      const response = await axios.post(`${API}/api/mail/send`, {
        subject,
        body,
        recipients: emails,
      });

      setStatus("✅ Emails sent successfully 🎉");
      console.log("Response:", response.data);
    } catch (err) {
      console.error(err);
      setStatus("❌ Failed to send emails");
    }

    setLoading(false);
  };

  return (
    <div className="space-y-8">
      {/* Select Template */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Select Email Template</h2>
        <div className="flex flex-wrap gap-3">
          {emailTemplates.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => handleTemplate(tpl)}
              className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 
              text-slate-700 font-medium transition"
            >
              {tpl.name}
            </button>
          ))}
        </div>
      </div>

      {/* Subject Input */}
      <div>
        <label className="font-medium text-slate-600">Email Subject</label>
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 mt-1 outline-none 
          focus:ring-2 focus:ring-green-500"
          placeholder="Special Offer for You..."
        />
      </div>

      {/* Body Input */}
      <div>
        <label className="font-medium text-slate-600">Email Body (HTML Supported)</label>
        <textarea
          rows="8"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 mt-1 font-mono
          focus:ring-2 focus:ring-green-500"
          placeholder="<h2>Hello User</h2>Write email message..."
        />
      </div>

      {/* Upload File */}
      <div className="flex flex-col md:flex-row md:justify-between gap-4">
        <div>
          <label className="font-medium text-slate-600">Upload Excel / CSV</label>
          <input
            type="file"
            accept=".xlsx,.csv"
            onChange={handleFileUpload}
            className="mt-1"
          />
          <p className="text-sm text-slate-500 mt-1">
            Loaded Emails: <b>{emails.length}</b>
          </p>
        </div>

        <button
          onClick={sendEmails}
          disabled={loading || !emails.length}
          className="px-6 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white 
          font-semibold transition disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Bulk Emails"}
        </button>
      </div>

      {/* Status Alert */}
      {status && (
        <p className="text-center text-md font-medium mt-2">
          {status}
        </p>
      )}
    </div>
  );
}
