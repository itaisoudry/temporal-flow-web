#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import TemporalService from "./temporal.service";
import { parseTemporalHistory } from "./temporal-mappers";
import { ChronologicalItem } from "./types/events";

// Create server instance
const server = new Server(
  {
    name: "temporal-mcp-server",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Initialize Temporal service
const temporal = new TemporalService();

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "searchWorkflows",
        description: "Search Temporal workflows",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Search query for workflows",
            },
            namespace: {
              type: "string",
              description: "Temporal namespace to search in",
            },
          },
          required: ["namespace"],
        },
      },
      {
        name: "getWorkflowData",
        description: "Get detailed data for a specific workflow",
        inputSchema: {
          type: "object",
          properties: {
            workflowId: {
              type: "string",
              description: "Workflow ID",
            },
            namespace: {
              type: "string",
              description: "Temporal namespace",
            },
            runId: {
              type: "string",
              description: "Workflow run ID",
            },
            format: {
              type: "string",
              description: "Format of the output",
              enum: ["parsed", "raw"],
            },
          },
          required: ["workflowId", "namespace", "runId"],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === "searchWorkflows") {
      const { namespace, query = "" } = args as {
        namespace: string;
        query?: string;
      };

      const result = await temporal.searchWorkflows(query, namespace);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }

    if (name === "getWorkflowData") {
      const {
        workflowId,
        namespace,
        runId,
        format = "parsed",
      } = args as {
        workflowId: string;
        namespace: string;
        runId: string;
        format?: "parsed" | "raw";
      };

      const result = (await temporal.getWorkflowData(
        namespace,
        workflowId,
        runId
      )) as any;

      if (format === "parsed" && result.history?.events) {
        try {
          const parsedData = await parseTemporalHistory(
            result.history.events,
            namespace,
            runId
          );

          // Create summary from parsed data
          const workflows = parsedData.filter(
            (item: ChronologicalItem) =>
              item.type === "workflow" || item.type === "childWorkflow"
          );
          const activities = parsedData.filter(
            (item: ChronologicalItem) => item.type === "activity"
          );
          const timers = parsedData.filter(
            (item: ChronologicalItem) => item.type === "timer"
          );
          const signals = parsedData.filter(
            (item: ChronologicalItem) => item.type === "signal"
          );

          const rootWorkflow = workflows.find(
            (w: any) => w.type === "workflow"
          );
          const summary = {
            totalEvents: result.history.events.length,
            totalItems: parsedData.length,
            workflowCount: workflows.length,
            activityCount: activities.length,
            timerCount: timers.length,
            signalCount: signals.length,
            workflowStatus: rootWorkflow?.status || "unknown",
            startTime: rootWorkflow?.startTime,
            endTime: rootWorkflow?.endTime,
            duration:
              rootWorkflow?.startTime && rootWorkflow?.endTime
                ? new Date(rootWorkflow.endTime).getTime() -
                  new Date(rootWorkflow.startTime).getTime()
                : null,
          };

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(
                  {
                    parsed: true,
                    chronologicalItems: parsedData,
                    summary,
                    rawEventCount: result.history.events.length,
                  },
                  null,
                  2
                ),
              },
            ],
          };
        } catch (parseError) {
          console.error("Failed to parse temporal history:", parseError);
          // Fall back to raw data if parsing fails
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(
                  {
                    parsed: false,
                    parseError:
                      parseError instanceof Error
                        ? parseError.message
                        : "Unknown parsing error",
                    rawData: result,
                  },
                  null,
                  2
                ),
              },
            ],
          };
        }
      }

      // Return raw data
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }

    throw new Error(`Unknown tool: ${name}`);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error(`Tool ${name} failed:`, errorMessage);

    return {
      content: [
        {
          type: "text",
          text: `Error: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Temporal MCP server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
