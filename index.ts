import {DocumentProcessorServiceClient} from "@google-cloud/documentai";
import * as functions from "@google-cloud/functions-framework";
import {File, Storage} from "@google-cloud/storage";
import * as dotenv from "dotenv";
dotenv.config();

import {ClassifierProcessorHandler} from "./classifier-processor-handler";
import {ExtractorProcessorHandler} from "./extract-processor-handler";
import {FirestoreSaveHandler} from "./firestore-handler";
import {CheckDataType} from "./types";
import {ImageValidationHandler} from "./validation";

functions.cloudEvent("helloGCS", async cloudEvent => {
  console.log(`Event ID: ${cloudEvent.id}`);
  console.log(`Event Type: ${cloudEvent.type}`);

  try {
    const file = cloudEvent.data as File;
    const contentType = (file as any).contentType as string;
    console.log("Content Type: ", contentType);

    const handler = new ImageValidationHandler();
    const documentaiClient = new DocumentProcessorServiceClient();
    console.log(`Trying with file: ${file.name}`);

    let checkData: CheckDataType = {id: file.name} as any;

    handler
      .setNext(new ClassifierProcessorHandler())
      .setNext(new ExtractorProcessorHandler())
      .setNext(new FirestoreSaveHandler());

    handler.handle(
      {contentType: contentType, name: file.name},
      documentaiClient,
      checkData
    );
  } catch (err) {
    console.log("Error: ", err?.message);
    throw err;
  }
});
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
//   "ac49b92b-360a-4a46-a4b4-5321ae331331_ca46add6-0422-499b-a843-65303613f183_ES17092024.jpg"
// );
