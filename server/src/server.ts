import express, { Request, Response } from "express";
import Temporal from "./temporal.service";
import { NotFoundException } from "./excpetions";

const PORT = 7531; // Uncommon port number

const whitelistedOrigins = [
  "http://localhost:5173",
  "https://itaisoudry.github.io",
];

const app = express();
interface WorkflowQuery {
  id: string;
  namespace: string;
  runId: string;
}

const temporal = new Temporal();

app.use((req, res, next) => {
  // allow only itaisoudry.github.io or localhost:5173
  // get the origin from the request headers
  const origin = req.get("origin");
  if (origin && whitelistedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get(
  "/workflow",
  async (req: Request<{}, {}, {}, WorkflowQuery>, res: Response) => {
    const { id, namespace, runId } = req.query;
    try {
      if (!id || !namespace || !runId) {
        res.status(400).json({ error: "Missing required query parameters" });
        return;
      }
      // was const data = await temporal.getRootWorkflowEnrichedData(
      const data = await temporal.getWorkflowEvents(namespace, id, runId);
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) {
        res.status(404).json({
          error: error.message,
        });
      } else {
        res.status(500).json({
          error:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        });
      }
    }
  }
);

app.get("/workflow/data", async (req: Request, res: Response) => {
  const { id, namespace, runId } = req.query;
  if (!id || !namespace || !runId) {
    res.status(400).json({ error: "Missing required query parameters" });
    return;
  }
  try {
    const response = await temporal.getWorkflowData(
      namespace as string,
      id as string,
      runId as string
    );

    res.status(200).json(response);
  } catch (error) {
    console.error(
      `Failed to get workflow data, id: ${id}, namespace: ${namespace}, runId: ${runId}`,
      error
    );
    res.status(500).json({
      error: "Failed to get workflow data",
    });
  }
});

app.get("/search", async (req: Request, res: Response) => {
  const { query, namespace } = req.query;
  if (!namespace) {
    res.status(400).json({ error: "Missing required query parameters" });
    return;
  }
  try {
    const results = await temporal.searchWorkflows(
      query as string,
      namespace as string
    );
    res.status(200).json(results);
  } catch (error) {
    console.error(
      `Failed to search workflows, query: ${query}, namespace: ${namespace}`,
      error
    );
    res.status(500).json({
      error: "Failed to search workflows",
    });
  }
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
