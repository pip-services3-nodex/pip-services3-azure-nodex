"use strict";
/** @module services */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandableAzureFunctionService = void 0;
const AzureFunctionService_1 = require("./AzureFunctionService");
const AzureFunctionContextHelper_1 = require("../containers/AzureFunctionContextHelper");
/**
 * Abstract service that receives commands via Azure Function protocol
 * to operations automatically generated for commands defined in [[https://pip-services3-nodex.github.io/pip-services3-commons-nodex/interfaces/commands.icommandable.html ICommandable components]].
 * Each command is exposed as invoke method that receives command name and parameters.
 *
 * Commandable services require only 3 lines of code to implement a robust external
 * Azure Function-based remote interface.
 *
 * This service is intended to work inside Azure Function container that
 * exploses registered actions externally.
 *
 * ### Configuration parameters ###
 *
 * - dependencies:
 *   - controller:            override for Controller dependency
 *
 * ### References ###
 *
 * - <code>\*:logger:\*:\*:1.0</code>               (optional) [[https://pip-services3-nodex.github.io/pip-services3-components-nodex/interfaces/log.ilogger.html ILogger]] components to pass log messages
 * - <code>\*:counters:\*:\*:1.0</code>             (optional) [[https://pip-services3-nodex.github.io/pip-services3-components-nodex/interfaces/count.icounters.html ICounters]] components to pass collected measurements
 *
 * @see [[AzureFunctionService]]
 *
 * ### Example ###
 *
 *     class MyCommandableAzureFunctionService extends CommandableAzureFunctionService {
 *        public constructor() {
 *           base();
 *           this._dependencyResolver.put(
 *               "controller",
 *               new Descriptor("mygroup","controller","*","*","1.0")
 *           );
 *        }
 *     }
 *
 *     let service = new MyCommandableAzureFunctionService();
 *     service.setReferences(References.fromTuples(
 *        new Descriptor("mygroup","controller","default","default","1.0"), controller
 *     ));
 *
 *     await service.open("123");
 *     console.log("The Azure Function service is running");
 */
class CommandableAzureFunctionService extends AzureFunctionService_1.AzureFunctionService {
    /**
     * Creates a new instance of the service.
     *
     * @param name a service name.
     */
    constructor(name) {
        super(name);
        this._dependencyResolver.put('controller', 'none');
    }
    /**
     * Returns body from Azure Function context.
     * This method can be overloaded in child classes
     * @param context -  Azure Function context
     * @return Returns Parameters from context
     */
    getParametrs(context) {
        return AzureFunctionContextHelper_1.AzureFunctionContextHelper.getParametrs(context);
    }
    /**
     * Registers all actions in Azure Function.
     */
    register() {
        let controller = this._dependencyResolver.getOneRequired('controller');
        this._commandSet = controller.getCommandSet();
        let commands = this._commandSet.getCommands();
        for (let index = 0; index < commands.length; index++) {
            let command = commands[index];
            let name = command.getName();
            this.registerAction(name, null, (context) => {
                let correlationId = this.getCorrelationId(context);
                let args = this.getParametrs(context);
                args.remove("correlation_id");
                let timing = this.instrument(correlationId, name);
                try {
                    return command.execute(correlationId, args);
                }
                catch (ex) {
                    timing.endFailure(ex);
                }
                finally {
                    timing.endTiming();
                }
            });
        }
    }
}
exports.CommandableAzureFunctionService = CommandableAzureFunctionService;
//# sourceMappingURL=CommandableAzureFunctionService.js.map