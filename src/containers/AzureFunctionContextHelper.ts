/** @module containers */
import { Parameters } from 'pip-services3-commons-nodex';


export class AzureFunctionContextHelper {
    /**
     * Returns correlationId from Azure Function context.
     * @param context the Azure Function context
     * @return returns correlationId from context
     */
    public static getCorrelationId(context: any): string {
        let correlationId: string = context.correlation_id || "";
        try {
            if ((correlationId == null || correlationId == "") && context.hasOwnProperty('body')) {
                correlationId = context.body.correlation_id;
                if (correlationId == null || correlationId == "") {
                    correlationId = context.query.correlation_id;
                }
            }
        } catch (e) {
            // Ignore the error
        }
        return correlationId
    }

    /**
     * Returns command from Azure Function context.
     * @param context the Azure Function context
     * @return returns command from context
     */
    public static getCommand(context: any): string {
        let cmd: string = context.cmd || "";
        try {
            if ((cmd == null || cmd == "") && context.hasOwnProperty('body')) {
                cmd = context.body.cmd;
                if (cmd == null || cmd == "") {
                    cmd = context.query.cmd;
                }
            }
        } catch (e) {
            // Ignore the error
        }
        return cmd
    }

    /**
     * Returns body from Azure Function context http request.
     * @param context the Azure Function context
     * @return returns body from context
     */
    public static getParameters(context: any): Parameters {
        let body: any = context;
        try {
            if (context.hasOwnProperty('body')) {
                body = context.body;
            }
        } catch (e) {
            // Ignore the error
        }
        return Parameters.fromValue(body)
    }
}