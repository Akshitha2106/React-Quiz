export default function Progress({
  index,
  numQsns,
  points,
  maxPoints,
  answer,
}) {
  return (
    <header className="progress">
      <progress max={numQsns} value={index + Number(answer != null)} />
      <p>
        Question <strong>{index + 1}</strong>/{numQsns}
      </p>
      <p>
        <strong>{points}</strong>/{maxPoints}
      </p>
    </header>
  );
}
