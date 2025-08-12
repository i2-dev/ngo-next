import HeroSection from "@/components/blocks/HeroSection";
import InfoBlock from "@/components/blocks/InfoBlock";
import AboutBlock from "@/components/blocks/AboutBlock";
import blockRenderFunc from "@/utils/block-render-func";

export default async function DynamicAboutPage({ params }) {
  return blockRenderFunc({
    endpoint: "about-uses",
    componentList: [HeroSection, InfoBlock, AboutBlock],
    params,
  });
}
