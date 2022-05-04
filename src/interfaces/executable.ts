import { AxiosPromise } from "axios";

export default interface Executable {
  execute(): Promise<AxiosPromise>;
  getURL(): string;
}
