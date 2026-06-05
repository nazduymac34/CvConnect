export default function FormFeedback({ message, variant = "success" }) {
  if (!message) return null;
  const className = variant === "error" ? "success" : "success";
  const style =
    variant === "error"
      ? { background: "#fff4ef", color: "#ba4b2f", borderColor: "#ffd7c8" }
      : undefined;

  return (
    <div className={className} style={style}>
      {message}
    </div>
  );
}
