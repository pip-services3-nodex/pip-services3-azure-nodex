export declare class AzureFunctionContextHelper {
    /**
     * Returns correlationId from Azure Function Event.
     * @param context the event context
     * @return returns correlationId from Event
     */
    static getCorrelationId(context: any): string;
    /**
     * Returns command from Azure Function Event.
     * @param context the event context
     * @return returns command from Event
     */
    static getCommand(context: any): string;
}
