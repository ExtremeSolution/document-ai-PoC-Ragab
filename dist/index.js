"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const documentai_1 = require("@google-cloud/documentai");
const functions = __importStar(require("@google-cloud/functions-framework"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const classifier_processor_handler_1 = require("./classifier-processor-handler");
const extract_processor_handler_1 = require("./extract-processor-handler");
const firestore_handler_1 = require("./firestore-handler");
const validation_1 = require("./validation");
functions.cloudEvent("helloGCS", (cloudEvent) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Event ID: ${cloudEvent.id}`);
    console.log(`Event Type: ${cloudEvent.type}`);
    try {
        const file = cloudEvent.data;
        const contentType = file.contentType;
        console.log("Content Type: ", contentType);
        const handler = new validation_1.ImageValidationHandler();
        const documentaiClient = new documentai_1.DocumentProcessorServiceClient();
        console.log(`Trying with file: ${file.name}`);
        let checkData = { id: file.name };
        handler
            .setNext(new classifier_processor_handler_1.ClassifierProcessorHandler())
            .setNext(new extract_processor_handler_1.ExtractorProcessorHandler())
            .setNext(new firestore_handler_1.FirestoreSaveHandler());
        handler.handle({ contentType: contentType, name: file.name }, documentaiClient, checkData);
    }
    catch (err) {
        console.log("Error: ", err === null || err === void 0 ? void 0 : err.message);
        throw err;
    }
}));
// async function main(filename: string) {
//   // const file = cloudEvent.data as File;
//   const handler = new ImageValidationHandler();
//   const documentaiClient = new DocumentProcessorServiceClient();
//   const storage = new Storage({});
//   const fileStorage = storage.bucket(process.env.GCP_BUCKET).file(filename);
//   console.log("trying to get file metadata");
//   let fileMetadata = await fileStorage.getMetadata();
//   let checkData: CheckDataType = {
//     id: filename.split(".")[0],
//   } as any;
//   handler
//     .setNext(new ClassifierProcessorHandler())
//     .setNext(new ExtractorProcessorHandler())
//     .setNext(new FirestoreSaveHandler());
//   handler.handle(
//     {name: filename, contentType: fileMetadata[0].contentType},
//     documentaiClient,
//     checkData
//   );
// }
// main(
//   // "ac49b92b-360a-4a46-a4b4-5321ae331331_ca46add6-0422-499b-a843-65303613f183_ES17092024.jpg"
//   "0849e305-921a-49be-b4c5-ce4e4659435a_60a2fbe8-4be4-4f87-a89a-fa60df961b5d_ES17092024_0004.jpg"
// );
