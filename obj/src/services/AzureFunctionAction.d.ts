/** @module services */
import { Schema } from "pip-services3-commons-nodex";
export declare class AzureFunctionAction {
    /**
     * Command to call the action
     */
    cmd: string;
    /**
     * Schema to validate action parameters
     */
    schema: Schema;
    /**
     * Action to be executed
     */
    action: (context: any) => Promise<any>;
}
