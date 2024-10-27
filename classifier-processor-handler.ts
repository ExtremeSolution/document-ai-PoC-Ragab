import {DocumentProcessorServiceClient} from "@google-cloud/documentai";
import {FileMetadata} from "@google-cloud/storage";
import {CheckDataType} from "./types";
import {CheckHandler} from "./abstract-check-handler";

export class ClassifierProcessorHandler extends CheckHandler {
  checkStatus: string[] = ["valid", "invalid"];
  async handle(
    documentaiClient: DocumentProcessorServiceClient,
    fileBuffer: Buffer,
    fileMetadata: FileMetadata[],
    checkData: CheckDataType
  ) {
    try {
      const processorName = `projects/${process.env.PROJECT_ID}/locations/${process.env.PROJECT_LOCATION}/processors/${process.env.CLASSIFIER_PROCESSOR_ID}`;
      const request = {
        name: processorName,
        rawDocument: {
          content: fileBuffer,
          mimeType: fileMetadata[0].contentType,
        },
      };
      console.log("trying to process the classifier processor");
      const result = await documentaiClient.processDocument(request);
      console.log("get the result from the classifier processor");
      if (result?.length && result[0]?.document?.entities?.length) {
        checkData.isCancelled =
          (result[0].document.entities[0].confidence >
          result[0].document.entities[1].confidence
            ? result[0].document.entities[0].type
            : result[0].document.entities[1].type) == "invalid";
        return super.handle(
          documentaiClient,
          fileBuffer,
          fileMetadata,
          checkData
        );
      } else {
        throw new Error("Invalid Image");
      }
    } catch (err) {
      throw err;
    }
  }
}
