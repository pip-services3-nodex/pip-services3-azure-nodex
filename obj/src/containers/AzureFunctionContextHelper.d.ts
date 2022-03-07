/** @module containers */
import { Parameters } from 'pip-services3-commons-nodex';
export declare class AzureFunctionContextHelper {
    /**
     * Returns correlationId from Azure Function context.
     * @param context the Azure Function context
     * @return returns correlationId from context
     */
    static getCorrelationId(context: any): string;
    /**
     * Returns command from Azure Function context.
     * @param context the Azure Function context
     * @return returns command from context
     */
    static getCommand(context: any): string;
    /**
     * Returns body from Azure Function context http request.
     * @param context the Azure Function context
     * @return returns body from context
     */
    static getParametrs(context: any): Parameters;
}
