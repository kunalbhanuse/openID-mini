export default function Panel({ eyebrow, title, text, children, className = "" }) {
  return (
    <section className={`panel ${className}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      {title && <h2>{title}</h2>}
      {text && <p>{text}</p>}
      {children}
    </section>
  );
}
