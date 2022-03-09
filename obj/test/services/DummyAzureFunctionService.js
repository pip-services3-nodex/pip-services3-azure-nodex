"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DummyAzureFunctionService = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_2 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_3 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_4 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_5 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_6 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_7 = require("pip-services3-commons-nodex");
const AzureFunctionService_1 = require("../../src/services/AzureFunctionService");
const DummySchema_1 = require("../DummySchema");
class DummyAzureFunctionService extends AzureFunctionService_1.AzureFunctionService {
    constructor() {
        super("dummies");
        this._headers = {
            'Content-Type': 'application/json'
        };
        this._dependencyResolver.put('controller', new pip_services3_commons_nodex_1.Descriptor('pip-services-dummies', 'controller', 'default', '*', '*'));
    }
    getBodyData(context) {
        let params = Object.assign({}, context);
        if (context.hasOwnProperty('body')) {
            params = Object.assign(Object.assign({}, params), context.body);
        }
        return params;
    }
    setReferences(references) {
        super.setReferences(references);
        this._controller = this._dependencyResolver.getOneRequired('controller');
    }
    getPageByFilter(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = yield this._controller.getPageByFilter(req.body.correlation_id, new pip_services3_commons_nodex_2.FilterParams(req.body.filter), new pip_services3_commons_nodex_3.PagingParams(req.body.paging));
            return { body: page, headers: this._headers };
        });
    }
    getOneById(req) {
        return __awaiter(this, void 0, void 0, function* () {
            let params = this.getBodyData(req);
            const dummy = yield this._controller.getOneById(params.correlation_id, params.dummy_id);
            return { body: dummy, headers: this._headers };
        });
    }
    create(req) {
        return __awaiter(this, void 0, void 0, function* () {
            let params = this.getBodyData(req);
            const dummy = yield this._controller.create(params.correlation_id, params.dummy);
            return { body: dummy, headers: this._headers };
        });
    }
    update(req) {
        return __awaiter(this, void 0, void 0, function* () {
            let params = this.getBodyData(req);
            const dummy = yield this._controller.update(params.correlation_id, params.dummy);
            return { body: dummy, headers: this._headers };
        });
    }
    deleteById(req) {
        return __awaiter(this, void 0, void 0, function* () {
            let params = this.getBodyData(req);
            const dummy = yield this._controller.deleteById(params.correlation_id, params.dummy_id);
            return { body: dummy, headers: this._headers };
        });
    }
    register() {
        this.registerAction('get_dummies', new pip_services3_commons_nodex_4.ObjectSchema(true).withOptionalProperty('body', new pip_services3_commons_nodex_4.ObjectSchema()
            .withOptionalProperty("filter", new pip_services3_commons_nodex_6.FilterParamsSchema())
            .withOptionalProperty("paging", new pip_services3_commons_nodex_7.PagingParamsSchema())), this.getPageByFilter);
        this.registerAction('get_dummy_by_id', new pip_services3_commons_nodex_4.ObjectSchema(true).withOptionalProperty('body', new pip_services3_commons_nodex_4.ObjectSchema(true)
            .withOptionalProperty("dummy_id", pip_services3_commons_nodex_5.TypeCode.String)), this.getOneById);
        this.registerAction('create_dummy', new pip_services3_commons_nodex_4.ObjectSchema(true).withOptionalProperty('body', new pip_services3_commons_nodex_4.ObjectSchema(true)
            .withRequiredProperty("dummy", new DummySchema_1.DummySchema())), this.create);
        this.registerAction('update_dummy', new pip_services3_commons_nodex_4.ObjectSchema(true).withOptionalProperty('body', new pip_services3_commons_nodex_4.ObjectSchema(true)
            .withRequiredProperty("dummy", new DummySchema_1.DummySchema())), this.update);
        this.registerAction('delete_dummy', new pip_services3_commons_nodex_4.ObjectSchema(true).withOptionalProperty('body', new pip_services3_commons_nodex_4.ObjectSchema(true)
            .withOptionalProperty("dummy_id", pip_services3_commons_nodex_5.TypeCode.String)), this.deleteById);
    }
}
exports.DummyAzureFunctionService = DummyAzureFunctionService;
//# sourceMappingURL=DummyAzureFunctionService.js.map