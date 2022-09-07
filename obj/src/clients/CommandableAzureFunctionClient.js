"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandableAzureFunctionClient = void 0;
/** @module clients */
const AzureFunctionClient_1 = require("./AzureFunctionClient");
/**
 * Abstract client that calls commandable Azure Functions.
 *
 * Commandable services are generated automatically for [[https://pip-services3-nodex.github.io/pip-services3-commons-nodex/interfaces/commands.icommandable.html ICommandable objects]].
 * Each command is exposed as action determined by "cmd" parameter.
 *
 * ### Configuration parameters ###
 *
 * - connections:
 *     - uri:                         (optional) full connection string or use protocol, app_name and function_name to build
 *     - protocol:                    (optional) connection protocol
 *     - app_name:                    (optional) Azure Function application name
 *     - function_name:               (optional) Azure Function name
 * - options:
 *      - retries:               number of retries (default: 3)
 *      - connect_timeout:       connection timeout in milliseconds (default: 10 sec)
 *      - timeout:               invocation timeout in milliseconds (default: 10 sec)
 * - credentials:
 *     - auth_code:                   Azure Function auth code if use custom authorization provide empty string
 *
 * ### References ###
 *
 * - <code>\*:logger:\*:\*:1.0</code>            (optional) [[https://pip-services3-nodex.github.io/pip-services3-components-nodex/interfaces/log.ilogger.html ILogger]] components to pass log messages
 * - <code>\*:counters:\*:\*:1.0</code>          (optional) [[https://pip-services3-nodex.github.io/pip-services3-components-nodex/interfaces/count.icounters.html ICounters]] components to pass collected measurements
 * - <code>\*:discovery:\*:\*:1.0</code>         (optional) [[https://pip-services3-nodex.github.io/pip-services3-components-nodex/interfaces/connect.idiscovery.html IDiscovery]] services to resolve connection
 * - <code>\*:credential-store:\*:\*:1.0</code>  (optional) Credential stores to resolve credentials
 *
 * @see [[AzureFunction]]
 *
 * ### Example ###
 *
 *     class MyCommandableAzureClient extends CommandableAzureFunctionClient implements IMyClient {
 *         ...
 *
 *         public async getData(correlationId: string, id: string): Promise<any> {
 *             return this.callCommand("get_data", correlationId, { id: id });
 *         }
 *         ...
 *     }
 *
 *     let client = new MyCommandableAzureClient();
 *     client.configure(ConfigParams.fromTuples(
 *         "connection.uri", "http://myapp.azurewebsites.net/api/myfunction",
 *         "connection.protocol", "http",
 *         "connection.app_name", "myapp",
 *         "connection.function_name", "myfunction"
 *         "credential.auth_code", "XXXX"
 *     ));
 *
 *     const result = await client.getData("123", "1");
 *     ...
 */
class CommandableAzureFunctionClient extends AzureFunctionClient_1.AzureFunctionClient {
    /**
     * Creates a new instance of this client.
     *
     * @param name a service name.
     */
    constructor(name) {
        super();
        this._name = name;
    }
    /**
     * Calls a remote action in Azure Function.
     * The name of the action is added as "cmd" parameter
     * to the action parameters.
     *
     * @param cmd               an action name
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param params            command parameters.
     * @return {any}            action result.
     */
    callCommand(cmd, correlationId, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const timing = this.instrument(correlationId, this._name + '.' + cmd);
            try {
                const result = yield this.call(cmd, correlationId, params);
                timing.endTiming();
                return result;
            }
            catch (err) {
                timing.endFailure(err);
                return err;
            }
        });
    }
}
exports.CommandableAzureFunctionClient = CommandableAzureFunctionClient;
//# sourceMappingURL=CommandableAzureFunctionClient.js.map