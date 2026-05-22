export default function FlowStep({ number, title, text }) {
  return (
    <div className="flow-step">
      <span>{number}</span>
      <div>
        <strong>{title}</strong>
        <small>{text}</small>
      </div>
    </div>
  );
}
