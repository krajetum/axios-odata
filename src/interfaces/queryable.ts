import { AxiosPromise } from "axios";
import Executable from "./executable";

export default interface Queryable {
  filter(filterquery: string): Queryable;
  select(fields: string | string[]): Queryable;
  paginate(page: number, rows: number): Executable;
  execute(): Promise<AxiosPromise>;
  count(): Executable;
  getURL(): string;
}
