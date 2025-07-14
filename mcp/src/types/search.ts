export interface SearchField {
  id: string;
  label: string;
  type: "text" | "datetime" | "status";
}

export interface SearchOperator {
  id:
    | "equals"
    | "notEquals"
    | "startsWith"
    | "isNull"
    | "isNotNull"
    | "between"
    | "greaterThan"
    | "lessThan";
  label: string;
}

export interface SearchToken {
  field: string;
  operator: string;
  value: string | null;
  raw: string;
  isValid: boolean;
}

export interface SearchCondition {
  field: string;
  operator: SearchOperator["id"];
  value: string;
  dateMode?: "exact" | "relative";
  startDate: Date | null;
  endDate: Date | null;
  relativeTime: string | null;
}

export interface Suggestion {
  type: "field" | "operator" | "value";
  text: string;
  display: string;
}

export const SEARCH_FIELDS: SearchField[] = [
  { id: "WorkflowType", label: "WorkflowType", type: "text" },
  { id: "WorkflowId", label: "WorkflowId", type: "text" },
  { id: "RunId", label: "RunId", type: "text" },
  { id: "ExecutionStatus", label: "Status", type: "status" },
  { id: "StartTime", label: "StartTime", type: "datetime" },
  { id: "CloseTime", label: "CloseTime", type: "datetime" },
  { id: "TaskQueue", label: "TaskQueue", type: "text" },
];

export const OPERATORS = [
  {
    id: "equals",
    label: "=",
    alternatives: ["equals", "is"],
    searchOperator: "=",
  },
  {
    id: "notEquals",
    label: "!=",
    alternatives: ["not equals", "is not"],
    searchOperator: "!=",
  },
  {
    id: "starts_with",
    label: "starts with",
    alternatives: ["startswith", "start"],
    searchOperator: "starts_with",
  },
  {
    id: "isNull",
    label: "is null",
    alternatives: ["null"],
    searchOperator: "is null",
  },
  {
    id: "isNotNull",
    label: "is not null",
    alternatives: ["not null"],
    searchOperator: "is not null",
  },
  {
    id: "greaterThan",
    label: ">",
    alternatives: ["after", "greater than"],
    searchOperator: ">",
  },
  {
    id: "lessThan",
    label: "<",
    alternatives: ["before", "less than"],
    searchOperator: "<",
  },
  {
    id: "between",
    label: "between",
    alternatives: [],
    searchOperator: "between",
  },
] as const;

export const STATUS_VALUES = [
  { value: "Completed", color: "text-green-700 bg-green-50" },
  { value: "Running", color: "text-blue-700 bg-blue-50" },
  { value: "TimedOut", color: "text-orange-700 bg-orange-50" },
  { value: "Failed", color: "text-red-700 bg-red-50" },
  { value: "Canceled", color: "text-gray-700 bg-gray-50" },
  { value: "Terminated", color: "text-yellow-700 bg-yellow-50" },
  { value: "Continued as New", color: "text-pink-700 bg-pink-50" },
];

export interface DateOperator {
  id: string;
  label: string;
  alternatives: string[];
}

export const DATE_OPERATORS: DateOperator[] = [
  { id: "equals", label: "=", alternatives: ["==", "is", "="] },
  { id: "between", label: "between", alternatives: ["between"] },
  { id: "greater", label: ">", alternatives: ["gt", ">"] },
  { id: "greaterOrEqual", label: ">=", alternatives: ["gte", ">="] },
  { id: "less", label: "<", alternatives: ["lt", "<"] },
  { id: "lessOrEqual", label: "<=", alternatives: ["lte", "<="] },
];
