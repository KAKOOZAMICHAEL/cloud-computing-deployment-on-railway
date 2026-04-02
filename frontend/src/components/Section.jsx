export default function Section({ title, children }) {
  return (
    <section className="section">
      <h2 className="sectionTitle">{title}</h2>
      <div className="sectionBody">{children}</div>
    </section>
  );
}

