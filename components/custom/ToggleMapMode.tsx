import { Grid2X2Plus, MapIcon } from "lucide-react";

export const ToggleMapMode = ({
  mode,
  toggleMode,
}: {
  mode: "territory" | "square";
  toggleMode: () => void;
}) => {
  return (
    <div
      className={`absolute top-[128px] right-[10px] z-10 w-[30px] h-11 flex items-center shadow-sm bg-gray-300 border-2 border-gray-300 p-0.5 rounded-sm cursor-pointer transition-all `}
      onClick={toggleMode}
    >
      <div
        className={`flex items-center justify-center w-[22px] h-[22px] p-1 bg-white rounded-sm shadow-sm transform transition-transform ${
          mode !== "territory" ? "translate-y-2" : "-translate-y-2"
        }`}
        title={mode === "territory" ? "Desenhar território" : "Desenhar quadra"}
      >
        {mode === "territory" ? (
          <MapIcon size={14} className="text-slate-700 relative" strokeWidth="3.5" />
        ) : (
          <Grid2X2Plus size={14} className="text-slate-700 relative" strokeWidth="3.5" />
        )}
      </div>
    </div>
  );
};
