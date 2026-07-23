type Props = {
  roadmap: string;
};

export default function RoadmapDisplay({ roadmap }: Props) {
  return (
    <div className="space-y-4">
      {roadmap.split("\n").map((line, index) => {
        if (line.startsWith("MONTH")) {
          return (
            <h2
              key={index}
              className="text-2xl font-bold text-blue-400 mt-8 mb-3"
            >
              {line}
            </h2>
          );
        }

        return (
          <p
            key={index}
            className="text-gray-200 leading-8"
          >
            {line}
          </p>
        );
      })}
    </div>
  );
}