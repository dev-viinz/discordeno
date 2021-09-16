// TODO: add docs link
export interface ListPublicArchivedThreads {
  /** Returns threads before this timestamp. UNIX or ISO8601 timestamp */
  before?: number;
  /** Optional maximum number of threads to return */
  limit?: number;
}
