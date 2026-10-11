export interface Operations {
    "identity.get": {
        input: {};
        output: {
            user: {
                id: string;
                name: string;
            };
            workspace: {
                id: string;
                name: string;
                role: string;
                archived: boolean;
            };
            scope: "vikan:read" | "vikan:write";
        };
    };
    "issues.list": {
        input: {
            query?: {
                limit?: number;
                /**
                 * nextCursor from the previous page, with the same filters. Stable UUID ascending order.
                 */
                cursor?: string;
                /**
                 * Workspace issue number, workspace prefix + number, UUID, or case-insensitive literal title keywords. No body search.
                 */
                query?: string;
                assigneeId?: string | "me" | "unassigned";
                stateId?: string;
                stateType?: "triage" | "backlog" | "unstarted" | "started" | "completed" | "canceled";
                /**
                 * Exact project ID from workspace_metadata kind=projects. Completed and canceled projects remain readable. Omit to remove only the project filter.
                 */
                projectId?: string;
                /**
                 * Exact milestone ID from workspace_metadata kind=milestones for the supplied projectId. Requires projectId and must belong to that project. Omit to search all milestones in the selected project.
                 */
                milestoneId?: string;
                /**
                 * Exact Cycle ID from workspace_metadata kind=cycles, or "unassigned" for issues with no Cycle at all (their cycleId is null). Historical cycles are readable. Omit to remove only the Cycle filter.
                 */
                cycleId?: string | "unassigned";
                /**
                 * Exact available label ID from workspace_metadata kind=labels; same-name labels are distinguished by ID and namespace. Omit to remove only the label filter.
                 */
                labelId?: string;
                /**
                 * Match only issues whose dueDate is strictly earlier than this calendar day (YYYY-MM-DD). Pass an explicit day to express overdue; the server never infers a timezone or your today. Cannot be combined with dueDate "none", and dueFrom must be earlier when both are given.
                 */
                dueBefore?: string;
                /**
                 * Inclusive first calendar day (YYYY-MM-DD) of a due-date range. Set it with dueTo; use the same day for both to list issues due that day.
                 */
                dueFrom?: string;
                /**
                 * Inclusive last calendar day (YYYY-MM-DD) of a due-date range; never earlier than dueFrom.
                 */
                dueTo?: string;
                /**
                 * Pass exactly "none" to match only issues with no due date at all (dueDate null). Cannot be combined with dueBefore, dueFrom or dueTo; omit every date condition to leave due dates unrestricted.
                 */
                dueDate?: "none";
                priority?: number;
                /**
                 * List the children of this issue.
                 */
                parentId?: string;
            };
        };
        output: {
            dataSource: "server-committed";
            readAt: string;
            items: {
                id: string;
                identifier: string;
                webUrl: string;
                teamId: string;
                teamKey: string;
                workspaceId: string;
                title: string;
                stateId: string;
                priority: number;
                assigneeId: string | null;
                dueDate: string | null;
                estimate: number | null;
                parentId: string | null;
                cycleId: string | null;
                projectId: string;
                milestoneId: string | null;
                createdAt: string;
                updatedAt: string;
                archivedAt: string | null;
                deletedAt: string | null;
            }[];
            nextCursor: string | null;
        };
    };
    "issues.get": {
        input: {
            params: {
                /**
                 * Issue number in the granted workspace (123), workspace prefix plus number (VIK-123), or internal issue UUID.
                 */
                reference: string;
            };
        };
        output: {
            dataSource: "server-committed";
            readAt: string;
            issue: {
                id: string;
                identifier: string;
                webUrl: string;
                teamId: string;
                teamKey: string;
                workspaceId: string;
                title: string;
                stateId: string;
                priority: number;
                assigneeId: string | null;
                dueDate: string | null;
                estimate: number | null;
                parentId: string | null;
                cycleId: string | null;
                projectId: string;
                milestoneId: string | null;
                createdAt: string;
                updatedAt: string;
                archivedAt: string | null;
                deletedAt: string | null;
            };
            parent: {
                id: string;
                identifier: string;
                webUrl: string;
                teamId: string;
                teamKey: string;
                workspaceId: string;
                title: string;
                stateId: string;
                priority: number;
                assigneeId: string | null;
                dueDate: string | null;
                estimate: number | null;
                parentId: string | null;
                cycleId: string | null;
                projectId: string;
                milestoneId: string | null;
                createdAt: string;
                updatedAt: string;
                archivedAt: string | null;
                deletedAt: string | null;
            } | null;
            labelIds: string[];
            description: {
                dataSource: "server-committed";
                readAt: string;
                issueId: string;
                version: number;
                updatedAt: string | null;
                format: "text" | "json";
                content: string;
                offset: number;
                totalLength: number;
                complete: boolean;
                nextOffset: number | null;
            };
        };
    };
    "issues.document": {
        input: {
            params: {
                /**
                 * Issue number in the granted workspace (123), workspace prefix plus number (VIK-123), or internal issue UUID.
                 */
                reference: string;
            };
            query?: {
                format?: "text" | "json";
                offset?: number;
                limit?: number;
                /**
                 * Pin the version from the first chunk; a change returns document_changed. Offsets count UTF-16 code units; concatenate chunks before parsing JSON.
                 */
                version?: number;
            };
        };
        output: {
            dataSource: "server-committed";
            readAt: string;
            issueId: string;
            version: number;
            updatedAt: string | null;
            format: "text" | "json";
            content: string;
            offset: number;
            totalLength: number;
            complete: boolean;
            nextOffset: number | null;
        };
    };
    "issues.relations": {
        input: {
            params: {
                /**
                 * Issue number in the granted workspace (123), workspace prefix plus number (VIK-123), or internal issue UUID.
                 */
                reference: string;
            };
            query?: {
                limit?: number;
                /**
                 * nextCursor from the previous page, with the same filters. Stable UUID ascending order.
                 */
                cursor?: string;
            };
        };
        output: {
            dataSource: "server-committed";
            readAt: string;
            items: {
                id: string;
                type: string;
                direction: "outgoing" | "incoming";
                fromIssueId: string;
                toIssueId: string;
                otherIssue: {
                    id: string;
                    identifier: string;
                    webUrl: string;
                    teamId: string;
                    teamKey: string;
                    workspaceId: string;
                    title: string;
                    stateId: string;
                    priority: number;
                    assigneeId: string | null;
                    dueDate: string | null;
                    estimate: number | null;
                    parentId: string | null;
                    cycleId: string | null;
                    projectId: string;
                    milestoneId: string | null;
                    createdAt: string;
                    updatedAt: string;
                    archivedAt: string | null;
                    deletedAt: string | null;
                };
                createdAt: string;
            }[];
            nextCursor: string | null;
        };
    };
    "issues.create": {
        input: {
            body: {
                /**
                 * A new UUID per logical action. Retry the identical action with the SAME UUID if its response is lost; never reuse it for different content.
                 */
                operationId: string;
                title: string;
                /**
                 * Exact state ID from workspace_metadata; names are not accepted.
                 */
                stateId?: string;
                priority?: number;
                assigneeId?: string | null;
                dueDate?: string | null;
                cycleId?: string | null;
                estimate?: number | null;
                /**
                 * Required exact project ID from workspace_metadata kind=projects. Always explicitly choose a project, including for a child task.
                 */
                projectId: string;
                /**
                 * Exact milestone ID belonging to the selected project; null clears the milestone while retaining the project. Omit to retain it unless changing project.
                 */
                milestoneId?: string | null;
                /**
                 * Replace the complete label set; [] clears it. Omit to retain current labels.
                 *
                 * @maxItems 50
                 */
                labelIds?: string[];
                /**
                 * Historical namespace ID. May be omitted only when the workspace has one namespace; ambiguity returns choices.
                 */
                teamId?: string;
                description?: {
                    /**
                     * Only plain text is supported. Markdown syntax is stored literally, without formatting.
                     */
                    format: "text";
                    /**
                     * Empty string clears the saved description. Newlines are retained.
                     */
                    text: string;
                };
            };
        };
        output: {
            operationId: string;
            outcome: "committed";
            committedAt: string;
            replayed: boolean;
            result: {
                issue: {
                    id: string;
                    identifier: string;
                    webUrl: string;
                    teamId: string;
                    teamKey: string;
                    workspaceId: string;
                    title: string;
                    stateId: string;
                    priority: number;
                    assigneeId: string | null;
                    dueDate: string | null;
                    estimate: number | null;
                    parentId: string | null;
                    cycleId: string | null;
                    projectId: string;
                    milestoneId: string | null;
                    createdAt: string;
                    updatedAt: string;
                    archivedAt: string | null;
                    deletedAt: string | null;
                };
                labelIds: string[];
                descriptionVersion: number;
            };
        };
    };
    "issues.update": {
        input: {
            params: {
                /**
                 * Issue number in the granted workspace (123), workspace prefix plus number (VIK-123), or internal issue UUID.
                 */
                reference: string;
            };
            body: {
                /**
                 * A new UUID per logical action. Retry the identical action with the SAME UUID if its response is lost; never reuse it for different content.
                 */
                operationId: string;
                title?: string;
                /**
                 * Exact state ID from workspace_metadata; names are not accepted.
                 */
                stateId?: string;
                priority?: number;
                assigneeId?: string | null;
                dueDate?: string | null;
                cycleId?: string | null;
                estimate?: number | null;
                /**
                 * Exact project ID from workspace_metadata kind=projects. Omit to retain the project; null is forbidden. Changing project clears an omitted milestone.
                 */
                projectId?: string;
                /**
                 * Exact milestone ID belonging to the selected project; null clears the milestone while retaining the project. Omit to retain it unless changing project.
                 */
                milestoneId?: string | null;
                /**
                 * Replace the complete label set; [] clears it. Omit to retain current labels.
                 *
                 * @maxItems 50
                 */
                labelIds?: string[];
                description?: {
                    /**
                     * Only plain text is supported. Markdown syntax is stored literally, without formatting.
                     */
                    format: "text";
                    /**
                     * Empty string clears the saved description. Newlines are retained.
                     */
                    text: string;
                    /**
                     * Version read from get_issue or get_issue_document. A conflict never overwrites saved content.
                     */
                    expectedVersion: number;
                };
            };
        };
        output: {
            operationId: string;
            outcome: "committed";
            committedAt: string;
            replayed: boolean;
            result: {
                issue: {
                    id: string;
                    identifier: string;
                    webUrl: string;
                    teamId: string;
                    teamKey: string;
                    workspaceId: string;
                    title: string;
                    stateId: string;
                    priority: number;
                    assigneeId: string | null;
                    dueDate: string | null;
                    estimate: number | null;
                    parentId: string | null;
                    cycleId: string | null;
                    projectId: string;
                    milestoneId: string | null;
                    createdAt: string;
                    updatedAt: string;
                    archivedAt: string | null;
                    deletedAt: string | null;
                };
                labelIds: string[];
                descriptionVersion: number;
            };
        };
    };
    "issues.createSubissues": {
        input: {
            params: {
                /**
                 * Issue number in the granted workspace (123), workspace prefix plus number (VIK-123), or internal issue UUID.
                 */
                reference: string;
            };
            body: {
                /**
                 * Each child has its own operationId and required explicit projectId; project and milestone are not inherited. Omitted teamId inherits the parent namespace; supply a sibling namespace ID to choose another. Each child commits independently.
                 *
                 * @minItems 1
                 * @maxItems 20
                 */
                items: {
                    /**
                     * A new UUID per logical action. Retry the identical action with the SAME UUID if its response is lost; never reuse it for different content.
                     */
                    operationId: string;
                    title: string;
                    /**
                     * Exact state ID from workspace_metadata; names are not accepted.
                     */
                    stateId?: string;
                    priority?: number;
                    assigneeId?: string | null;
                    dueDate?: string | null;
                    cycleId?: string | null;
                    estimate?: number | null;
                    /**
                     * Required exact project ID from workspace_metadata kind=projects. Always explicitly choose a project, including for a child task.
                     */
                    projectId: string;
                    /**
                     * Exact milestone ID belonging to the selected project; null clears the milestone while retaining the project. Omit to retain it unless changing project.
                     */
                    milestoneId?: string | null;
                    /**
                     * Replace the complete label set; [] clears it. Omit to retain current labels.
                     *
                     * @maxItems 50
                     */
                    labelIds?: string[];
                    /**
                     * Historical namespace ID. May be omitted only when the workspace has one namespace; ambiguity returns choices.
                     */
                    teamId?: string;
                    description?: {
                        /**
                         * Only plain text is supported. Markdown syntax is stored literally, without formatting.
                         */
                        format: "text";
                        /**
                         * Empty string clears the saved description. Newlines are retained.
                         */
                        text: string;
                    };
                }[];
            };
        };
        output: {
            parent: {
                id: string;
                identifier: string;
                webUrl: string;
                teamId: string;
                teamKey: string;
                workspaceId: string;
                title: string;
                stateId: string;
                priority: number;
                assigneeId: string | null;
                dueDate: string | null;
                estimate: number | null;
                parentId: string | null;
                cycleId: string | null;
                projectId: string;
                milestoneId: string | null;
                createdAt: string;
                updatedAt: string;
                archivedAt: string | null;
                deletedAt: string | null;
            };
            outcome: "committed" | "partial" | "rejected" | "unconfirmed";
            items: {
                index: number;
                title: string;
                receipt: {
                    operationId: string;
                    outcome: "committed";
                    committedAt: string;
                    replayed: boolean;
                    result: {
                        issue: {
                            id: string;
                            identifier: string;
                            webUrl: string;
                            teamId: string;
                            teamKey: string;
                            workspaceId: string;
                            title: string;
                            stateId: string;
                            priority: number;
                            assigneeId: string | null;
                            dueDate: string | null;
                            estimate: number | null;
                            parentId: string | null;
                            cycleId: string | null;
                            projectId: string;
                            milestoneId: string | null;
                            createdAt: string;
                            updatedAt: string;
                            archivedAt: string | null;
                            deletedAt: string | null;
                        };
                        labelIds: string[];
                        descriptionVersion: number;
                    };
                } | {
                    operationId: string;
                    outcome: "rejected" | "unconfirmed";
                    code: string;
                    retriable: boolean;
                    guidance: string;
                    details?: unknown;
                    originalInput?: unknown;
                } | {
                    operationId: string;
                    outcome: "not_started";
                    guidance: string;
                    originalInput: unknown;
                };
            }[];
        };
    };
    "issues.setParent": {
        input: {
            params: {
                /**
                 * Issue number in the granted workspace (123), workspace prefix plus number (VIK-123), or internal issue UUID.
                 */
                reference: string;
            };
            body: {
                /**
                 * A new UUID per logical action. Retry the identical action with the SAME UUID if its response is lost; never reuse it for different content.
                 */
                operationId: string;
                /**
                 * Parent workspace issue number, workspace prefix + number, or UUID; null to detach. Existing issue identities and numbers are preserved.
                 */
                parentReference: string | null;
            };
        };
        output: {
            operationId: string;
            outcome: "committed";
            committedAt: string;
            replayed: boolean;
            result: {
                issue: {
                    id: string;
                    identifier: string;
                    webUrl: string;
                    teamId: string;
                    teamKey: string;
                    workspaceId: string;
                    title: string;
                    stateId: string;
                    priority: number;
                    assigneeId: string | null;
                    dueDate: string | null;
                    estimate: number | null;
                    parentId: string | null;
                    cycleId: string | null;
                    projectId: string;
                    milestoneId: string | null;
                    createdAt: string;
                    updatedAt: string;
                    archivedAt: string | null;
                    deletedAt: string | null;
                };
                parent: {
                    id: string;
                    identifier: string;
                    webUrl: string;
                    teamId: string;
                    teamKey: string;
                    workspaceId: string;
                    title: string;
                    stateId: string;
                    priority: number;
                    assigneeId: string | null;
                    dueDate: string | null;
                    estimate: number | null;
                    parentId: string | null;
                    cycleId: string | null;
                    projectId: string;
                    milestoneId: string | null;
                    createdAt: string;
                    updatedAt: string;
                    archivedAt: string | null;
                    deletedAt: string | null;
                } | null;
            };
        };
    };
    "issues.setBlocking": {
        input: {
            params: {
                /**
                 * Issue number in the granted workspace (123), workspace prefix plus number (VIK-123), or internal issue UUID.
                 */
                reference: string;
            };
            body: {
                /**
                 * A new UUID per logical action. Retry the identical action with the SAME UUID if its response is lost; never reuse it for different content.
                 */
                operationId: string;
                /**
                 * The task blocked BY params.reference. Never reverse this direction.
                 */
                blockedReference: string;
                /**
                 * true explicitly adds the hard dependency; false removes that directed blocks edge.
                 */
                enabled: boolean;
            };
        };
        output: {
            operationId: string;
            outcome: "committed";
            committedAt: string;
            replayed: boolean;
            result: {
                blocker: {
                    id: string;
                    identifier: string;
                    webUrl: string;
                    teamId: string;
                    teamKey: string;
                    workspaceId: string;
                    title: string;
                    stateId: string;
                    priority: number;
                    assigneeId: string | null;
                    dueDate: string | null;
                    estimate: number | null;
                    parentId: string | null;
                    cycleId: string | null;
                    projectId: string;
                    milestoneId: string | null;
                    createdAt: string;
                    updatedAt: string;
                    archivedAt: string | null;
                    deletedAt: string | null;
                };
                blocked: {
                    id: string;
                    identifier: string;
                    webUrl: string;
                    teamId: string;
                    teamKey: string;
                    workspaceId: string;
                    title: string;
                    stateId: string;
                    priority: number;
                    assigneeId: string | null;
                    dueDate: string | null;
                    estimate: number | null;
                    parentId: string | null;
                    cycleId: string | null;
                    projectId: string;
                    milestoneId: string | null;
                    createdAt: string;
                    updatedAt: string;
                    archivedAt: string | null;
                    deletedAt: string | null;
                };
                relation: {
                    id: string;
                    type: "blocks";
                    fromIssueId: string;
                    toIssueId: string;
                    createdAt: string;
                } | null;
            };
        };
    };
    "issues.delete": {
        input: {
            params: {
                /**
                 * Issue number in the granted workspace (123), workspace prefix plus number (VIK-123), or internal issue UUID.
                 */
                reference: string;
            };
            body: {
                /**
                 * A new UUID per logical action. Retry the identical action with the SAME UUID if its response is lost; never reuse it for different content.
                 */
                operationId: string;
            };
        };
        output: {
            operationId: string;
            outcome: "committed";
            committedAt: string;
            replayed: boolean;
            result: {
                action: "deleted" | "restored";
                issue: {
                    id: string;
                    identifier: string;
                    webUrl: string;
                    teamId: string;
                    teamKey: string;
                    workspaceId: string;
                    title: string;
                    stateId: string;
                    priority: number;
                    assigneeId: string | null;
                    dueDate: string | null;
                    estimate: number | null;
                    parentId: string | null;
                    cycleId: string | null;
                    projectId: string;
                    milestoneId: string | null;
                    createdAt: string;
                    updatedAt: string;
                    archivedAt: string | null;
                    deletedAt: string | null;
                };
                fieldChanges: {
                    field: "stateId" | "assigneeId" | "parentId";
                    from: string | null;
                    to: string | null;
                }[];
                childChanges: {
                    count: number;
                    /**
                     * @maxItems 50
                     */
                    issueIds: string[];
                    truncated: boolean;
                };
                restore: {
                    tool: "vikan_restore_issue";
                    reference: string;
                } | null;
            };
        };
    };
    "issues.restore": {
        input: {
            params: {
                /**
                 * Issue number in the granted workspace (123), workspace prefix plus number (VIK-123), or internal issue UUID.
                 */
                reference: string;
            };
            body: {
                /**
                 * A new UUID per logical action. Retry the identical action with the SAME UUID if its response is lost; never reuse it for different content.
                 */
                operationId: string;
            };
        };
        output: {
            operationId: string;
            outcome: "committed";
            committedAt: string;
            replayed: boolean;
            result: {
                action: "deleted" | "restored";
                issue: {
                    id: string;
                    identifier: string;
                    webUrl: string;
                    teamId: string;
                    teamKey: string;
                    workspaceId: string;
                    title: string;
                    stateId: string;
                    priority: number;
                    assigneeId: string | null;
                    dueDate: string | null;
                    estimate: number | null;
                    parentId: string | null;
                    cycleId: string | null;
                    projectId: string;
                    milestoneId: string | null;
                    createdAt: string;
                    updatedAt: string;
                    archivedAt: string | null;
                    deletedAt: string | null;
                };
                fieldChanges: {
                    field: "stateId" | "assigneeId" | "parentId";
                    from: string | null;
                    to: string | null;
                }[];
                childChanges: {
                    count: number;
                    /**
                     * @maxItems 50
                     */
                    issueIds: string[];
                    truncated: boolean;
                };
                restore: {
                    tool: "vikan_restore_issue";
                    reference: string;
                } | null;
            };
        };
    };
    "trash.list": {
        input: {
            query?: {
                /**
                 * Workspace issue number, workspace prefix + number, UUID, or case-insensitive literal title keywords. No body search.
                 */
                query?: string;
                /**
                 * nextCursor from the previous page, with the same filters. Stable UUID ascending order.
                 */
                cursor?: string;
                limit?: number;
            };
        };
        output: {
            dataSource: "server-committed";
            readAt: string;
            items: {
                id: string;
                identifier: string;
                webUrl: string;
                teamId: string;
                teamKey: string;
                workspaceId: string;
                title: string;
                stateId: string;
                priority: number;
                assigneeId: string | null;
                dueDate: string | null;
                estimate: number | null;
                parentId: string | null;
                cycleId: string | null;
                projectId: string;
                milestoneId: string | null;
                createdAt: string;
                updatedAt: string;
                archivedAt: string | null;
                deletedAt: string | null;
            }[];
            nextCursor: string | null;
            emptyReason: ("empty_trash" | "no_matches" | "end_of_results") | null;
        };
    };
    "comments.list": {
        input: {
            params: {
                /**
                 * Issue number in the granted workspace (123), workspace prefix plus number (VIK-123), or internal issue UUID.
                 */
                reference: string;
            };
            query?: {
                limit?: number;
                /**
                 * nextCursor from the previous page, with the same filters. Stable UUID ascending order.
                 */
                cursor?: string;
            };
        };
        output: {
            dataSource: "server-committed";
            readAt: string;
            items: {
                id: string;
                issueId: string;
                authorId: string;
                authorName: string;
                body: string;
                parentCommentId: string | null;
                createdAt: string;
                updatedAt: string;
            }[];
            nextCursor: string | null;
        };
    };
    "comments.create": {
        input: {
            params: {
                /**
                 * Issue number in the granted workspace (123), workspace prefix plus number (VIK-123), or internal issue UUID.
                 */
                reference: string;
            };
            body: {
                /**
                 * A new UUID per logical action. Retry the identical action with the SAME UUID if its response is lost; never reuse it for different content.
                 */
                operationId: string;
                /**
                 * Saved Markdown text, up to 10,000 characters. Mention accessible members with @[UUID] using IDs from workspace metadata.
                 */
                body: string;
                /**
                 * Optional exact ID of a live original comment on this task, obtained from vikan_list_issue_comments. Replies are one level only; a reply cannot be the parent. Omit to post an ordinary comment.
                 */
                parentCommentId?: string;
            };
        };
        output: {
            operationId: string;
            outcome: "committed";
            committedAt: string;
            replayed: boolean;
            result: {
                issue: {
                    id: string;
                    identifier: string;
                    webUrl: string;
                };
                comment: {
                    id: string;
                    issueId: string;
                    authorId: string;
                    authorName: string;
                    body: string;
                    parentCommentId: string | null;
                    createdAt: string;
                    updatedAt: string;
                };
            };
        };
    };
    "comments.update": {
        input: {
            params: {
                /**
                 * Issue number in the granted workspace (123), workspace prefix plus number (VIK-123), or internal issue UUID.
                 */
                reference: string;
                commentId: string;
            };
            body: {
                /**
                 * A new UUID per logical action. Retry the identical action with the SAME UUID if its response is lost; never reuse it for different content.
                 */
                operationId: string;
                /**
                 * Saved Markdown text, up to 10,000 characters. Mention accessible members with @[UUID] using IDs from workspace metadata.
                 */
                body: string;
            };
        };
        output: {
            operationId: string;
            outcome: "committed";
            committedAt: string;
            replayed: boolean;
            result: {
                issue: {
                    id: string;
                    identifier: string;
                    webUrl: string;
                };
                comment: {
                    id: string;
                    issueId: string;
                    authorId: string;
                    authorName: string;
                    body: string;
                    parentCommentId: string | null;
                    createdAt: string;
                    updatedAt: string;
                };
            };
        };
    };
    "metadata.list": {
        input: {
            query: {
                limit?: number;
                /**
                 * nextCursor from the previous page, with the same filters. Stable UUID ascending order.
                 */
                cursor?: string;
                kind: "states" | "members" | "labels" | "cycles" | "projects" | "milestones";
                query?: string;
                /**
                 * Required for milestones: exact parent project ID from projects metadata. Not used for other kinds.
                 */
                projectId?: string;
            };
        };
        output: {
            dataSource: "server-committed";
            readAt: string;
            items: {
                id: string;
                name: string;
                kind: "states" | "members" | "labels" | "cycles" | "projects" | "milestones";
                workspaceId: string;
                teamId: string | null;
                teamKey: string | null;
                projectId: string | null;
                stateType: string | null;
                email: string | null;
                role: string | null;
                color: string | null;
                startsAt: string | null;
                endsAt: string | null;
                updatedAt: string | null;
            }[];
            nextCursor: string | null;
        };
    };
    "files.upload": {
        input: {
            body: {
                /**
                 * A new UUID per logical action. Retry the identical action with the SAME UUID if its response is lost; never reuse it for different content.
                 */
                operationId: string;
                /**
                 * Use null to stage for a later body save; otherwise the exact issue or project document UUID.
                 */
                owner: {
                    type: "issue" | "project_document";
                    externalId: string;
                } | null;
                filename: string;
                /**
                 * Declared MIME only; the server verifies image bytes before allowing inline display.
                 */
                mimeType?: string;
                base64: string;
            };
        };
        output: {
            operationId: string;
            replayed: boolean;
            file: {
                fileId: string;
                workspaceId: string;
                uploaderId: string;
                owner: {
                    type: "issue" | "project_document";
                    externalId: string;
                } | null;
                filename: string;
                mimeType: string;
                previewKind: ("image" | "video") | null;
                byteSize: number;
                status: "ready";
                createdAt: string;
                updatedAt: string;
                readyAt: string;
            };
        };
    };
    "files.list": {
        input: {
            query: {
                type: "issue" | "project_document";
                externalId: string;
                limit?: number;
                /**
                 * Last fileId from the previous page with the same owner; ascending UUID order.
                 */
                cursor?: string;
            };
        };
        output: {
            /**
             * @maxItems 50
             */
            files: {
                fileId: string;
                workspaceId: string;
                uploaderId: string;
                owner: {
                    type: "issue" | "project_document";
                    externalId: string;
                } | null;
                filename: string;
                mimeType: string;
                previewKind: ("image" | "video") | null;
                byteSize: number;
                status: "ready";
                createdAt: string;
                updatedAt: string;
                readyAt: string;
            }[];
            nextCursor: string | null;
        };
    };
    "files.get": {
        input: {
            params: {
                fileId: string;
            };
            query?: {
                disposition?: "inline" | "attachment";
            };
        };
        output: {
            file: {
                fileId: string;
                workspaceId: string;
                uploaderId: string;
                owner: {
                    type: "issue" | "project_document";
                    externalId: string;
                } | null;
                filename: string;
                mimeType: string;
                previewKind: ("image" | "video") | null;
                byteSize: number;
                status: "ready";
                createdAt: string;
                updatedAt: string;
                readyAt: string;
            };
            content: {
                fileId: string;
                url: string;
                expiresAt: string;
                disposition: "inline" | "attachment";
            };
        };
    };
    "files.attach": {
        input: {
            body: {
                fileId: string;
                display?: "auto" | "attachment";
                alt?: string | null;
                /**
                 * A new UUID per logical action. Retry the identical action with the SAME UUID if its response is lost; never reuse it for different content.
                 */
                operationId: string;
                owner: {
                    type: "issue" | "project_document";
                    externalId: string;
                };
                /**
                 * Current saved body version. A conflict never claims the file or changes the body.
                 */
                expectedVersion: number;
            };
        };
        output: {
            operationId: string;
            outcome: "committed";
            committedAt: string;
            replayed: boolean;
            result: {
                owner: {
                    type: "issue" | "project_document";
                    externalId: string;
                };
                fileId: string;
                version: number;
            };
        };
    };
    "stages.get": {
        input: {
            params: {
                /**
                 * Issue number in the granted workspace (123), workspace prefix plus number (VIK-123), or internal issue UUID.
                 */
                reference: string;
            };
        };
        output: {
            protocolVersion: 1;
            userId: string;
            workspaceId: string;
            issueId: string;
            latestRun: {
                runId: string;
                workspaceId: string;
                projectId: string;
                issueId: string;
                status: "queued" | "starting" | "running" | "awaiting_review" | "blocked" | "stopping" | "needs_reconciliation" | "succeeded" | "cancelled" | "failed";
                createdAt: string;
                startedAt: string | null;
                endedAt: string | null;
            } | null;
            stages: {
                /**
                 * Artifact stage, for example plan, design, validation or review. No configuration is required.
                 */
                stage: string;
                latest: {
                    stageId: string;
                    workspaceId: string;
                    issueId: string;
                    /**
                     * Artifact stage, for example plan, design, validation or review. No configuration is required.
                     */
                    stage: string;
                    revision: number;
                    basedOn: {
                        stageId: string;
                        /**
                         * Artifact stage, for example plan, design, validation or review. No configuration is required.
                         */
                        stage: string;
                        revision: number;
                    } | null;
                    source: {
                        author: {
                            userId: string;
                            name: string;
                        };
                        /**
                         * Explicit null for external submissions without a vikan run; never invent a run number.
                         */
                        run: {
                            runId: string;
                            workspaceId: string;
                            projectId: string;
                            issueId: string;
                            status: "queued" | "starting" | "running" | "awaiting_review" | "blocked" | "stopping" | "needs_reconciliation" | "succeeded" | "cancelled" | "failed";
                            createdAt: string;
                            startedAt: string | null;
                            endedAt: string | null;
                        } | null;
                    };
                    title: string;
                    summary: string;
                    status: "running" | "completed" | "failed";
                    version: number;
                    failureReason: string | null;
                    checkSummary: {
                        total: number;
                        pending: number;
                        running: number;
                        passed: number;
                        failed: number;
                        skipped: number;
                        outcome: "not_submitted" | "pending" | "passed" | "failed" | "incomplete";
                    };
                    fileCounts: {
                        total: number;
                        images: number;
                        videos: number;
                        attachments: number;
                    };
                    /**
                     * @maxItems 3
                     */
                    previewFiles: {
                        fileId: string;
                        posterFileId: string | null;
                        caption: string;
                        /**
                         * @maxItems 50
                         */
                        checkIds: string[];
                        position: number;
                        previewKind: ("image" | "video") | null;
                    }[];
                    startedAt: string;
                    updatedAt: string;
                    completedAt: string | null;
                };
                currentRun: {
                    stageId: string;
                    workspaceId: string;
                    issueId: string;
                    /**
                     * Artifact stage, for example plan, design, validation or review. No configuration is required.
                     */
                    stage: string;
                    revision: number;
                    basedOn: {
                        stageId: string;
                        /**
                         * Artifact stage, for example plan, design, validation or review. No configuration is required.
                         */
                        stage: string;
                        revision: number;
                    } | null;
                    source: {
                        author: {
                            userId: string;
                            name: string;
                        };
                        /**
                         * Explicit null for external submissions without a vikan run; never invent a run number.
                         */
                        run: {
                            runId: string;
                            workspaceId: string;
                            projectId: string;
                            issueId: string;
                            status: "queued" | "starting" | "running" | "awaiting_review" | "blocked" | "stopping" | "needs_reconciliation" | "succeeded" | "cancelled" | "failed";
                            createdAt: string;
                            startedAt: string | null;
                            endedAt: string | null;
                        } | null;
                    };
                    title: string;
                    summary: string;
                    status: "running" | "completed" | "failed";
                    version: number;
                    failureReason: string | null;
                    checkSummary: {
                        total: number;
                        pending: number;
                        running: number;
                        passed: number;
                        failed: number;
                        skipped: number;
                        outcome: "not_submitted" | "pending" | "passed" | "failed" | "incomplete";
                    };
                    fileCounts: {
                        total: number;
                        images: number;
                        videos: number;
                        attachments: number;
                    };
                    /**
                     * @maxItems 3
                     */
                    previewFiles: {
                        fileId: string;
                        posterFileId: string | null;
                        caption: string;
                        /**
                         * @maxItems 50
                         */
                        checkIds: string[];
                        position: number;
                        previewKind: ("image" | "video") | null;
                    }[];
                    startedAt: string;
                    updatedAt: string;
                    completedAt: string | null;
                } | null;
            }[];
        };
    };
    "stages.versions": {
        input: {
            params: {
                /**
                 * Issue number in the granted workspace (123), workspace prefix plus number (VIK-123), or internal issue UUID.
                 */
                reference: string;
                /**
                 * Artifact stage, for example plan, design, validation or review. No configuration is required.
                 */
                stage: string;
            };
            query?: {
                limit?: number;
                /**
                 * Exclusive server-assigned revision from nextBefore, descending within this issue and stage.
                 */
                before?: number;
            };
        };
        output: {
            protocolVersion: 1;
            userId: string;
            workspaceId: string;
            issueId: string;
            /**
             * Artifact stage, for example plan, design, validation or review. No configuration is required.
             */
            stage: string;
            /**
             * @maxItems 50
             */
            versions: {
                stageId: string;
                workspaceId: string;
                issueId: string;
                /**
                 * Artifact stage, for example plan, design, validation or review. No configuration is required.
                 */
                stage: string;
                revision: number;
                basedOn: {
                    stageId: string;
                    /**
                     * Artifact stage, for example plan, design, validation or review. No configuration is required.
                     */
                    stage: string;
                    revision: number;
                } | null;
                source: {
                    author: {
                        userId: string;
                        name: string;
                    };
                    /**
                     * Explicit null for external submissions without a vikan run; never invent a run number.
                     */
                    run: {
                        runId: string;
                        workspaceId: string;
                        projectId: string;
                        issueId: string;
                        status: "queued" | "starting" | "running" | "awaiting_review" | "blocked" | "stopping" | "needs_reconciliation" | "succeeded" | "cancelled" | "failed";
                        createdAt: string;
                        startedAt: string | null;
                        endedAt: string | null;
                    } | null;
                };
                title: string;
                summary: string;
                status: "running" | "completed" | "failed";
                version: number;
                failureReason: string | null;
                checkSummary: {
                    total: number;
                    pending: number;
                    running: number;
                    passed: number;
                    failed: number;
                    skipped: number;
                    outcome: "not_submitted" | "pending" | "passed" | "failed" | "incomplete";
                };
                fileCounts: {
                    total: number;
                    images: number;
                    videos: number;
                    attachments: number;
                };
                /**
                 * @maxItems 3
                 */
                previewFiles: {
                    fileId: string;
                    posterFileId: string | null;
                    caption: string;
                    /**
                     * @maxItems 50
                     */
                    checkIds: string[];
                    position: number;
                    previewKind: ("image" | "video") | null;
                }[];
                startedAt: string;
                updatedAt: string;
                completedAt: string | null;
            }[];
            nextBefore: number | null;
        };
    };
    "stages.getVersion": {
        input: {
            params: {
                /**
                 * Issue number in the granted workspace (123), workspace prefix plus number (VIK-123), or internal issue UUID.
                 */
                reference: string;
                /**
                 * Artifact stage, for example plan, design, validation or review. No configuration is required.
                 */
                stage: string;
                stageId: string;
            };
        };
        output: {
            protocolVersion: 1;
            userId: string;
            workspaceId: string;
            issueId: string;
            stage: {
                stageId: string;
                workspaceId: string;
                issueId: string;
                /**
                 * Artifact stage, for example plan, design, validation or review. No configuration is required.
                 */
                stage: string;
                revision: number;
                basedOn: {
                    stageId: string;
                    /**
                     * Artifact stage, for example plan, design, validation or review. No configuration is required.
                     */
                    stage: string;
                    revision: number;
                } | null;
                source: {
                    author: {
                        userId: string;
                        name: string;
                    };
                    /**
                     * Explicit null for external submissions without a vikan run; never invent a run number.
                     */
                    run: {
                        runId: string;
                        workspaceId: string;
                        projectId: string;
                        issueId: string;
                        status: "queued" | "starting" | "running" | "awaiting_review" | "blocked" | "stopping" | "needs_reconciliation" | "succeeded" | "cancelled" | "failed";
                        createdAt: string;
                        startedAt: string | null;
                        endedAt: string | null;
                    } | null;
                };
                title: string;
                summary: string;
                status: "running" | "completed" | "failed";
                version: number;
                failureReason: string | null;
                checkSummary: {
                    total: number;
                    pending: number;
                    running: number;
                    passed: number;
                    failed: number;
                    skipped: number;
                    outcome: "not_submitted" | "pending" | "passed" | "failed" | "incomplete";
                };
                fileCounts: {
                    total: number;
                    images: number;
                    videos: number;
                    attachments: number;
                };
                /**
                 * @maxItems 3
                 */
                previewFiles: {
                    fileId: string;
                    posterFileId: string | null;
                    caption: string;
                    /**
                     * @maxItems 50
                     */
                    checkIds: string[];
                    position: number;
                    previewKind: ("image" | "video") | null;
                }[];
                startedAt: string;
                updatedAt: string;
                completedAt: string | null;
                content: unknown;
                /**
                 * @maxItems 50
                 */
                checks: {
                    id: string;
                    title: string;
                    status: "pending" | "running" | "passed" | "failed" | "skipped";
                    command: string | null;
                    detail: string | null;
                }[];
                /**
                 * @maxItems 50
                 */
                files: {
                    fileId: string;
                    posterFileId: string | null;
                    caption: string;
                    /**
                     * @maxItems 50
                     */
                    checkIds: string[];
                    position: number;
                    previewKind: ("image" | "video") | null;
                }[];
            };
        };
    };
    "stages.publish": {
        input: {
            params: {
                /**
                 * Issue number in the granted workspace (123), workspace prefix plus number (VIK-123), or internal issue UUID.
                 */
                reference: string;
            };
            body: {
                /**
                 * One UUID per logical action. Persist it and the exact input; retry unchanged after a lost response. Changed input requires a new UUID.
                 */
                operationId: string;
                /**
                 * Artifact stage, for example plan, design, validation or review. No configuration is required.
                 */
                stage: string;
                /**
                 * Latest version of this stage, or explicit null for its first publication.
                 */
                expectedLatestStageId: string | null;
                /**
                 * Optional explicit reference to a plan, design or other stage version in this issue.
                 */
                basedOnStageId?: string | null;
                title: string;
                summary: string;
                document: {
                    format: "json";
                    content: unknown;
                } | {
                    format: "text";
                    /**
                     * Plain text, including literal Markdown syntax. Newlines become paragraphs.
                     */
                    text: string;
                };
                status?: "running" | "completed";
                /**
                 * @maxItems 50
                 */
                checks?: {
                    id: string;
                    title: string;
                    status: "pending" | "running" | "passed" | "failed" | "skipped";
                    command: string | null;
                    detail: string | null;
                }[];
                /**
                 * @maxItems 50
                 */
                files?: {
                    fileId: string;
                    posterFileId: string | null;
                    caption: string;
                    /**
                     * @maxItems 50
                     */
                    checkIds: string[];
                }[];
                sourceRunId: string | null;
            };
        };
        output: {
            operationId: string;
            outcome: "committed";
            committedAt: string;
            replayed: boolean;
            result: {
                stageId: string;
                /**
                 * Artifact stage, for example plan, design, validation or review. No configuration is required.
                 */
                stage: string;
                revision: number;
                workspaceId: string;
                issueId: string;
                version: 1;
                status: "running" | "completed";
            };
        };
    };
    "stages.finish": {
        input: {
            params: {
                /**
                 * Issue number in the granted workspace (123), workspace prefix plus number (VIK-123), or internal issue UUID.
                 */
                reference: string;
                stageId: string;
            };
            body: {
                /**
                 * One UUID per logical action. Persist it and the exact input; retry unchanged after a lost response. Changed input requires a new UUID.
                 */
                operationId: string;
                expectedVersion: number;
                status: "completed" | "failed";
                summary: string;
                document: {
                    format: "json";
                    content: unknown;
                } | {
                    format: "text";
                    /**
                     * Plain text, including literal Markdown syntax. Newlines become paragraphs.
                     */
                    text: string;
                };
                /**
                 * @maxItems 50
                 */
                checks: {
                    id: string;
                    title: string;
                    status: "pending" | "running" | "passed" | "failed" | "skipped";
                    command: string | null;
                    detail: string | null;
                }[];
                /**
                 * @maxItems 50
                 */
                files: {
                    fileId: string;
                    posterFileId: string | null;
                    caption: string;
                    /**
                     * @maxItems 50
                     */
                    checkIds: string[];
                }[];
                failureReason: string | null;
            };
        };
        output: {
            operationId: string;
            outcome: "committed";
            committedAt: string;
            replayed: boolean;
            result: {
                stageId: string;
                /**
                 * Artifact stage, for example plan, design, validation or review. No configuration is required.
                 */
                stage: string;
                revision: number;
                workspaceId: string;
                issueId: string;
                version: 2;
                status: "completed" | "failed";
            };
        };
    };
    "webhooks.list": {
        input: {};
        output: {
            items: {
                /**
                 * Client-generated subscription UUID. Reuse it with identical input after a lost response.
                 */
                id: string;
                projectId: string;
                url: string;
                /**
                 * @minItems 1
                 * @maxItems 6
                 */
                events: ("issue.created" | "issue.updated" | "issue.deleted" | "comment.created" | "comment.updated" | "comment.deleted")[];
                workspaceId: string;
                enabled: boolean;
                createdAt: string;
            }[];
        };
    };
    "webhooks.create": {
        input: {
            body: {
                /**
                 * Client-generated subscription UUID. Reuse it with identical input after a lost response.
                 */
                id: string;
                projectId: string;
                url: string;
                /**
                 * @minItems 1
                 * @maxItems 6
                 */
                events: ("issue.created" | "issue.updated" | "issue.deleted" | "comment.created" | "comment.updated" | "comment.deleted")[];
            };
        };
        output: {
            /**
             * Client-generated subscription UUID. Reuse it with identical input after a lost response.
             */
            id: string;
            projectId: string;
            url: string;
            /**
             * @minItems 1
             * @maxItems 6
             */
            events: ("issue.created" | "issue.updated" | "issue.deleted" | "comment.created" | "comment.updated" | "comment.deleted")[];
            workspaceId: string;
            enabled: boolean;
            createdAt: string;
            secret: string;
        };
    };
    "webhooks.disable": {
        input: {
            params: {
                webhookId: string;
            };
            body?: {};
        };
        output: {
            disabled: true;
        };
    };
    "webhooks.deliveries": {
        input: {
            params: {
                webhookId: string;
            };
            query?: {
                cursor?: string;
                limit?: number;
            };
        };
        output: {
            items: {
                id: string;
                eventId: string;
                type: "issue.created" | "issue.updated" | "issue.deleted" | "comment.created" | "comment.updated" | "comment.deleted";
                status: "pending" | "sending" | "delivered" | "failed" | "cancelled";
                attempts: number;
                httpStatus: number | null;
                lastError: string | null;
                createdAt: string;
                nextAttemptAt: string;
                deliveredAt: string | null;
            }[];
            nextCursor: string | null;
        };
    };
    "events.createSubscription": {
        input: {
            body: {
                projectId: string;
            };
        };
        output: {
            id: string;
            projectId: string;
            workspaceId: string;
            basin: string;
            stream: string;
            token: string;
            tokenExpiresAt: string;
            nextSeqNum: string;
            retentionSeconds: 604800;
        };
    };
}
export interface WebhookEvent {
    id: string;
    version: 1;
    type: "issue.created" | "issue.updated" | "issue.deleted" | "comment.created" | "comment.updated" | "comment.deleted";
    createdAt: string;
    workspaceId: string;
    data: {
        issueId: string;
        projectId: string;
        commentId?: string;
    };
}
export interface ApiProblem {
    type: string;
    status: number;
    title: string;
    detail?: unknown;
    instance: string;
    errors?: {
        path: string;
        message: string;
    }[];
}
export type ApiOperation = "identity.get" | "issues.list" | "issues.get" | "issues.document" | "issues.relations" | "issues.create" | "issues.update" | "issues.createSubissues" | "issues.setParent" | "issues.setBlocking" | "issues.delete" | "issues.restore" | "trash.list" | "comments.list" | "comments.create" | "comments.update" | "metadata.list" | "files.upload" | "files.list" | "files.get" | "files.attach" | "stages.get" | "stages.versions" | "stages.getVersion" | "stages.publish" | "stages.finish" | "webhooks.list" | "webhooks.create" | "webhooks.disable" | "webhooks.deliveries" | "events.createSubscription";
