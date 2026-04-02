export default function AboutSection({ about }) {
  if (!about) return <p>No about information yet.</p>;

  return (
    <div className="about">
      <h3 className="aboutHeadline">{about.headline}</h3>
      <p className="aboutText">{about.about_text}</p>
    </div>
  );
}

