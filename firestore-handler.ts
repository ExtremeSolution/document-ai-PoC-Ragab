import {Firestore} from "@google-cloud/firestore";
import {CheckDataType, LocalMetadataType} from "./types";
import {DocumentProcessorServiceClient} from "@google-cloud/documentai";
import {FileMetadata} from "@google-cloud/storage";
import {CheckHandler} from "./abstract-check-handler";

export class FirestoreSaveHandler extends CheckHandler {
  fireStoreCollection = process.env.FIRESTORE_COLLECTION;
  firestore = new Firestore({
    projectId: process.env.PROJECT_ID,
  });
  async handle(
    fileMetaData: LocalMetadataType,
    documentaiClient: DocumentProcessorServiceClient,
    checkData: CheckDataType
  ) {
    console.log("Saving to Firestore");
    checkData = this.replaceUndefinedWithNull(checkData);
    const docRef = this.firestore
      .collection(this.fireStoreCollection)
      .doc(checkData.id);
    checkData = this.replaceUndefinedWithNull(checkData);
    await docRef.set(checkData);

    return super.handle(fileMetaData, documentaiClient, checkData);
  }
  private replaceUndefinedWithNull(checkData: CheckDataType): CheckDataType {
    return Object.fromEntries(
      Object.entries(checkData).map(([key, value]) => [
        key,
        value === undefined ? null : value,
      ])
    ) as CheckDataType;
  }
}
