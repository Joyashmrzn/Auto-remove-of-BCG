import { useRef } from "react";
import ColorPicker from "./ColorPicker";

export default function UploadForm({
  photo,
  preview,
  bgColor,
  setBgColor,
  copies,
  setCopies,
  dragging,
  setDragging,
  loading,
  error,
  handleFile,
  handleSubmit,
}) {
  const fileInputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) handleFile(file);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Upload Box */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors ${
          dragging
            ? "border-blue-400 bg-blue-50"
            : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50"
        }`}
        onClick={() => fileInputRef.current.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        {preview ? (
          <img
            src={preview}
            alt="preview"
            className="w-32 h-32 object-cover rounded-lg mb-3 border border-gray-200"
          />
        ) : (
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
              <path d="M12 16V8m0 0l-3 3m3-3l3 3" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20 16.5A4.5 4.5 0 0016.5 12H15a6 6 0 10-11.8 1.5" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
        )}
        <p className="text-sm font-medium text-gray-700">
          {preview ? photo.name : "Click or drag photo here"}
        </p>
        <p className="text-xs text-gray-400 mt-1">JPG, PNG supported</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />
      </div>

      {/* Background Color */}
      <ColorPicker bgColor={bgColor} setBgColor={setBgColor} />

      {/* Copies */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Number of Copies
          <span className="ml-2 text-blue-600 font-semibold">{copies}</span>
        </label>
        <p className="text-xs text-gray-400 mb-3">Max 15 photos fit on one A4 sheet</p>
        <input
          type="range"
          min={1}
          max={15}
          step={1}
          value={copies}
          onChange={(e) => setCopies(Number(e.target.value))}
          className="w-full accent-blue-600"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>1</span>
          <span>15</span>
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!photo || loading}
        className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
          !photo || loading
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="40" strokeDashoffset="10"/>
            </svg>
            Processing...
          </span>
        ) : (
          "Generate Passport Photo"
        )}
      </button>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
}