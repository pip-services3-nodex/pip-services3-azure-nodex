

export class AzureFunctionContextHelper {
    /**
     * Returns correlationId from Azure Function Event.
     * @param context the event context
     * @return returns correlationId from Event
     */
    public static getCorrelationId(context: any): string {
        let correlationId: string = context.correlation_id || "";
        try {
            if ((correlationId == null || correlationId == "") && context.hasOwnProperty('req')) {
                correlationId = context.req.body.correlation_id;
                if (correlationId == null || correlationId == "") {
                    correlationId = context.req.query.correlation_id;
                }
            }
        } catch (e) {
            // Ignore the error
        }
        return correlationId
    }

    /**
     * Returns command from Azure Function Event.
     * @param context the event context
     * @return returns command from Event
     */
    public static getCommand(context: any): string {
        let cmd: string = context.cmd || "";
        try {
            if ((cmd == null || cmd == "") && context.hasOwnProperty('req')) {
                cmd = context.req.body.cmd;
                if (cmd == null || cmd == "") {
                    cmd = context.context.query.cmd;
                }
            }
        } catch (e) {
            // Ignore the error
        }
        return cmd
    }
}