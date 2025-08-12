export default function AboutBlock({ 
  block,
  className = "",
  containerClassName = "",
  titleClassName = "",
  descriptionClassName = ""
}) {
  if (!block && !block?.title && !block?.description) return null;

  return (
    <div className={className}>
      <div className={containerClassName}>
        <h2 className={titleClassName}>{block?.title}</h2>
        <p className={descriptionClassName}>{block?.description}</p>
      </div>
    </div>
  );
}
