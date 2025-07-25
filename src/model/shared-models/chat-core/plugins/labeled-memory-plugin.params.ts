import { ObjectId } from "mongodb";
import { ModelServiceParams } from "../model-service-params.model";

export interface LabeledMemoryPluginParams {
    /** The name of the MongoDB collection to store memories in.*/
    memoryCollectionName: string;

    /** A sets of memory keys that are appended to the keys
     *   of any memory value.  This prefix makes them easy to identify
     *   as those belonging to this specific plugin memory set. */
    memoryKeyPrefix: string[];

    /** This set must have at least 1 value.  It defines how each
     *   key is identified/understood by the AI.  Think of this as folder structure. */
    keyMeanings: string[];

    /** The ID of the project this plugin belongs to. */
    projectId: ObjectId;

    /** Boolean value indicating whether or not the agent using this
     *   plugin can write new memories to the memory set, or if it's just read-only. */
    canWrite: boolean;

    /** A string indicating the purpose of this memory set.  This should be written in a way
     *   that allows the LLM to know why it might be reading OR writing data to/from this set. */
    memorySetPurpose: string;

    /** The specification for the AI Model to use when performing logic decisions.
     *   NOTE: The AI must be able to call tools for this to work. */
    modelServiceParams: ModelServiceParams;
}

/** Validates a specified LabeledMemoryPluginParams object, and returns a list of
 *   issues, if any are found.  Otherwise, undefined is returned. */
export function validateLabeledMemoryPluginParams(params: LabeledMemoryPluginParams): string[] | undefined {
    const issues: string[] = [];

    if (!params) {
        issues.push("params is not set.");
        return issues;
    }

    // Validate projectId (works for both ObjectId and string)
    const projectId = params.projectId?.toString();
    if (!projectId || !/^[a-fA-F0-9]{24}$/.test(projectId)) {
        issues.push("MongoDbStore project ID not valid.");
    }

    // Validate memoryCollectionName
    const nameIssue = validateMemoryCollectionName(params.memoryCollectionName);
    if (nameIssue) {
        issues.push(nameIssue);
    }

    // Validate memoryKey
    if (!Array.isArray(params.memoryKeyPrefix) || params.memoryKeyPrefix.length < 1) {
        issues.push("memoryKey must be a non-empty array.");
    }

    // Validate canWrite
    if (typeof params.canWrite !== "boolean") {
        issues.push("canWrite must be a boolean value.");
    }

    // Validate memorySetPurpose
    if (typeof params.memorySetPurpose !== "string" || params.memorySetPurpose.trim().length < 10) {
        issues.push("memorySetPurpose must be a string with at least 10 non-whitespace characters.");
    }

    // Return the result.
    return issues.length ? issues : undefined;
}

/** Validates a memory collection name and returns an error message if invalid. */
export function validateMemoryCollectionName(name: string): string | undefined {
    if (!name) {
        return "MongoDbStore collection name is not set or is empty.";
    }

    if (!/[a-z_\-0-9]{3,10}/i.test(name)) {
        return `MongoDbStore collection name ${name} is not valid. ([a-z_\-0-9]{3,10})`;
    }

    return undefined;
}