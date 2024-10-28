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
exports.FirestoreSaveHandler = void 0;
const firestore_1 = require("@google-cloud/firestore");
const abstract_check_handler_1 = require("./abstract-check-handler");
class FirestoreSaveHandler extends abstract_check_handler_1.CheckHandler {
    constructor() {
        super(...arguments);
        this.fireStoreCollection = process.env.FIRESTORE_COLLECTION;
        this.firestore = new firestore_1.Firestore({
            projectId: process.env.PROJECT_ID,
        });
    }
    handle(fileMetaData, documentaiClient, checkData) {
        const _super = Object.create(null, {
            handle: { get: () => super.handle }
        });
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Saving to Firestore");
            checkData = this.replaceUndefinedWithNull(checkData);
            const docRef = this.firestore
                .collection(this.fireStoreCollection)
                .doc(checkData.id);
            checkData = this.replaceUndefinedWithNull(checkData);
            yield docRef.set(checkData);
            return _super.handle.call(this, fileMetaData, documentaiClient, checkData);
        });
    }
    replaceUndefinedWithNull(checkData) {
        return Object.fromEntries(Object.entries(checkData).map(([key, value]) => [
            key,
            value === undefined ? null : value,
        ]));
    }
}
exports.FirestoreSaveHandler = FirestoreSaveHandler;
