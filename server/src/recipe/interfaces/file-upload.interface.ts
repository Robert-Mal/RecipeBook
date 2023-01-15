import { Stream } from 'stream';

export interface FileUpload {
  filename: string;
  mimecode: string;
  encoding: string;
  createReadStream: () => Stream;
}
