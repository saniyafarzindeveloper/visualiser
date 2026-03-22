import { puter } from "@heyputer/puter.js";
import {
  getOrCreateHostingConfig,
  uploadImageToHosting,
} from "./puter.hosting";
import { isHostedUrl } from "./utils";
import { PUTER_WORKER_URL } from "./constants";

//authentication function
export const signIn = async () => await puter.auth.signIn();
export const signOut = async () => await puter.auth.signOut();
export const getCurrentUser = async () => {
  try {
    return await puter.auth.getUser();
  } catch (error) {
    console.log("error in getting current user", error);
    return null;
  }
};

//project creation
export const createProject = async ({
  item, visibility = "private"
}: CreateProjectParams): Promise<DesignItem | null | undefined> => {
  if (!PUTER_WORKER_URL) {
    console.log("Missing Vite puter worker URL");
    return null;
  }
  const projectId = item.id;
  const hosting = await getOrCreateHostingConfig();
  const hostedSource = projectId
    ? await uploadImageToHosting({
        hosting,
        url: item.sourceImage,
        projectId,
        label: "source",
      })
    : null;

  //getting access to the source
  const hostedRender =
    projectId && item.renderedImage
      ? await uploadImageToHosting({
          hosting,
          url: item.renderedImage,
          projectId,
          label: "rendered",
        })
      : null;

  const resolvedSource =
    hostedSource?.url ||
    (isHostedUrl(item.sourceImage) ? item.sourceImage : "");

  if (!resolvedSource) {
    console.log("Failed to host source image, skipping save");
    return null;
  }

  const resolvedRender = hostedRender?.url
    ? hostedRender?.url
    : item.renderedImage && isHostedUrl(item.renderedImage)
      ? item.renderedImage
      : undefined;

  const {
    sourcePath: _sourcePath,
    renderedPath: _renderedPath,
    publicPath: _publicPath,
    ...rest
  } = item;

  const payload = {
    ...rest,
    sourceImage: resolvedSource,
    renderedImage: resolvedRender,
  };

  try {
    const response = await puter.workers.exec(
      `${PUTER_WORKER_URL}/api/projects/save`,
      { method: "POST",
        headers:{
          'Content-Type' : 'application/json',
          body: JSON.stringify({project : payload, })
        }
       },
    );
    return payload;
  } catch (error) {
    console.log("Failed to save project", error);
    return null;
  }
};

export const getProjects = async () => {
  if (!PUTER_WORKER_URL) {
    console.log("Missing Vite puter worker URL");
    return [];
  }

  try {
    const response = await puter.workers.exec(
      `${PUTER_WORKER_URL}/api/projects/list`,
      { method: "GET" },
    );
    if (!response.ok) {
      console.log("Failed to fetch history", await response.text());
      return [];
    }
    const data = (await response.json()) as { projects: DesignItem | null };
    return Array.isArray(data?.projects) ? data?.projects : [];
  } catch (error) {
    console.log("Error occured while fetching projects", error);
    return [];
  }
};
