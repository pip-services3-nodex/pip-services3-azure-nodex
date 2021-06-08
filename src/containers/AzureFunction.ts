/** @module containers */
/** @hidden */ 
let process = require('process');

import { BadRequestException } from 'pip-services3-commons-nodex';
import { ConfigParams } from 'pip-services3-commons-nodex';
import { DependencyResolver } from 'pip-services3-commons-nodex';
import { IReferences } from 'pip-services3-commons-nodex';
import { Schema } from 'pip-services3-commons-nodex';
import { UnknownException } from 'pip-services3-commons-nodex';
import { Container } from 'pip-services3-container-nodex';
import { CompositeCounters } from 'pip-services3-components-nodex';
import { ConsoleLogger } from 'pip-services3-components-nodex';
import { CompositeTracer } from 'pip-services3-components-nodex';
import { InstrumentTiming } from 'pip-services3-rpc-nodex';

/**
 * Abstract Azure Function function, that acts as a container to instantiate and run components
 * and expose them via external entry point. 
 * 
 * When handling calls "cmd" parameter determines which what action shall be called, while
 * other parameters are passed to the action itself.
 * 
 * Container configuration for this Azure Function is stored in <code>"./config/config.yml"</code> file.
 * But this path can be overriden by <code>CONFIG_PATH</code> environment variable.
 * 
 * ### Configuration parameters ###
 * 
 * - dependencies:
 *     - controller:                  override for Controller dependency
 * - connections:                   
 *     - discovery_key:               (optional) a key to retrieve the connection from [[https://pip-services3-nodex.github.io/pip-services3-components-nodex/interfaces/connect.idiscovery.html IDiscovery]]
 *     - region:                      (optional) AWS region
 * - credentials:    
 *     - store_key:                   (optional) a key to retrieve the credentials from [[https://pip-services3-nodex.github.io/pip-services3-components-nodex/interfaces/auth.icredentialstore.html ICredentialStore]]
 *     - access_id:                   AWS access/client id
 *     - access_key:                  AWS access/client id
 * 
 * ### References ###
 * 
 * - <code>\*:logger:\*:\*:1.0</code>            (optional) [[https://pip-services3-nodex.github.io/pip-services3-components-nodex/interfaces/log.ilogger.html ILogger]] components to pass log messages
 * - <code>\*:counters:\*:\*:1.0</code>          (optional) [[https://pip-services3-nodex.github.io/pip-services3-components-nodex/interfaces/count.icounters.html ICounters]] components to pass collected measurements
 * - <code>\*:discovery:\*:\*:1.0</code>         (optional) [[https://pip-services3-nodex.github.io/pip-services3-components-nodex/interfaces/connect.idiscovery.html IDiscovery]] services to resolve connection
 * - <code>\*:credential-store:\*:\*:1.0</code>  (optional) Credential stores to resolve credentials
 * 
 * @see [[LambdaClient]]
 * 
 * ### Example ###
 * 
 *     class MyLambdaFunction extends LambdaFunction {
 *         private _controller: IMyController;
 *         ...
 *         public constructor() {
 *             base("mygroup", "MyGroup lambda function");
 *             this._dependencyResolver.put(
 *                 "controller",
 *                 new Descriptor("mygroup","controller","*","*","1.0")
 *             );
 *         }
 *      
 *         public setReferences(references: IReferences): void {
 *             base.setReferences(references);
 *             this._controller = this._dependencyResolver.getRequired<IMyController>("controller");
 *         }
 *      
 *         public register(): void {
 *             registerAction("get_mydata", null, params => Promise<any> {
 *                 let correlationId = params.correlation_id;
 *                 let id = params.id;
 *                 return this._controller.getMyData(correlationId, id);
 *             });
 *             ...
 *         }
 *     }
 * 
 *     let lambda = new MyLambdaFunction();
 *     
 *     await service.run();
 *     console.log("MyLambdaFunction is started");
 */
export abstract class AzureFunction extends Container {
    /**
     * The performanc counters.
     */
    protected _counters = new CompositeCounters();
    /**
     * The tracer.
     */
    protected _tracer: CompositeTracer = new CompositeTracer();
    /**
     * The dependency resolver.
     */
    protected _dependencyResolver = new DependencyResolver();
    /**
     * The map of registred validation schemas.
     */
    protected _schemas: { [id: string]: Schema } = {};
    /**
     * The map of registered actions.
     */
    protected _actions: { [id: string]: any } = {};
    /**
     * The default path to config file.
     */
    protected _configPath: string = './config/config.yml';

