/** @module connect */
import { ConfigParams } from 'pip-services3-commons-nodex';
import { StringValueMap } from 'pip-services3-commons-nodex';
import { ConfigException } from 'pip-services3-commons-nodex';
import { CredentialParams } from 'pip-services3-components-nodex';
import { ConnectionParams } from 'pip-services3-components-nodex';

/**
 * Contains connection parameters to authenticate against Azure Functions
 * and connect to specific Azure Function.
 * 
 * The class is able to compose and parse Azure Function connection parameters.
 * 
 * ### Configuration parameters ###
 * 
 * - uri:           full connection uri with specific app and function name
 * - app_name:      alternative app name
 * - function_name: application function name
 * - auth_code:     authorization code or null if using custom auth
 *
 * In addition to standard parameters [[https://pip-services3-nodex.github.io/pip-services3-components-nodex/classes/auth.credentialparams.html CredentialParams]] may contain any number of custom parameters
 * 
 * @see [[AzureConnectionResolver]]
 * 
 * ### Example ###
 * 
 *     let connection = AzureConnectionParams.fromTuples(
 *         "uri", "http://myapp.azurewebsites.net/api/myfunction",
 *         "app_name", "myapp",
 *         "function_name", "myfunction",
 *         "auth_code", "code",
 *     );
 *     
 *     const uri = connection.getFunctionUri();             // Result: "http://myapp.azurewebsites.net/api/myfunction"
 *     const appName = connection.getAppName();             // Result: "myapp"
 *     const functionName = connection.getFunctionName();   // Result: "myfunction"
 *     const authCode = connection.getAuthCode();           // Result: "code"
 */
export class AzureConnectionParams extends ConfigParams {
    /**
     * Creates an new instance of the connection parameters.
     * 
	 * @param values 	(optional) an object to be converted into key-value pairs to initialize this connection.
     */
    public constructor(values: any = null) {
        super(values);
    }

    /**
     * Gets the Azure function uri.
     *
     * @returns {string} the Azure function uri.
     */
    public getFunctionUri(): string {
        return super.getAsNullableString("uri");
    }

    /**
     * Sets the Azure function uri.
     *
     * @param value a new Azure function uri.
     */
    public setFunctionUri(value: string) {
        super.put("uri", value);
    }

    /**
     * Gets the Azure app name.
     *
     * @returns {string} the Azure app name.
     */
    public getAppName(): string {
        return super.getAsNullableString("app_name");
    }

    /**
     * Sets the Azure app name.
     *
     * @param value a new Azure app name.
     */
    public setAppName(value: string) {
        super.put("app_name", value);
    }

    /**
     * Gets the Azure function name.
     *
     * @returns {string} the Azure function name.
     */
    public getFunctionName(): string {
        return super.getAsNullableString("function_name");
    }

    /**
     * Sets the Azure function name.
     *
     * @param value a new Azure function name.
     */
    public setFunctionName(value: string) {
        super.put("function_name", value);
    }

    /**
     * Gets the Azure auth code.
     * 
     * @returns {string} the Azure auth code.
     */
    public getAuthCode(): string {
        return super.getAsNullableString("auth_code");
    }

    /**
     * Sets the Azure auth code.
     * 
     * @param value a new Azure auth code.
     */
    public setAuthCode(value: string) {
        super.put("auth_code", value);
    }

    /**
	 * Creates a new AzureConnectionParams object filled with key-value pairs serialized as a string.
	 * 
	 * @param line 		                a string with serialized key-value pairs as "key1=value1;key2=value2;..."
	 * 					                Example: "Key1=123;Key2=ABC;Key3=2016-09-16T00:00:00.00Z"
	 * @returns {AzureConnectionParams}	a new AzureConnectionParams object.
     */
    public static fromString(line: string): AzureConnectionParams {
        let map = StringValueMap.fromString(line);
        return new AzureConnectionParams(map);
    }

    /**
     * Validates this connection parameters 
     * 
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     */
    public validate(correlationId: string) {
        const uri = this.getFunctionUri();
        const appName = this.getAppName();
        const functionName = this.getFunctionName();

        if (uri === null || (appName === null && functionName === null)) {
            throw new ConfigException(
                correlationId,
                "NO_CONNECTION_URI",
                "No uri, app_name and function_name is configured in Auzre function uri"
            );
        }

        if (this.getAuthCode() == null) {
            throw new ConfigException(
                correlationId, 
                "NO_ACCESS_KEY",
                "No access_key is configured in AWS credential"
            );
        }
    }

    /**
	 * Retrieves AzureConnectionParams from configuration parameters.
     * The values are retrieves from "connection" and "credential" sections.
	 * 
	 * @param config 	                configuration parameters
	 * @returns {AzureConnectionParams}	the generated AzureConnectionParams object.
	 * 
	 * @see [[mergeConfigs]]
	 */
    public static fromConfig(config: ConfigParams): AzureConnectionParams {
        let result = new AzureConnectionParams();

        let credentials = CredentialParams.manyFromConfig(config);
        for (let credential of credentials)
            result.append(credential);

        let connections = ConnectionParams.manyFromConfig(config);
        for (let connection of connections)
            result.append(connection);

        return result;
    }

    /**
	 * Retrieves AzureConnectionParams from multiple configuration parameters.
     * The values are retrieves from "connection" and "credential" sections.
	 * 
	 * @param configs 	                a list with configuration parameters
	 * @returns {AzureConnectionParams}	the generated AzureConnectionParams object.
	 * 
	 * @see [[fromConfig]]
	 */
    public static mergeConfigs(...configs: ConfigParams[]): AzureConnectionParams {
        let config = ConfigParams.mergeConfigs(...configs);
        return new AzureConnectionParams(config);
    }
}