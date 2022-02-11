import { TypeCode } from 'pip-services3-commons-nodex';
import { ObjectSchema } from 'pip-services3-commons-nodex';

export class AzureFunctionRequestSchema extends ObjectSchema {

    public constructor() {
        super();
        this.withOptionalProperty('body', TypeCode.Map);
        this.withOptionalProperty('query', TypeCode.Map);
    }

}
