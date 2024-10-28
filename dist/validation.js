"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageValidationHandler = void 0;
const abstract_check_handler_1 = require("./abstract-check-handler");
class ImageValidationHandler extends abstract_check_handler_1.CheckHandler {
    handle(fileMetaData, documentaiClient, checkData) {
        console.log("trying to validate the file to validate the image");
        if (!this.isImage(fileMetaData.contentType)) {
            throw new Error("File is not an image");
        }
        return super.handle(fileMetaData, documentaiClient, checkData);
    }
    isImage(contentType) {
        return contentType.startsWith("image");
    }
}
exports.ImageValidationHandler = ImageValidationHandler;
