/** @module services */

import { ICommandable } from 'pip-services3-commons-nodex';
import { CommandSet } from 'pip-services3-commons-nodex';
import { Parameters } from 'pip-services3-commons-nodex';

import { AzureFunctionService } from './AzureFunctionService';
import {AzureFunctionContextHelper} from "../containers/AzureFunctionContextHelper";

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
export abstract class CommandableAzureFunctionService extends AzureFunctionService {
    private _commandSet: CommandSet;

    /**
     * Creates a new instance of the service.
     * 
     * @param name a service name.
     */
    public constructor(name: string) {
        super(name);
        this._dependencyResolver.put('controller', 'none');
    }

    /**
     * Returns body from Azure Function context.
     * This method can be overloaded in child classes
     * @param context -  Azure Function context
     * @return Returns body from context
     */
    protected getBody(context: any): string {
        return AzureFunctionContextHelper.getHttpRequestBody(context);
    }

    /**
     * Registers all actions in Azure Function.
     */
    public register(): void {
        let controller: ICommandable = this._dependencyResolver.getOneRequired<ICommandable>('controller');
        this._commandSet = controller.getCommandSet();

        let commands = this._commandSet.getCommands();
        for (let index = 0; index < commands.length; index++) {
            let command = commands[index];
            let name = command.getName();

            this.registerAction(name, null, (context) => {
                let correlationId = this.getCorrelationId(context);
                let body = this.getBody(context);
                let args = Parameters.fromValue(body);
                args.remove("correlation_id");

                let timing = this.instrument(correlationId, name);
                try {
                    return command.execute(correlationId, args);
                } catch (ex) {
                    timing.endFailure(ex);
                } finally {
                    timing.endTiming();
                }
            });
        }
    }
}