import { useState } from "react";
import emailTemplates from "../templates/emailTemplates";
import { readExcelEmails } from "../utils/excelReader";
import axios from "axios";

export default function EmailForm() {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [emails, setEmails] = useState([]);
  const [status, setStatus] = useState("");

  // Apply template
  const handleTemplate = (tpl) => {
    setSubject(tpl.subject);
    setBody(tpl.body);
  };

  // Read Excel / CSV file
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const extracted = await readExcelEmails(file);
      setEmails(extracted);
    } catch (err) {
      console.error(err);
      setStatus("❌ Failed to read Excel file");
    }
  };

  // Send bulk emails
  const sendEmails = async () => {
    if (!emails.length) {
      setStatus("❌ No emails found");
      return;
    }

    setStatus("📤 Sending emails...");

    try {
      await axios.post("http://localhost:5000/api/mail/send", {
        subject,
        body,
        recipients: emails,
      });

      setStatus("✅ Emails sent successfully!");
    } catch (err) {
      console.error(err);
      setStatus("❌ Failed to send emails");
    }
  };

  return (
    <div className="space-y-8">
      {/* Templates */}
      <div>
        <h2 className="text-xl font-semibold text-slate-700 mb-3">
          Select Email Template
        </h2>
        <div className="flex flex-wrap gap-3">
          {emailTemplates.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => handleTemplate(tpl)}
              className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition"
            >
              {tpl.name}
            </button>
          ))}
        </div>
      </div>

      {/* Subject */}
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">
          Email Subject
        </label>
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-slate-400 outline-none"
          placeholder="Enter email subject"
        />
      </div>

      {/* Body */}
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">
          Email Body (HTML Supported)
        </label>
        <textarea
          rows="8"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-slate-400 outline-none font-mono"
          placeholder="Write your email content here..."
        />
      </div>

      {/* File Upload */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Upload Excel / CSV File
          </label>
          <input
            type="file"
            accept=".xlsx,.csv"
            onChange={handleFileUpload}
            className="block"
          />
          <p className="text-sm text-slate-500 mt-1">
            Total emails loaded: <b>{emails.length}</b>
          </p>
        </div>

        <button
          onClick={sendEmails}
          disabled={!emails.length}
          className="px-6 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition disabled:opacity-50"
        >
          Send Bulk Emails
        </button>
      </div>

      {/* Status */}
      {status && (
        <div className="text-center font-medium text-slate-700">
          {status}
        </div>
      )}
    </div>
  );
}
