import {DocumentProcessorServiceClient} from "@google-cloud/documentai";
import {FileMetadata} from "@google-cloud/storage";
import {CheckHandler} from "./abstract-check-handler";
import {CheckDataType, LocalMetadataType} from "./types";
class ImageValidationHandler extends CheckHandler {
  handle(
    fileMetaData: LocalMetadataType,
    documentaiClient: DocumentProcessorServiceClient,
    checkData: CheckDataType
  ) {
    console.log("trying to validate the file to validate the image");
    if (!this.isImage(fileMetaData.contentType)) {
      throw new Error("File is not an image");
    }
    return super.handle(fileMetaData, documentaiClient, checkData);
  }
  isImage(contentType: string): boolean {
    return contentType.startsWith("image");
  }
}

export {ImageValidationHandler};