    /**
     * Creates a new instance of this lambda function.
     * 
     * @param name          (optional) a container name (accessible via ContextInfo)
     * @param description   (optional) a container description (accessible via ContextInfo)
     */
    public constructor(name?: string, description?: string) {
        super(name, description);

        this._logger = new ConsoleLogger();
    }

    private getConfigPath(): string {
        return process.env.CONFIG_PATH || this._configPath;
    }

    private getParameters(): ConfigParams {
        return ConfigParams.fromValue(process.env);
    }

    private captureErrors(correlationId: string): void {
        // Log uncaught exceptions
        process.on('uncaughtException', (ex) => {
            this._logger.fatal(correlationId, ex, "Process is terminated");
            process.exit(1);
        });
    }

    private captureExit(correlationId: string): void {
        this._logger.info(correlationId, "Press Control-C to stop the microservice...");

        // Activate graceful exit
        process.on('SIGINT', () => {
            process.exit();
        });

        // Gracefully shutdown
        process.on('exit', () => {
            this.close(correlationId);
            this._logger.info(correlationId, "Goodbye!");
        });
    }

	/**
	 * Sets references to dependent components.
	 * 
	 * @param references 	references to locate the component dependencies. 
	 */
    public setReferences(references: IReferences): void {
        super.setReferences(references);
        this._counters.setReferences(references);
        this._dependencyResolver.setReferences(references);

        this.register();
    }

    /**
     * Adds instrumentation to log calls and measure call time.
     * It returns a InstrumentTiming object that is used to end the time measurement.
     * 
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param name              a method name.
     * @returns {InstrumentTiming} object to end the time measurement.
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
     * Runs this Azure function, loads container configuration,
     * instantiate components and manage their lifecycle,
     * makes this function ready to access action calls.
     *  
     */
    public async run(): Promise<void> {
        let correlationId = this._info.name;

        let path = this.getConfigPath();
        let parameters = this.getParameters();
        this.readConfigFromFile(correlationId, path, parameters);

        this.captureErrors(correlationId);
        this.captureExit(correlationId);
    	await this.open(correlationId);
    }

    /**
     * Registers all actions in this Azure function.
     * 
     * This method is called by the service and must be overridden
     * in child classes.
     */
    protected abstract register(): void;

    /**
     * Registers an action in this Azure function.
     * 
     * @param cmd           a action/command name.
     * @param schema        a validation schema to validate received parameters.
     * @param action        an action function that is called when action is invoked.
     */
    protected registerAction(cmd: string, schema: Schema, 
        action: (params: any) => Promise<any>): void {
        if (cmd == '') {
            throw new UnknownException(null, 'NO_COMMAND', 'Missing command');
        }

        if (action == null) {
            throw new UnknownException(null, 'NO_ACTION', 'Missing action');
        }

        if (typeof action != "function") {
            throw new UnknownException(null, 'ACTION_NOT_FUNCTION', 'Action is not a function');
        }

        // Hack!!! Wrapping action to preserve prototyping context
        const actionCurl = (params) => {
            // Perform validation
            if (schema != null) {
                let correlationId = params.correlaton_id;
                let err = schema.validateAndReturnException(correlationId, params, false);
                if (err != null) {
                    throw err;
                }
            }

            // Todo: perform verification?
            return action.call(this, params);
        };

        this._actions[cmd] = actionCurl;
    }

    private async execute(context: any): Promise<any> {
        let cmd: string = context.cmd;
        let correlationId = context.correlation_id;
        
        if (cmd == null) {
            throw new BadRequestException(
                correlationId, 
                'NO_COMMAND', 
                'Cmd parameter is missing'
            );
        }
        
        const action: any = this._actions[cmd];
        if (action == null) {
            throw new BadRequestException(
                correlationId, 
                'NO_ACTION', 
                'Action ' + cmd + ' was not found'
            )
            .withDetails('command', cmd);
        }
        
        return action(context);
    }
    
    private async handler(context: any): Promise<any> {
        // If already started then execute
        if (this.isOpen()) {
            return this.execute(context);
        }
        // Start before execute
        await this.run();
        return this.execute(context);
    }
    
    /**
     * Gets entry point into this Azure function.
     * 
     * @param context     an incoming context object with invocation parameters.
     */
    public getHandler(): (context: any) => Promise<any> {
        let self = this;
        
        // Return plugin function
        return async function (context) {
            // Calling run with changed context
            return self.handler.call(self, context);
        }
    }

    /**
     * Calls registered action in this Azure function.
     * "cmd" parameter in the action parameters determine
     * what action shall be called.
     * 
     * This method shall only be used in testing.
     * 
     * @param params action parameters.
     */
    public async act(params: any): Promise<any> {
        return this.getHandler()(params);
    }

}