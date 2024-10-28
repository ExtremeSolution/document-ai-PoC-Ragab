"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckHandler = void 0;
class CheckHandler {
    setNext(handler) {
        this.nextHandler = handler;
        return handler;
    }
    handle(fileMetaData, documentaiClient, checkData) {
        if (this.nextHandler) {
            return this.nextHandler.handle(fileMetaData, documentaiClient, checkData);
        }
        return null;
    }
}
exports.CheckHandler = CheckHandler;
