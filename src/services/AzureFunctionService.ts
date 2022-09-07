/** @module services */

import { IOpenable } from 'pip-services3-commons-nodex';
import { IConfigurable } from 'pip-services3-commons-nodex';
import { IReferenceable } from 'pip-services3-commons-nodex';
import { IReferences } from 'pip-services3-commons-nodex';
import { ConfigParams } from 'pip-services3-commons-nodex';
import { DependencyResolver } from 'pip-services3-commons-nodex';
import { BadRequestException } from 'pip-services3-commons-nodex';
import { CompositeLogger } from 'pip-services3-components-nodex';
import { CompositeCounters } from 'pip-services3-components-nodex';
import { CompositeTracer } from 'pip-services3-components-nodex';
import { InstrumentTiming } from 'pip-services3-rpc-nodex';
import { Schema } from 'pip-services3-commons-nodex';

import { AzureFunctionAction } from './AzureFunctionAction';
import { IAzureFunctionService } from './IAzureFunctionService';
import { AzureFunctionContextHelper } from '../containers/AzureFunctionContextHelper';

/**
 * Abstract service that receives remove calls via Azure Function protocol.
 * 
 * This service is intended to work inside AzureFunction container that
 * exposes registered actions externally.
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
 * 
 * ### Example ###
 * 
 *     class MyAzureFunctionService extends AzureFunctionService {
 *        private _controller: IMyController;
 *        ...
 *        public constructor() {
 *           base('v1.myservice');
 *           this._dependencyResolver.put(
 *               "controller",
 *               new Descriptor("mygroup","controller","*","*","1.0")
 *           );
 *        }
 * 
 *        public setReferences(references: IReferences): void {
 *           base.setReferences(references);
 *           this._controller = this._dependencyResolver.getRequired<IMyController>("controller");
 *        }
 * 
 *        public register(): void {
 *            registerAction("get_mydata", null, async (context) => {
 *                let correlationId = context.correlation_id;
 *                let id = context.id;
 *                return await this._controller.getMyData(correlationId, id);
 *            });
 *            ...
 *        }
 *     }
 * 
 *     let service = new MyAzureFunctionService();
 *     service.configure(ConfigParams.fromTuples(
 *         "connection.protocol", "http",
 *         "connection.host", "localhost",
 *         "connection.port", 8080
 *     ));
 *     service.setReferences(References.fromTuples(
 *        new Descriptor("mygroup","controller","default","default","1.0"), controller
 *     ));
 * 
 *     service.open("123");
 */
