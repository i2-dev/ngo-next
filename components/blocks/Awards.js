import StrapiImage from '@/components/StrapiImage';

export default function Awards({ 
  Title, 
  AwardsList = [], 
  className = "",
  containerClassName = "",
  titleClassName = "",
  gridClassName = "",
  itemClassName = "",
  imageClassName = "",
  nameClassName = ""
}) {
  if (!AwardsList || AwardsList.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <div className={containerClassName}>
        {/* Title */}
        {Title && (
          <div className={titleClassName}>
            <h2>
              {Title}
            </h2>
          </div>
        )}
        
        {/* Awards Grid */}
        <div className={gridClassName}>
          {AwardsList.map((award, index) => (
            <div key={award.id || index} className={itemClassName}>
              {/* Award Image */}
              {award.Image && award.Image.length > 0 && (
                <div className={imageClassName}>
                  <StrapiImage
                    image={award.Image[0]}
                    alt={award.Image[0].alternativeText || award.name}
                    width={96}
                    height={96}
                  />
                </div>
              )}
              
              {/* Award Name */}
              {award.name && (
                <p className={nameClassName}>
                  {award.name}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}