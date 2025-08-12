import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { PREVIEW_CONFIG } from "@/utils/preview-routes";

function getPreviewPath(contentType, slug, locale, status) {
  console.log(
    "****** getPreviewPath ******",
    contentType,
    slug,
    locale,
    status
  );

  //if no contentType, return home page
  if (!contentType) return "/";

  const config = PREVIEW_CONFIG[contentType];

  //if no config, return null
  if (!config) {
    console.log(`No route configured for: ${contentType}`);
    return null;
  }

  //if single type, return path
  if (config.type === "single") {
    console.log(`Single type, returning: ${config.path}`);
    return config.path;
  }

  //if collection type, return path with slug
  const finalPath = slug ? `${config.path}/${slug}` : config.path;
  console.log(`Collection type, returning: ${finalPath}`);
  return finalPath;
}

export const GET = async (request) => {
  const { searchParams } = new URL(request.url);
  const searchParamsData = Object.fromEntries(searchParams);
  const { secret, slug, locale, uid, status } = searchParamsData;

  if (secret !== process.env.PREVIEW_SECRET) {
    return new Response("Invalid token", { status: 401 });
  }

  const contentType = uid?.split(".").pop();
  const basePath = getPreviewPath(contentType, slug, locale, status);

  // if no basePath, return error
  if (!basePath) {
    console.log(
      `Preview failed: No route configured for content type "${contentType}"`
    );
    return new Response(
      `Preview not configured for content type: ${contentType}. Please add it to PREVIEW_ROUTES.`,
      { status: 404 }
    );
  }

  const finalPath =
    locale && locale !== "en" ? "/" + locale + basePath : basePath;
    console.log("Final preview path:", finalPath);

    const draft = await draftMode();
    status === "draft" ? draft.enable() : draft.disable();

    redirect(finalPath);
  };
