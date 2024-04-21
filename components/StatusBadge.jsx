export default function StatusBadge({ text }) {
  return (
    <span className="inline-flex items-center bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full font-inter capitalize">
      <span className="w-2 h-2 me-1 bg-green-500 rounded-full"></span>
      {text}
    </span>
  );
}
