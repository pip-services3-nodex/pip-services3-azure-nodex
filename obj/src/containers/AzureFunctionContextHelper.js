"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AzureFunctionContextHelper = void 0;
/** @module containers */
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
            if ((correlationId == null || correlationId == "") && context.hasOwnProperty('body')) {
                correlationId = context.body.correlation_id;
                if (correlationId == null || correlationId == "") {
                    correlationId = context.query.correlation_id;
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
            if ((cmd == null || cmd == "") && context.hasOwnProperty('body')) {
                cmd = context.body.cmd;
                if (cmd == null || cmd == "") {
                    cmd = context.query.cmd;
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
    static getParameters(context) {
        let body = context;
        try {
            if (context.hasOwnProperty('body')) {
                body = context.body;
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