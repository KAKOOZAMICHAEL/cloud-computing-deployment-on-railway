export default function SkillsList({ skills }) {
  if (!skills || skills.length === 0) return <p>No skills found.</p>;

  return (
    <div className="chips">
      {skills.map((s) => (
        <div key={s.id} className="chip">
          <div className="chipName">{s.name}</div>
          {s.level ? <div className="chipLevel">{s.level}</div> : null}
        </div>
      ))}
    </div>
  );
}

