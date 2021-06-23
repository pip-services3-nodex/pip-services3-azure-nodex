/** @module services */
import { AzureFunctionService } from './AzureFunctionService';
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
export declare abstract class CommandableAzureFunctionService extends AzureFunctionService {
    private _commandSet;
    /**
     * Creates a new instance of the service.
     *
     * @param name a service name.
     */
    constructor(name: string);
    /**
     * Registers all actions in Azure Function.
     */
    register(): void;
}
