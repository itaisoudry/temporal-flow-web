import { WorkflowInstanceId, ActivityInstanceId } from "./domain";

// Define ChronologicalItem type locally
export interface ChronologicalItem {
  id: string;
  timestamp: string;
  type: string;
  [key: string]: any;
}

export type NodeId = string;

export type EdgeData = {
  source_id: NodeId;
  target_id: NodeId;
  type: "child" | "sibling";
};

export interface WorkflowRefNode {
  id: NodeId;
  type: "workflow";
  isExpanded?: boolean;
}

export interface ActivityRefNode {
  id: NodeId;
  type: "activity";
}

export interface BatchRefNode {
  id: NodeId;
  type: "batch";
  referencedBatches: Array<WorkflowInstanceId | ActivityInstanceId>;
  __batchItems?: ChronologicalItem[];
  __batchCount?: number;
}

export interface TimerRefNode {
  id: NodeId;
  type: "timer";
  timerId: string;
  fireTime: string;
}

export interface SignalRefNode {
  id: NodeId;
  type: "signal";
  signalName: string;
  signalId: string;
  sourceWorkflowId?: string;
  targetWorkflowId?: string;
}

export type NodeData =
  | WorkflowRefNode
  | ActivityRefNode
  | BatchRefNode
  | TimerRefNode
  | SignalRefNode;

export interface GroupComponentId {
  type: string;
  id: string;
  workflowRunId: string;
}

// Add this new type for synthetic batch items
export interface SyntheticBatchItem {
  __isBatch: true;
  __batchItems: any[];
  __batchCount: number;
  __originalId: string;
}
