import { TypeCode } from 'pip-services3-commons-nodex';
import { ObjectSchema } from 'pip-services3-commons-nodex';

export class AzureFunctionRequestSchema extends ObjectSchema {

    public constructor() {
        super();
        this.withRequiredProperty('req',
            new ObjectSchema(true)
                .withOptionalProperty('body', TypeCode.Map)
                .withOptionalProperty('query', TypeCode.Map)
        );
    }

}
