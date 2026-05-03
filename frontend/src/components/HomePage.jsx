import { useState } from "react";
import axios from "axios";
import UploadForm from "./UploadForm";
import PreviewCard from "./PreviewCard";
import DownloadButtons from "./DownloadButton";
import ColorPicker, { BG_COLORS } from "./ColorPicker";

export default function Home() {
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [bgColor, setBgColor] = useState(BG_COLORS[0]);
  const [copies, setCopies] = useState(6);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (file) => {
    if (!file) return;
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!photo) return;
    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("photo", photo);
    formData.append("bg_color", bgColor.value);
    formData.append("copies", copies);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/process-image/`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="3" stroke="white" strokeWidth="2"/>
              <circle cx="12" cy="10" r="3" stroke="white" strokeWidth="2"/>
              <path d="M6 20c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="font-semibold text-gray-900 text-lg tracking-tight">PassportSnap</span>
        </div>
        <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">Auto Passport Photo</span>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10">
        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Passport Photo Generator</h1>
          <p className="text-gray-500 text-base">
            Upload your photo — we handle the rest. Background removal, cropping, enhancement & print layout.
          </p>
        </div>

        {/* Pipeline Steps */}
        <div className="grid grid-cols-5 gap-2 mb-10">
          {[
            { icon: "⬆", label: "Upload" },
            { icon: "✂", label: "Remove BG" },
            { icon: "👤", label: "Face Crop" },
            { icon: "✨", label: "Enhance" },
            { icon: "🖨", label: "Print Layout" },
          ].map((step, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-base">
                {step.icon}
              </div>
              <span className="text-xs text-gray-500 text-center">{step.label}</span>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left — Upload Form */}
          <UploadForm
            photo={photo}
            preview={preview}
            bgColor={bgColor}
            setBgColor={setBgColor}
            copies={copies}
            setCopies={setCopies}
            dragging={dragging}
            setDragging={setDragging}
            loading={loading}
            error={error}
            handleFile={handleFile}
            handleSubmit={handleSubmit}
          />

          {/* Right — Preview + Download */}
          <div className="flex flex-col gap-4">
            <PreviewCard result={result} />
            <DownloadButtons result={result} />
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          {[
            { title: "AI Background Removal", desc: "Powered by remove.bg for precise cutouts" },
            { title: "Face Detection & Crop", desc: "OpenCV automatically centers your face" },
            { title: "Print Ready A4", desc: "300 DPI output, perfect for any print shop" },
          ].map((card, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="w-8 h-8 bg-blue-50 rounded-lg mb-3 flex items-center justify-center">
                <div className="w-3 h-3 bg-blue-400 rounded-full" />
              </div>
              <p className="text-sm font-semibold text-gray-800 mb-1">{card.title}</p>
              <p className="text-xs text-gray-400">{card.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}