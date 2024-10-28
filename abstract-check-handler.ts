import {DocumentProcessorServiceClient} from "@google-cloud/documentai";
import {CheckDataType, LocalMetadataType} from "./types";

export abstract class CheckHandler {
  protected nextHandler: CheckHandler;

  setNext(handler: CheckHandler): CheckHandler {
    this.nextHandler = handler;
    return handler;
  }

  handle(
    fileMetaData: LocalMetadataType,
    documentaiClient: DocumentProcessorServiceClient,
    checkData: CheckDataType
  ) {
    if (this.nextHandler) {
      return this.nextHandler.handle(fileMetaData, documentaiClient, checkData);
    }
    return null;
  }
}
