# Temporal Flow MCP Server

A dedicated API server for querying and aggregating Temporal workflow data, designed for integration with Temporal Flow and MCP (Model Control Plane) tools.

## Features

- Search workflows in Temporal
- Fetch raw workflow events
- Aggregate events into workflows, activities, timers, and signals (as expected by the UI)
- Health check endpoint

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- Temporal Cloud API credentials

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Configure environment**
   Create a `.env` file in the `mcp/` directory:
   ```env
   TEMPORAL_API_KEY=<your-temporal-api-key>
   TEMPORAL_ENDPOINT=<your-temporal-endpoint>
   ```
3. **Run the server**
   ```bash
   npm run dev
   ```
   The server will be available at `http://localhost:7531`

## API Endpoints

### Search Workflows

```
GET /search?query={searchQuery}&namespace={namespace}
```

Returns a list of workflows matching the query.

### Get Workflow Events (Raw)

```
GET /workflow?namespace={namespace}&id={workflowId}&runId={runId}
```

Returns the raw event history for a workflow.

### Get Aggregated Workflow Data

```
GET /workflow/data?namespace={namespace}&id={workflowId}&runId={runId}
```

Returns aggregated workflow, activity, timer, and signal objects as expected by the UI.

### Health Check

```
GET /health
```

Returns `{ status: "ok" }` if the server is running.

## Environment Variables

- `TEMPORAL_API_KEY`: Your Temporal Cloud API key
- `TEMPORAL_ENDPOINT`: Your Temporal namespace endpoint (omit protocol and domain suffix)

## License

MIT
