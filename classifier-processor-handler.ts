import {DocumentProcessorServiceClient} from "@google-cloud/documentai";
import {FileMetadata} from "@google-cloud/storage";
import {CheckDataType, LocalMetadataType} from "./types";
import {CheckHandler} from "./abstract-check-handler";

export class ClassifierProcessorHandler extends CheckHandler {
  checkStatus: string[] = ["valid", "invalid"];
  async handle(
    fileMetaData: LocalMetadataType,
    documentaiClient: DocumentProcessorServiceClient,
    checkData: CheckDataType
  ) {
    try {
      const processorName = `projects/${process.env.PROJECT_ID}/locations/${process.env.PROJECT_LOCATION}/processors/9e2b9c4a2d83618a/processorVersions/${process.env.CLASSIFIER_PROCESSOR_VERSION_ID}`;
      // const request = {
      //   name: processorName,
      //   rawDocument: {
      //     content: fileBuffer,
      //     mimeType: fileMetadata[0].contentType,
      //   },
      // };
      console.log("trying to process the classifier processor");
      const result = await documentaiClient.processDocument({
        name: processorName,
        gcsDocument: {
          gcsUri: `gs://${process.env.GCP_BUCKET}/${fileMetaData.name}`,
          mimeType: fileMetaData.contentType,
        },
      });
      console.log("get the result from the classifier processor");
      if (result?.length && result[0]?.document?.entities?.length) {
        checkData.isCancelled =
          (result[0].document.entities[0].confidence >
          result[0].document.entities[1].confidence
            ? result[0].document.entities[0].type
            : result[0].document.entities[1].type) == "invalid";
        return super.handle(fileMetaData, documentaiClient, checkData);
      } else {
        throw new Error("Invalid Image");
      }
    } catch (err) {
      throw err;
    }
  }
}
