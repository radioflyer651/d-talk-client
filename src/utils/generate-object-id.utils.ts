import { ObjectId } from "mongodb";
import { ObjectId as bObjectId } from 'bson';

/** Returns a new ObjectId (string) with MongoDb-compatible values. */
export function generateObjectId(): ObjectId {
    const id = new bObjectId();
    const result = id.toHexString();
    return result;
}