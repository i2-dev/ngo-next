// convert function name to normalized key (remove case and dash differences)
const componentNameToKey = (componentName) => {
  return componentName
    .replace(/([A-Z])/g, "-$1") // CamelCase to kebab-case
    .toLowerCase()
    .replace(/^-/, "") // remove leading dash
    .replace(/-+/g, "-"); // normalize multiple dashes to single dash
};

// normalize string for comparison (remove dashes and lowercase)
const normalizeForComparison = (str) => {
  return str.toLowerCase().replace(/-/g, "");
};

// create components map with flexible matching
const createComponentMap = (componentList) => {
  const map = {};
  componentList.forEach((component) => {
    const normalizedComponentName = normalizeForComparison(component.name);
    map[normalizedComponentName] = component;
  });
  return map;
};

const BlockRender = ({ blocks, componentList }) => {
  // Handle missing blocks or componentList
  if (!blocks || !componentList || !Array.isArray(blocks)) {
    console.warn("BlockRender: blocks or componentList is missing or empty");
    return null;
  }

  const components = createComponentMap(componentList);

  return (
    <>
      {blocks.map((block, index) => {
        const componentName = block.__component.replace("blocks.", "");
        const normalizedComponentName = normalizeForComparison(componentName);
        const Component = components[normalizedComponentName];

        if (!Component) {
          console.warn(`Component not found for: ${block.__component}`);
          return null;
        }

        return <Component key={index} {...block} />;
      })}
    </>
  );
};

export default BlockRender;
