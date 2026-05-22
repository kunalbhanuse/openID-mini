export default function TokenBlock({ label, value }) {
  return (
    <div className="token-block">
      <span>{label}</span>
      <code>{value}</code>
    </div>
  );
}
