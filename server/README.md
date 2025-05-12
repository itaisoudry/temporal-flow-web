# Temporal Flow API Server

[![Docker](https://img.shields.io/badge/docker-available-blue?style=flat-square&logo=docker)](https://github.com/itaisoudry/temporal-flow-server/pkgs/container/temporal-flow-server)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)

> A robust API server for fetching and managing Temporal Events, providing essential data for workflow visualization and management.

🔗 [Temporal Flow Web](https://itaisoudry.github.io/temporal-flow-web)

## Overview

The Temporal Flow API Server is a dedicated service that interfaces with Temporal Cloud to fetch and process workflow events. It provides a clean, RESTful API that powers the Temporal Flow Web interface, enabling users to visualize and interact with their workflow data effectively.

## Features

- 🔄 Real-time workflow event fetching
- 🔒 Secure API key authentication
- 🐳 Docker support for easy deployment
- ⚡ Fast and efficient data processing
- 🔍 Comprehensive workflow history access

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- A Temporal Cloud account with API credentials

## Quick Start

### Local Development

1. **Clone the repository**

   ```bash
   git clone https://github.com/itaisoudry/temporal-flow-server.git
   cd temporal-flow-server
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment**
   Create a `.env` file in the root directory:

   ```env
   TEMPORAL_API_KEY=<your-temporal-api-key>
   TEMPORAL_ENDPOINT=<your-temporal-endpoint>
   ```

   > **Note**:
   >
   > - Find your `TEMPORAL_API_KEY` in Temporal Cloud account settings
   > - `TEMPORAL_ENDPOINT` should be your namespace ID (e.g., "temporal-flow.zn0bd.tmprl.cloud")
   > - Omit "https://" and ".web.tmprl.cloud" from the endpoint
   > - For local development, you can use localhost (some features may be limited)

4. **Start the server**
   ```bash
   npm run dev
   ```
   The server will be available at `http://localhost:7531`

### Docker Deployment

#### Using Pre-built Image

```bash
docker run -p 7531:7531 \
  -e TEMPORAL_API_KEY=your-api-key \
  -e TEMPORAL_ENDPOINT=your-endpoint \
  ghcr.io/itaisoudry/temporal-flow-web:main
```

#### Building from Source

1. **Build the image**

   ```bash
   docker build -t temporal-flow-web .
   ```

2. **Run the container**

   ```bash
   # Using environment variables
   docker run -p 7531:7531 \
     -e TEMPORAL_API_KEY=your-api-key \
     -e TEMPORAL_ENDPOINT=your-endpoint \
     temporal-flow-server

   # Using .env file
   docker run -p 7531:7531 \
     --env-file .env \
     temporal-flow-server
   ```

## API Documentation

### Get Workflow History

```http
GET /workflow?namespace={namespace}&id={workflowId}&runId={runId}
```

#### Parameters

| Parameter | Type   | Description              |
| --------- | ------ | ------------------------ |
| namespace | string | Your Temporal namespace  |
| id        | string | Target workflow ID       |
| runId     | string | Specific workflow Run ID |

#### Example Request

```bash
curl "http://localhost:7531/workflow?namespace=<your-namespace>&id=<your-workflow-id>&runId=<workflow-run-id>"
```

#### Response

Returns a JSON array of workflow events in Temporal API format.

### Get Workflow Data

```http
GET /workflow/data?namespace={namespace}&id={workflowId}&runId={runId}
```

#### Parameters

| Parameter | Type   | Description              |
| --------- | ------ | ------------------------ |
| namespace | string | Your Temporal namespace  |
| id        | string | Target workflow ID       |
| runId     | string | Specific workflow Run ID |

#### Example Request

```bash
curl "http://localhost:7531/workflow/data?namespace=<your-namespace>&id=<your-workflow-id>&runId=<workflow-run-id>"
```

#### Response

Returns detailed workflow data in JSON format.

### Search Workflows

```http
GET /search?query={searchQuery}&namespace={namespace}
```

#### Parameters

| Parameter | Type   | Description                    |
| --------- | ------ | ------------------------------ |
| query     | string | Search query string (optional) |
| namespace | string | Your Temporal namespace        |

#### Example Request

```bash
curl "http://localhost:7531/search?query=<search-term>&namespace=<your-namespace>"
```

#### Response

Returns a JSON array of matching workflow results.

### Health Check

```http
GET /health
```

#### Example Request

```bash
curl "http://localhost:7531/health"
```

#### Response

```json
{
  "status": "ok"
}
```

### Error Responses

All endpoints may return the following error responses:

| Status Code | Description                                   |
| ----------- | --------------------------------------------- |
| 400         | Missing required query parameters             |
| 404         | Workflow not found                            |
| 500         | Internal server error or Temporal API failure |

### CORS Support

The API supports Cross-Origin Resource Sharing (CORS) for the following origins:

- `http://localhost:5173`
- `https://itaisoudry.github.io`

## Security

- 🔐 Never commit `.env` files to version control
- 🔑 Rotate API keys regularly
- 🛡️ Use environment variables for sensitive data
- 🔒 Implement proper access controls in production

## Troubleshooting

| Issue                           | Solution                                               |
| ------------------------------- | ------------------------------------------------------ |
| "Temporal API Key is required"  | Verify `.env` file contains correct `TEMPORAL_API_KEY` |
| "Temporal Endpoint is required" | Check `TEMPORAL_ENDPOINT` configuration                |
| Connection errors               | Validate API key permissions and endpoint accuracy     |

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License
