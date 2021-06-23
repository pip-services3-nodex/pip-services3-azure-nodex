/** @module services */
import { AzureFunctionAction } from './AzureFunctionAction';
/**
 * An interface that allows to integrate Azure Function services into Azure Function containers
 * and connect their actions to the function calls.
 */
export interface IAzureFunctionService {
    /**
     * Get all actions supported by the service.
     * @returns an array with supported actions.
     */
    getActions(): AzureFunctionAction[];
}
