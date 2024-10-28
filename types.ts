export type CheckDataType = {
  id: string;
  check_number: string;
  check_mount: number;
  currency: string;
  date: string;
  pay_to: string;
  pay_from;
  isCancelled: boolean;
};

export type LocalMetadataType = {
  contentType: string;
  name: string;
};
