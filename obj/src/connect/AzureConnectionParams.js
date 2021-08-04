"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AzureConnectionParams = void 0;
/** @module connect */
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_2 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_3 = require("pip-services3-commons-nodex");
const pip_services3_components_nodex_1 = require("pip-services3-components-nodex");
const pip_services3_components_nodex_2 = require("pip-services3-components-nodex");
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
class AzureConnectionParams extends pip_services3_commons_nodex_1.ConfigParams {
    /**
     * Creates an new instance of the connection parameters.
     *
     * @param values 	(optional) an object to be converted into key-value pairs to initialize this connection.
     */
    constructor(values = null) {
        super(values);
    }
    /**
     * Gets the Azure function uri.
     *
     * @returns {string} the Azure function uri.
     */
    getFunctionUri() {
        return super.getAsNullableString("uri");
    }
    /**
     * Sets the Azure function uri.
     *
     * @param value a new Azure function uri.
     */
    setFunctionUri(value) {
        super.put("uri", value);
    }
    /**
     * Gets the Azure app name.
     *
     * @returns {string} the Azure app name.
     */
    getAppName() {
        return super.getAsNullableString("app_name");
    }
    /**
     * Sets the Azure app name.
     *
     * @param value a new Azure app name.
     */
    setAppName(value) {
        super.put("app_name", value);
    }
    /**
     * Gets the Azure function name.
     *
     * @returns {string} the Azure function name.
     */
    getFunctionName() {
        return super.getAsNullableString("function_name");
    }
    /**
     * Sets the Azure function name.
     *
     * @param value a new Azure function name.
     */
    setFunctionName(value) {
        super.put("function_name", value);
    }
    /**
     * Gets the Azure auth code.
     *
     * @returns {string} the Azure auth code.
     */
    getAuthCode() {
        return super.getAsNullableString("auth_code");
    }
    /**
     * Sets the Azure auth code.
     *
     * @param value a new Azure auth code.
     */
    setAuthCode(value) {
        super.put("auth_code", value);
    }
    /**
     * Creates a new AzureConnectionParams object filled with key-value pairs serialized as a string.
     *
     * @param line 		                a string with serialized key-value pairs as "key1=value1;key2=value2;..."
     * 					                Example: "Key1=123;Key2=ABC;Key3=2016-09-16T00:00:00.00Z"
     * @returns {AzureConnectionParams}	a new AzureConnectionParams object.
     */
    static fromString(line) {
        let map = pip_services3_commons_nodex_2.StringValueMap.fromString(line);
        return new AzureConnectionParams(map);
    }
    /**
     * Validates this connection parameters
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     */
    validate(correlationId) {
        const uri = this.getFunctionUri();
        const appName = this.getAppName();
        const functionName = this.getFunctionName();
        if (uri === null || (appName === null && functionName === null)) {
            throw new pip_services3_commons_nodex_3.ConfigException(correlationId, "NO_CONNECTION_URI", "No uri, app_name and function_name is configured in Auzre function uri");
        }
        if (this.getAuthCode() == null) {
            throw new pip_services3_commons_nodex_3.ConfigException(correlationId, "NO_ACCESS_KEY", "No access_key is configured in AWS credential");
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
    static fromConfig(config) {
        let result = new AzureConnectionParams();
        let credentials = pip_services3_components_nodex_1.CredentialParams.manyFromConfig(config);
        for (let credential of credentials)
            result.append(credential);
        let connections = pip_services3_components_nodex_2.ConnectionParams.manyFromConfig(config);
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
    static mergeConfigs(...configs) {
        let config = pip_services3_commons_nodex_1.ConfigParams.mergeConfigs(...configs);
        return new AzureConnectionParams(config);
    }
}
exports.AzureConnectionParams = AzureConnectionParams;
//# sourceMappingURL=AzureConnectionParams.js.map