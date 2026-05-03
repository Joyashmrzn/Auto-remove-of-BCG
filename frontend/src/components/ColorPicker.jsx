export const BG_COLORS = [
  { label: "White (Most countries)", value: "255,255,255", hex: "#ffffff" },
  { label: "Light Grey (UK)", value: "211,211,211", hex: "#d3d3d3" },
  { label: "Light Blue (Some EU)", value: "173,216,230", hex: "#add8e6" },
  { label: "Off White", value: "240,240,240", hex: "#f0f0f0" },
];

export default function ColorPicker({ bgColor, setBgColor }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <label className="block text-sm font-medium text-gray-700 mb-3">Background Color</label>
      <div className="grid grid-cols-2 gap-2">
        {BG_COLORS.map((color) => (
          <button
            key={color.value}
            onClick={() => setBgColor(color)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
              bgColor.value === color.value
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
          >
            <span
              className="w-5 h-5 rounded border border-gray-200 flex-shrink-0"
              style={{ backgroundColor: color.hex }}
            />
            {color.label.split("(")[0].trim()}
          </button>
        ))}
      </div>
    </div>
  );
}