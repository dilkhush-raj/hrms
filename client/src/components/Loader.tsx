const Circle = ({
  colour,
  percentage,
}: {
  colour: string;
  percentage: number;
}) => {
  const r = 70;
  const circ = 2 * Math.PI * r;
  const strokePct = ((100 - percentage) * circ) / 100;

  return (
    <circle
      r={r}
      cx={100}
      cy={100}
      fill="transparent"
      stroke={strokePct !== circ ? colour : ""}
      strokeWidth={"1.5rem"}
      strokeDasharray={circ}
      strokeDashoffset={percentage ? strokePct : 0}
      strokeLinecap="round"
    ></circle>
  );
};

export default function Loader({
  percentage,
  colour,
}: {
  percentage: number;
  colour: string;
}) {
  return (
    <div>
      <svg width={200} height={200} viewBox="0 0 200 200">
        <g style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}>
          <Circle percentage={100} colour="lightgrey" />
          <Circle colour={colour} percentage={percentage} />
        </g>
      </svg>
    </div>
  );
}
