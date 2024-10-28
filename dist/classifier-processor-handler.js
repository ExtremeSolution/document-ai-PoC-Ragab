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
exports.ClassifierProcessorHandler = void 0;
const abstract_check_handler_1 = require("./abstract-check-handler");
class ClassifierProcessorHandler extends abstract_check_handler_1.CheckHandler {
    constructor() {
        super(...arguments);
        this.checkStatus = ["valid", "invalid"];
    }
    handle(fileMetaData, documentaiClient, checkData) {
        const _super = Object.create(null, {
            handle: { get: () => super.handle }
        });
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const processorName = `projects/${process.env.PROJECT_ID}/locations/${process.env.PROJECT_LOCATION}/processors/9e2b9c4a2d83618a/processorVersions/${process.env.CLASSIFIER_PROCESSOR_VERSION_ID}`;
                console.log("trying to process the classifier processor");
                const result = yield documentaiClient.processDocument({
                    name: processorName,
                    gcsDocument: {
                        gcsUri: `gs://${process.env.GCP_BUCKET}/${fileMetaData.name}`,
                        mimeType: fileMetaData.contentType,
                    },
                });
                console.log("get the result from the classifier processor");
                if ((result === null || result === void 0 ? void 0 : result.length) && ((_c = (_b = (_a = result[0]) === null || _a === void 0 ? void 0 : _a.document) === null || _b === void 0 ? void 0 : _b.entities) === null || _c === void 0 ? void 0 : _c.length)) {
                    checkData.isCancelled =
                        (result[0].document.entities[0].confidence >
                            result[0].document.entities[1].confidence
                            ? result[0].document.entities[0].type
                            : result[0].document.entities[1].type) == "invalid";
                    return _super.handle.call(this, fileMetaData, documentaiClient, checkData);
                }
                else {
                    throw new Error("Invalid Image");
                }
            }
            catch (err) {
                throw err;
            }
        });
    }
}
exports.ClassifierProcessorHandler = ClassifierProcessorHandler;
