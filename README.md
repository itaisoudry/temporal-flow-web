# Temporal Graph UI

**Temporal Graph UI** is a developer tool designed to enhance observability and debugging of workflows within [Temporal](https://temporal.io/). This custom UI presents Temporal workflow executions as an interactive graph, enabling intuitive navigation through nested workflows and a faster, smarter search experience compared to the default Temporal Web UI.

## ✨ Features

- 🔍 **Advanced Search**  
  Quickly locate workflows, activities, and nested executions with an intuitive search bar that supports partial names, workflow types, and more.

- 🧭 **Graph Visualization**  
  Visualize relationships between parent and child workflows as an interactive node graph. This makes it easy to explore deeply nested or complex workflows at a glance.

- 🪄 **Smooth Exploration**  
  Hover and click on graph nodes to inspect workflow details such as execution status, timestamps, and input/output payloads—all without leaving the context of the graph.

- ⚡ **Faster Than the Default UI**  
  Designed with performance and usability in mind to improve speed and developer experience during workflow analysis.

## 📽 Demo

[Watch the demo](./Screen%20Recording%202025-04-11%20at%200.31.33.mov) to see the Temporal Graph UI in action.

## 🚀 How to run?
First, you need to run the local server, see [server README.md](server/README.md).\
This server is used to fetch the Temporal Events of the workflows so the UI can have all the needed data.
The main reason for this server, is that Temporal doesn't have an API I can access from a web application.\
Another reason, is that I don't want to save your Temporal API Key :)

After the server is up and running, go to the [Temporal Flow Page](https://itaisoudry.github.io/temporal-flow-web/) and search search for the workflow you want to view!

There is also a chrome extension (see [chrome-extension README.md](chrome-extension/README.md)) that you can run and load workflows from temporal directly to Temporal Flow.

## 🛠 Issues & Feature Requests

Got feedback, a feature idea, or found a bug?  
Please open an issue right here in the [GitHub Issues](https://github.com/itaisoudry/temporal-flow-web/issues) section of this repository.  
Alternatively, feel free to reach out directly by email.

## 📬 Contact

- **Email**: [itaisoudry@gmail.com](mailto:itaisoudry@gmail.com)  
- **LinkedIn**: [www.linkedin.com/in/itai-soudry-257a01123](https://www.linkedin.com/in/itai-soudry-257a01123)

---

Thank you for checking out this project!\
Feedback are always welcome.
