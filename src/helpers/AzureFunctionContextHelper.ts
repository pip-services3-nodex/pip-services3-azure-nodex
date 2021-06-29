

export class AzureFunctionContextHelper {
    /**
     * Returns correlationId from Azure Function Event.
     * @param event -  Azure Function Even
     * @return Returns correlationId from Event
     */
    public static getCorrelationId(event: any): string {
        let correlationId: string = event.correlation_id || "";
        try {
            if ((correlationId == null || correlationId == "") && event.hasOwnProperty('req')) {
                correlationId = event.req.body.correlation_id;
                if (correlationId == null || correlationId == "") {
                    correlationId = event.req.query.correlation_id;
                }
            }
        } catch (e) {}
        return correlationId
    }

    /**
     * Returns command from Azure Function Event.
     * @param event -  Azure Function Even
     * @return Returns command from Event
     */
    public static getCommand(event: any): string {
        let cmd: string = event.cmd || "";
        try {
            if ((cmd == null || cmd == "") && event.hasOwnProperty('req')) {
                cmd = event.req.body.cmd;
                if (cmd == null || cmd == "") {
                    cmd = event.req.query.cmd;
                }
            }
        } catch (e) {}
        return cmd
    }
}