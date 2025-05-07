function addButtonsToWorkflows() {
  const workflowRows = document.querySelectorAll(
    'tr[data-testid="workflows-summary-configurable-table-row"]'
  );

  // Find header row to get column indices for Workflow ID and Run ID
  const headers = document.querySelectorAll("th");
  let workflowIdIndex = -1;
  let runIdIndex = -1;

  headers.forEach((header, index) => {
    const headerText = header.textContent;
    if (headerText === "Workflow ID") {
      workflowIdIndex = index;
    } else if (headerText === "Run ID") {
      runIdIndex = index;
    }
  });

  workflowRows.forEach((row, index) => {
    // Skip if button already exists
    if (row.querySelector(".temporal-custom-button")) return;

    const cells = row.querySelectorAll("td");
    const workflowId = cells[workflowIdIndex]?.textContent?.trim();
    const runId = cells[runIdIndex]?.textContent?.trim();

    if (!workflowId || !runId) return;

    const button = document.createElement("button");
    button.className =
      "temporal-custom-button relative flex w-fit items-center justify-center border gap-1 disabled:opacity-50 disabled:cursor-not-allowed transition-shadow focus-visible:outline-none focus-visible:border-inverse focus-visible:ring-2 whitespace-nowrap no-underline h-8 text-xs px-1.5 py-1";
    button.style.cssText =
      "margin-left: 6px; border-radius: 4px; border: 1px solid rgb(203, 213, 225); background: transparent; cursor: pointer; color: inherit; font-family: inherit; display: inline-flex; align-items: center; min-width: 45px; max-width: 70px; transition: 0.2s; padding: 0px 6px;";

    const namespace = window.location.pathname.split("/")[2];

    button.addEventListener("click", (e) => {
      e.stopPropagation();
      const url = `https://itaisoudry.github.io/temporal-flow-web/?id=${encodeURIComponent(
        workflowId
      )}&namespace=${encodeURIComponent(namespace)}&runID=${encodeURIComponent(
        runId
      )}`;
      window.open(url, "_blank");
    });

    // Add SVG icon
    button.innerHTML = `
        <span class="flex items-center gap-1">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill="currentColor"/>
          </svg>
        </span>
      `;

    // Create a new cell for the button as the third cell
    const buttonCell = document.createElement("td");
    buttonCell.appendChild(button);
    buttonCell.style.textAlign = "center";
    buttonCell.style.verticalAlign = "middle";
    // Insert the new cell as the third cell (index 2)
    row.insertBefore(buttonCell, row.children[2]);
  });
}

// New function to add button to workflow detail page
function addButtonToWorkflowDetail() {
  console.log("Running addButtonToWorkflowDetail");

  // Check if we're on a workflow detail page
  const pathParts = window.location.pathname.split("/");
  if (
    pathParts.length < 5 ||
    pathParts[1] !== "namespaces" ||
    pathParts[3] !== "workflows"
  ) {
    return;
  }

  // Extract namespace, workflow ID, and run ID from URL
  const namespace = pathParts[2];
  const workflowId = pathParts[4];
  const runId = pathParts[5] || ""; // Extract run ID if present (it's after "runs" in the path)

  // Check if button already exists
  if (document.querySelector(".temporal-custom-button")) {
    return;
  }

  // Find the tab list container
  const tabList = document.querySelector('.tab-list[role="tablist"]');
  if (!tabList) {
    console.log("Tab list not found");
    return;
  }

  // Create the same button as in the original function
  const button = document.createElement("button");
  button.className =
    "temporal-custom-button relative flex w-fit items-center justify-center border gap-1 disabled:opacity-50 disabled:cursor-not-allowed transition-shadow focus-visible:outline-none focus-visible:border-inverse focus-visible:ring-2 whitespace-nowrap no-underline h-8 text-xs px-1.5 py-1";

  // Add magnifying glass icon
  button.innerHTML = `
    <span class="flex items-center gap-1">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill="currentColor"/>
      </svg>
    </span>
  `;

  // Apply the same styles
  button.style.cssText =
    "display: inline-flex; align-items: center; vertical-align: middle; height: 24px; line-height: 24px; box-sizing: border-box; border-radius: 4px; border: 1px solid rgb(203, 213, 225); background: transparent; cursor: pointer; color: inherit; font-family: inherit; min-width: 28px; max-width: 40px; transition: 0.2s; font-size: 13px; padding: 0 4px; margin: 0;";

  // Add hover effects
  button.addEventListener("mouseover", () => {
    button.style.backgroundColor = "rgba(226, 232, 240, 0.6)";
  });

  button.addEventListener("mouseout", () => {
    button.style.backgroundColor = "transparent";
  });

  // Add click handler
  button.addEventListener("click", (e) => {
    e.stopPropagation();
    const url = `https://itaisoudry.github.io/temporal-flow-web/?id=${encodeURIComponent(
      workflowId
    )}&namespace=${encodeURIComponent(namespace)}&runID=${encodeURIComponent(
      runId
    )}`;
    window.open(url, "_blank");
  });

  const firstTab = tabList.querySelector('[role="tab"]');
  if (firstTab) {
    tabList.insertBefore(button, firstTab);
  }
}

function initializeObserver() {
  console.log("Initializing observer");
  let waitForContentInterval = null;
  let waitForTabListInterval = null;

  function cleanup() {
    if (waitForContentInterval) clearInterval(waitForContentInterval);
    if (waitForTabListInterval) clearInterval(waitForTabListInterval);
  }

  function initialize() {
    cleanup();

    // Check if we're on a workflow detail page first
    if (window.location.pathname.includes("/workflows/")) {
      waitForTabListInterval = setInterval(() => {
        const tabList = document.querySelector('.tab-list[role="tablist"]');
        if (tabList) {
          clearInterval(waitForTabListInterval);
          addButtonToWorkflowDetail();
        }
      }, 1000);
      return;
    }

    // Original workflow list page logic
    waitForContentInterval = setInterval(() => {
      const workflowRows = document.querySelectorAll(
        'tr[data-testid="workflows-summary-configurable-table-row"]'
      );
      console.log("Checking for workflow rows:", workflowRows.length);

      if (workflowRows.length > 0) {
        clearInterval(waitForContentInterval);
        console.log("Content found, setting up observer");

        // Set up the MutationObserver
        const observer = new MutationObserver((mutations) => {
          for (const mutation of mutations) {
            if (mutation.addedNodes.length) {
              console.log("Mutation detected:", mutation.type);
              addButtonsToWorkflows();
            }
          }
        });

        // Find a stable parent element to observe
        const tableWrapper = document.querySelector(".paginated-table-wrapper");
        if (tableWrapper) {
          observer.observe(tableWrapper, {
            childList: true,
            subtree: true,
          });
          console.log("Observer set up on table wrapper");

          // Initial run
          addButtonsToWorkflows();
        } else {
          console.log("Could not find table wrapper");
        }
      }
    }, 1000);
  }

  // Initialize for the first time
  initialize();

  // Listen for URL changes
  let lastUrl = window.location.href;

  // Create an observer to watch for URL changes
  const urlObserver = new MutationObserver(() => {
    if (lastUrl !== window.location.href) {
      console.log("URL changed, reinitializing");
      lastUrl = window.location.href;
      initialize();
    }
  });

  // Start observing the document for URL changes
  urlObserver.observe(document, { subtree: true, childList: true });
}

// Start the initialization
console.log("Script starting");
initializeObserver();
