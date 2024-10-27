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

    const handler = new ImageValidationHandler();
    const documentaiClient = new DocumentProcessorServiceClient();
    const storage = new Storage({});
    const fileStorage = storage.bucket(process.env.GCP_BUCKET).file(file.name);
    console.log(`Trying with file: ${file.name}`);

    console.log("trying to get file metadata");

    let fileMetadata = await fileStorage.getMetadata();
    console.log("trying to download the file");

    const [fileBuffer] = await fileStorage.download();

    let checkData: CheckDataType = {id: file.name} as any;

    handler
      .setNext(new ClassifierProcessorHandler())
      .setNext(new ExtractorProcessorHandler())
      .setNext(new FirestoreSaveHandler());

    handler.handle(
      documentaiClient,
      fileBuffer,
      fileMetadata as any,
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
//   console.log("trying to download the file");
//   const [fileBuffer] = await fileStorage.download();

//   let checkData: CheckDataType = {
//     id: "3370c345-b120-4b80-b871-541d73a0ac5e_ES17092024_0002",
//   } as any;

//   handler
//     .setNext(new ClassifierProcessorHandler())
//     .setNext(new ExtractorProcessorHandler())
//     .setNext(new FirestoreSaveHandler());
//   handler.handle(documentaiClient, fileBuffer, fileMetadata as any, checkData);
// }

// main("60a2fbe8-4be4-4f87-a89a-fa60df961b5d_ES17092024_0004.jpg");