export abstract class AzureFunctionService implements IAzureFunctionService, IOpenable, IConfigurable,
    IReferenceable {

    private _name: string;
    private _actions: AzureFunctionAction[] = [];
    private _interceptors: any[] = [];
    private _opened: boolean;

    /**
     * The dependency resolver.
     */
    protected _dependencyResolver: DependencyResolver = new DependencyResolver();
    /**
     * The logger.
     */
    protected _logger: CompositeLogger = new CompositeLogger();
    /**
     * The performance counters.
     */
    protected _counters: CompositeCounters = new CompositeCounters();
    /**
     * The tracer.
     */
    protected _tracer: CompositeTracer = new CompositeTracer();

    /**
     * Creates an instance of this service.
     * @param name a service name to generate action cmd.
     */
    public constructor(name?: string) {
        this._name = name;
    }

    /**
     * Configures component by passing configuration parameters.
     * 
     * @param config    configuration parameters to be set.
     */
    public configure(config: ConfigParams): void {
        this._dependencyResolver.configure(config);
    }

    /**
     * Sets references to dependent components.
     * 
     * @param references 	references to locate the component dependencies. 
     */
    public setReferences(references: IReferences): void {
        this._logger.setReferences(references);
        this._counters.setReferences(references);
        this._tracer.setReferences(references);
        this._dependencyResolver.setReferences(references);
    }

    /**
     * Get all actions supported by the service.
     * @returns an array with supported actions.
     */
    public getActions(): AzureFunctionAction[] {
        return this._actions;
    }

    /**
     * Adds instrumentation to log calls and measure call time.
     * It returns a Timing object that is used to end the time measurement.
     * 
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param name              a method name.
     * @returns Timing object to end the time measurement.
     */
    protected instrument(correlationId: string, name: string): InstrumentTiming {
        this._logger.trace(correlationId, "Executing %s method", name);
        this._counters.incrementOne(name + ".exec_count");

        let counterTiming = this._counters.beginTiming(name + ".exec_time");
        let traceTiming = this._tracer.beginTrace(correlationId, name, null);
        return new InstrumentTiming(correlationId, name, "exec",
            this._logger, this._counters, counterTiming, traceTiming);
    }

    /**
     * Checks if the component is opened.
     * 
     * @returns true if the component has been opened and false otherwise.
     */
    public isOpen(): boolean {
        return this._opened;
    }

    /**
     * Opens the component.
     * 
     * @param correlationId 	(optional) transaction id to trace execution through call chain.
     */
    public async open(correlationId: string): Promise<void> {
        if (this._opened) {
            return;
        }

        this.register();

        this._opened = true;
    }

    /**
     * Closes component and frees used resources.
     * 
     * @param correlationId 	(optional) transaction id to trace execution through call chain.
     */
    public async close(correlationId: string): Promise<void> {
        if (!this._opened) {
            return;
        }

        this._opened = false;
        this._actions = [];
        this._interceptors = [];
    }

    protected applyValidation(schema: Schema, action: (context: any) => Promise<any>): (context: any) => Promise<any> {
        // Create an action function
        let actionWrapper = async (context) => {
            // Validate object
            if (schema && context) {
                // Perform validation
                let params = Object.assign({}, context.params, context.query, { body: context.body });
                let correlationId = this.getCorrelationId(context);
                let err = schema.validateAndReturnException(correlationId, params, false);
                if (err) {
                    return err;
                }
            }

            let result = await action.call(this, context);
            return result;
        };

        return actionWrapper;
    }

    protected applyInterceptors(action: (context: any) => Promise<any>): (context: any) => Promise<any> {
        let actionWrapper = action;

        for (let index = this._interceptors.length - 1; index >= 0; index--) {
            let interceptor = this._interceptors[index];
            actionWrapper = ((action) => {
                return (context) => {
                    return interceptor(context, action);
                };
            })(actionWrapper);
        }

        return actionWrapper;
    }

    protected generateActionCmd(name: string): string {
        let cmd = name;
        if (this._name != null) {
            cmd = this._name + "." + cmd;
        }   
        return cmd;
    }

    /**
     * Registers a action in Azure Function function.
     * 
     * @param name          an action name
     * @param schema        a validation schema to validate received parameters.
     * @param action        an action function that is called when operation is invoked.
     */
    protected registerAction(name: string, schema: Schema, action: (context: any) => Promise<any>): void {
        let actionWrapper = this.applyValidation(schema, action);
        actionWrapper = this.applyInterceptors(actionWrapper);

        let self = this;
        let registeredAction: AzureFunctionAction = {
            cmd: this.generateActionCmd(name), 
            schema: schema,
            action: (context) => { return actionWrapper.call(self, context); }
        };
        this._actions.push(registeredAction);
    }

    /**
     * Registers an action with authorization.
     * 
     * @param name          an action name
     * @param schema        a validation schema to validate received parameters.
     * @param authorize     an authorization interceptor
     * @param action        an action function that is called when operation is invoked.
     */
    protected registerActionWithAuth(name: string, schema: Schema,
        authorize: (context: any, next: (context: any) => Promise<any>) => Promise<any>,
        action: (context: any) => Promise<any>): void {
    
        let actionWrapper = this.applyValidation(schema, action);
        // Add authorization just before validation
        actionWrapper = (call) => {
            return authorize(call, actionWrapper);
        };
        actionWrapper = this.applyInterceptors(actionWrapper);

        let self = this;
        let registeredAction: AzureFunctionAction = {
            cmd: this.generateActionCmd(name), 
            schema: schema,
            action: (context) => { return actionWrapper.call(self, context); }
        };
        this._actions.push(registeredAction);
    }

    /**
     * Registers a middleware for actions in Azure Function service.
     * 
     * @param action an action function that is called when middleware is invoked.
     */
    protected registerInterceptor(cmd: string, action: (context: any, next: (context: any) => Promise<any>) => Promise<any>): void {
        let self = this;
        let interceptorWrapper = async (req: Request, next: (context: any) => Promise<any>) => {
            let currCmd = this.getCommand(req);
            let match = (currCmd.match(cmd) || []).length > 0;
            if (cmd != null && cmd != "" && !match)
                return await next.call(self, req);
            else 
                return await action.call(self, req, next);
        }

        this._interceptors.push(interceptorWrapper);
    }

    /**
     * Registers all service routes in HTTP endpoint.
     * 
     * This method is called by the service and must be overridden
     * in child classes.
     */
    protected abstract register(): void;

    /**
     * Returns correlationId from Azure Function context.
     * This method can be overloaded in child classes
     * @param context - the context context
     * @return returns correlationId from context
     */
    protected getCorrelationId(context: any): string {
        return AzureFunctionContextHelper.getCorrelationId(context);
    }

    /**
     * Returns command from Azure Function context.
     * This method can be overloaded in child classes
     * @param context -  the context context
     * @return returns command from context
     */
    protected getCommand(context: any): string {
        return AzureFunctionContextHelper.getCommand(context);
    }

    /**
     * Calls registered action in this Azure Function.
     * "cmd" parameter in the action parameters determine
     * what action shall be called.
     * 
     * This method shall only be used in testing.
     * 
     * @param context the context context.
     */
     public async act(context: any): Promise<any> {
        let cmd: string = this.getCommand(context);
        let correlationId = this.getCorrelationId(context);
        
        if (cmd == null) {
            throw new BadRequestException(
                correlationId, 
                'NO_COMMAND', 
                'Cmd parameter is missing'
            );
        }
        
        const action: AzureFunctionAction = this._actions.find(a => a.cmd == cmd);
        if (action == null) {
            throw new BadRequestException(
                correlationId, 
                'NO_ACTION', 
                'Action ' + cmd + ' was not found'
            )
            .withDetails('command', cmd);
        }

        return action.action(context);
    }

}