export default function PageIntro({ eyebrow, title, text, actions }) {
  return (
    <section className="hero-panel">
      <div>
        <span className="eyebrow light">{eyebrow}</span>
        <h2>{title}</h2>
        <p>{text}</p>
      </div>
      {actions && <div className="actions">{actions}</div>}
    </section>
  );
}
