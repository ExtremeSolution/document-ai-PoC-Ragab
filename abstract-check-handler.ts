import {DocumentProcessorServiceClient} from "@google-cloud/documentai";
import {FileMetadata} from "@google-cloud/storage";
import {CheckDataType} from "./types";

export abstract class CheckHandler {
  protected nextHandler: CheckHandler;

  setNext(handler: CheckHandler): CheckHandler {
    this.nextHandler = handler;
    return handler;
  }

  handle(
    documentaiClient: DocumentProcessorServiceClient,
    fileBuffer: Buffer,
    fileMetadata: FileMetadata[],
    checkData: CheckDataType
  ) {
    if (this.nextHandler) {
      return this.nextHandler.handle(
        documentaiClient,
        fileBuffer,
        fileMetadata,
        checkData
      );
    }
    return null;
  }
}
