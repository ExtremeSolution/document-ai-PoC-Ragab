export type CheckDataType = {
  id: string;
  check_number: number;
  check_mount: number;
  currency: string;
  date: string;
  payer_name: string;
  isCancelled: boolean;
};

export type LocalMetadataType = {
  contentType: string;
  name: string;
};
