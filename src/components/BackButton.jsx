import { useNavigate } from "react-router-dom";

export default function BackButton() {
  const nav = useNavigate();
  return (
    <button
      onClick={() => nav(-1)}
      className="back-button px-3 py-1 border rounded bg-white hover:bg-gray-50"
    >
      ← Назад
    </button>
  );
}
