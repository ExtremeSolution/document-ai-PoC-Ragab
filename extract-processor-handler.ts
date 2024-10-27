import {DocumentProcessorServiceClient} from "@google-cloud/documentai";
import {CheckHandler} from "./abstract-check-handler";
import {FileMetadata} from "@google-cloud/storage";
import {CheckDataType} from "./types";

export class ExtractorProcessorHandler extends CheckHandler {
  checkFields = [
    "check_mount",
    "check_number",
    "currency",
    "date",
    "payer_name",
  ] as const;
  async handle(
    documentaiClient: DocumentProcessorServiceClient,
    fileBuffer: Buffer,
    fileMetadata: FileMetadata[],
    checkData: CheckDataType
  ) {
    if (checkData.isCancelled)
      return super.handle(
        documentaiClient,
        fileBuffer,
        fileMetadata,
        checkData
      );
    console.log("trying to process the extract processor");

    const processorName = `projects/${process.env.PROJECT_ID}/locations/${process.env.PROJECT_LOCATION}/processors/${process.env.EXTRACT_PROCESSOR_ID}`;
    const request = {
      name: processorName,
      rawDocument: {
        content: fileBuffer,
        mimeType: fileMetadata[0].contentType,
      },
    };
    const result = await documentaiClient.processDocument(request);
    console.log("get the result from the extract processor");

    for (let entity of result[0]?.document?.entities) {
      if (
        this.checkFields.includes(entity.type as any) &&
        !checkData[entity.type]
      ) {
        checkData[entity.type] =
          entity.normalizedValue?.text || entity.mentionText;
        if (["check_number", "check_mount"].includes(entity.type)) {
          checkData[entity.type] = +checkData[entity.type];
        }
      }
    }

    return super.handle(documentaiClient, fileBuffer, fileMetadata, checkData);
  }
}
