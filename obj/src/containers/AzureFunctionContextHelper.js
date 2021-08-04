"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AzureFunctionContextHelper = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
class AzureFunctionContextHelper {
    /**
     * Returns correlationId from Azure Function context.
     * @param context the Azure Function context
     * @return returns correlationId from context
     */
    static getCorrelationId(context) {
        let correlationId = context.correlation_id || "";
        try {
            if ((correlationId == null || correlationId == "") && context.hasOwnProperty('req')) {
                correlationId = context.req.body.correlation_id;
                if (correlationId == null || correlationId == "") {
                    correlationId = context.req.query.correlation_id;
                }
            }
        }
        catch (e) {
            // Ignore the error
        }
        return correlationId;
    }
    /**
     * Returns command from Azure Function context.
     * @param context the Azure Function context
     * @return returns command from context
     */
    static getCommand(context) {
        let cmd = context.cmd || "";
        try {
            if ((cmd == null || cmd == "") && context.hasOwnProperty('req')) {
                cmd = context.req.body.cmd;
                if (cmd == null || cmd == "") {
                    cmd = context.context.query.cmd;
                }
            }
        }
        catch (e) {
            // Ignore the error
        }
        return cmd;
    }
    /**
     * Returns body from Azure Function context http request.
     * @param context the Azure Function context
     * @return returns body from context
     */
    static getParametrs(context) {
        let body = context;
        try {
            if (context.hasOwnProperty('req')) {
                body = context.req.body;
            }
        }
        catch (e) {
            // Ignore the error
        }
        return pip_services3_commons_nodex_1.Parameters.fromValue(body);
    }
}
exports.AzureFunctionContextHelper = AzureFunctionContextHelper;
//# sourceMappingURL=AzureFunctionContextHelper.js.map