import blockRenderFunc from "@/utils/block-render-func";
import Heading from "@/components/blocks/Heading";
import Paragraph from "@/components/blocks/Paragraph";
import FullImage from "@/components/blocks/FullImage";

export default async function DynamicAboutPage({ params }) {
  return blockRenderFunc({
    endpoint: "articles",
    componentList: [Heading, Paragraph, FullImage],
    params,
  });
}
