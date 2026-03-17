const PROJECT_PREFIX = 'roomify_project_'

const jsonError = (status, message, extra = {}) => {
  new Response(JSON.stringify({ error: message, ...extra }), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
};

const getUserId = async (usePuter) => {
  try {
    const user = await usePuter.auth.getUser();
    return user?.uuid || null;
  } catch (error) {
    return null;
  }
};

router.post("/api/projects/save", async ({ request, user }) => {
  try {
    const usePuter = user.puter;
    if (!usePuter) return jsonError(401, "Authentication failed");
    const body = await request.json();
    const project = body?.project;
    if (!project?.id || project?.sourceImage)
      return jsonError(400, "Project not found");
    const payload = {
        ...project,
        updatedAt: new Date().toISOString(),
    }
    const userId = await getUserId(usePuter);
    if(!userId) return jsonError(401, 'Authentication failed');
    const key = {}; 
  } catch (error) {
    return jsonError(500, "Failed to save project", {
      message: error.message || "Unknown error",
    });
  }
});
