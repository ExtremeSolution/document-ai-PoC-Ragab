import {DocumentProcessorServiceClient} from "@google-cloud/documentai";
import {FileMetadata} from "@google-cloud/storage";
import {CheckDataType} from "./types";
import {Firestore} from "@google-cloud/firestore";
import {CheckHandler} from "./abstract-check-handler";
class ImageValidationHandler extends CheckHandler {
  handle(
    documentaiClient: DocumentProcessorServiceClient,
    fileBuffer: Buffer,
    fileMetadata: FileMetadata[],
    checkData: CheckDataType
  ) {
    console.log("trying to validate the file to validate the image");
    if (!this.isImage(fileMetadata)) {
      throw new Error("File is not an image");
    }
    return super.handle(documentaiClient, fileBuffer, fileMetadata, checkData);
  }
  isImage(fileMetadata: FileMetadata[]): boolean {
    return (
      fileMetadata?.length &&
      fileMetadata[0].contentType?.split("/")[0] === "image"
    );
  }
}

export {ImageValidationHandler};
