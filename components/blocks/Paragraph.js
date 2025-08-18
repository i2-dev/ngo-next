export default function Paragraph(block) {
  return (
    <div className="mb-8">
      {block.content ? (
        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: block.content }}
        />
      ) : (
        <p>{block.content}</p>
      )}
    </div>
  );
}
