interface RoadmapCardsProps {
  roadmap: string;
}

export default function RoadmapCards({
  roadmap,
}: RoadmapCardsProps) {
  const months = roadmap
    .split(/Month \d+/)
    .filter(Boolean);

  return (
    <div className="grid md:grid-cols-3 gap-6 mt-6">
      {months.map((month, index) => (
        <div
          key={index}
          className="bg-slate-800 rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-xl font-bold mb-4 text-blue-400">
            Month {index + 1}
          </h3>

          <ul className="space-y-2">
            {month
              .split("\n")
              .filter((line) => line.trim())
              .map((line, i) => (
                <li key={i}>
                  ✅ {line.replace("•", "").trim()}
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
}