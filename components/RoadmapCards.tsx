interface RoadmapCardsProps {
  roadmap: any;
}

export default function RoadmapCards({
  roadmap,
}: RoadmapCardsProps) {
  if (!roadmap?.phases) {
    return null;
  }

  return (
    <div className="grid md:grid-cols-2 gap-6 mt-6">
      {roadmap.phases.map((phase: any) => (
        <div
          key={phase.phase}
          className="bg-slate-800 rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-xl font-bold text-blue-400">
            Phase {phase.phase}
          </h3>

          <h4 className="text-lg font-semibold mt-2">
            {phase.title}
          </h4>

          <p className="text-gray-400 mt-2">
            {phase.description}
          </p>

          <div className="mt-4">
            <h5 className="font-semibold">
              Skills
            </h5>

            <ul className="list-disc ml-5 mt-2">
              {phase.skills.map(
                (skill: string, index: number) => (
                  <li key={index}>
                    {skill}
                  </li>
                )
              )}
            </ul>
          </div>

          <div className="mt-4">
            <h5 className="font-semibold">
              Projects
            </h5>

            <ul className="list-disc ml-5 mt-2">
              {phase.projects.map(
                (project: any, index: number) => (
                  <li key={index}>
                    {project.title}
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}