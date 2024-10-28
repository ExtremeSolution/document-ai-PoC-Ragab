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
exports.ExtractorProcessorHandler = void 0;
const abstract_check_handler_1 = require("./abstract-check-handler");
class ExtractorProcessorHandler extends abstract_check_handler_1.CheckHandler {
    constructor() {
        super(...arguments);
        this.checkFields = [
            "check_mount",
            "check_number",
            "currency",
            "date",
            "pay_to",
            "pay_from",
        ];
    }
    handle(fileMetaData, documentaiClient, checkData) {
        const _super = Object.create(null, {
            handle: { get: () => super.handle }
        });
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            if (checkData.isCancelled)
                return _super.handle.call(this, fileMetaData, documentaiClient, checkData);
            console.log("trying to process the extract processor");
            const processorName = `projects/${process.env.PROJECT_ID}/locations/${process.env.PROJECT_LOCATION}/processors/${process.env.EXTRACT_PROCESSOR_ID}`;
            const result = yield documentaiClient.processDocument({
                name: processorName,
                gcsDocument: {
                    gcsUri: `gs://${process.env.GCP_BUCKET}/${fileMetaData.name}`,
                    mimeType: fileMetaData.contentType,
                },
            });
            console.log("get the result from the extract processor");
            for (let entity of (_b = (_a = result[0]) === null || _a === void 0 ? void 0 : _a.document) === null || _b === void 0 ? void 0 : _b.entities) {
                if (this.checkFields.includes(entity.type) &&
                    !checkData[entity.type]) {
                    checkData[entity.type] =
                        ((_c = entity.normalizedValue) === null || _c === void 0 ? void 0 : _c.text) || entity.mentionText;
                    if (["check_mount"].includes(entity.type)) {
                        checkData[entity.type] = +checkData[entity.type];
                    }
                }
            }
            return _super.handle.call(this, fileMetaData, documentaiClient, checkData);
        });
    }
}
exports.ExtractorProcessorHandler = ExtractorProcessorHandler;
