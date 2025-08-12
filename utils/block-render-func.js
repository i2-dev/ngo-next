import { notFound } from "next/navigation";
import { getPageData } from "@/data/loaders.js";
import BlockRender from "@/components/BlockRender.js";

async function loader(getDataFunction, endpoint, slug = null) {
  try {
    if (typeof getDataFunction !== "function") {
      throw new Error("getDataFunction must be a function");
    }

    const data = slug
      ? await getDataFunction(endpoint, slug)
      : await getDataFunction(endpoint);

    if (!data) {
      return { error: "No data found" };
    }

    return data.data;
  } catch (error) {
    console.error("Loader error:", error);
    return { error: error.message };
  }
}

export default async function blockRenderFunc({
  endpoint,
  componentList,
  params = null,
}) {
  // If params exist, extract slug; otherwise, set to null
  const slug = params ? (await params).slug : null;

  const data = await loader(getPageData, endpoint, slug);

  if (data.error) {
    // If there is a slug but no data is found, call notFound
    if (slug) {
      notFound();
    }
    return <div>Error: {data.error}</div>;
  }

  const pageData = Array.isArray(data) ? data[0] : data;
  const blocks = pageData?.attributes?.blocks || pageData?.blocks || [];

  // If this is a dynamic route but no corresponding content is found, call notFound
  if (slug && (!pageData || blocks.length === 0)) {
    notFound();
  }

  // Show error message only if a regular page has no blocks
  if (!slug && blocks.length === 0) {
    return <div>No content available</div>;
  }

  return <BlockRender blocks={blocks} componentList={componentList} />;
}
