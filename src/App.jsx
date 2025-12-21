import EmailForm from "../components/EmailForm";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 py-10">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-slate-800">
            WrongTurnClub Holidays
          </h1>
          <p className="mt-2 text-lg text-slate-600">
            Bulk Email Marketing System
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <EmailForm />
        </div>
      </div>
    </div>
  );
}

export default App;
