import { Parameters } from 'pip-services3-commons-nodex';
import { AzureFunction } from './AzureFunction';
/**
 * Abstract Azure Function function, that acts as a container to instantiate and run components
 * and expose them via external entry point. All actions are automatically generated for commands
 * defined in [[https://pip-services3-nodex.github.io/pip-services3-commons-nodex/interfaces/commands.icommandable.html ICommandable components]]. Each command is exposed as an action defined by "cmd" parameter.
 *
 * Container configuration for this Azure Function is stored in <code>"./config/config.yml"</code> file.
 * But this path can be overridden by <code>CONFIG_PATH</code> environment variable.
 *
 * Note: This component has been deprecated. Use Azure FunctionService instead.
 *
 * ### References ###
 *
 * - <code>\*:logger:\*:\*:1.0</code>            (optional) [[https://pip-services3-nodex.github.io/pip-services3-components-nodex/interfaces/log.ilogger.html ILogger]] components to pass log messages
 * - <code>\*:counters:\*:\*:1.0</code>          (optional) [[https://pip-services3-nodex.github.io/pip-services3-components-nodex/interfaces/count.icounters.html ICounters]] components to pass collected measurements
 * - <code>\*:service:azure-function:\*:1.0</code>       (optional) [[https://pip-services3-nodex.github.io/pip-services3-azure-nodex/interfaces/services.iazurefunctionservice.html IAzureFunctionService]] services to handle action requests
 * - <code>\*:service:commandable-azure-function:\*:1.0</code> (optional) [[https://pip-services3-nodex.github.io/pip-services3-azure-nodex/interfaces/services.iazurefunctionservice.html IAzureFunctionService]] services to handle action requests
 *
 *
 * ### Example ###
 *
 *     class MyAzureFunctionFunction extends CommandableAzureFunction {
 *         private _controller: IMyController;
 *         ...
 *         public constructor() {
 *             base("mygroup", "MyGroup AzureFunction");
 *             this._dependencyResolver.put(
 *                 "controller",
 *                 new Descriptor("mygroup","controller","*","*","1.0")
 *             );
 *         }
 *     }
 *
 *     let azureFunction = new MyAzureFunctionFunction();
 *
 *     await service.run();
 *     console.log("MyAzureFunction is started");
 */
export declare abstract class CommandableAzureFunction extends AzureFunction {
    /**
     * Creates a new instance of this Azure Function.
     *
     * @param name          (optional) a container name (accessible via ContextInfo)
     * @param description   (optional) a container description (accessible via ContextInfo)
     */
    constructor(name: string, description?: string);
    /**
     * Returns body from Azure Function context.
     * This method can be overloaded in child classes
     * @param context -  Azure Function context
     * @return Returns Parameters from context
     */
    protected getParametrs(context: any): Parameters;
    private registerCommandSet;
    /**
     * Registers all actions in this Azure Function.
     */
    register(): void;
}
