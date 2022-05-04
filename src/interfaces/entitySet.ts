import { AxiosPromise } from "axios";
import Entity from "./entity";
import Executable from "./executable";
import Queryable from "./queryable";

export default interface EntitySet {
  filter(filterquery: string): Queryable;
  select(fields: string | string[]): Queryable;
  paginate(page: number, rows: number): Executable;
  top(rowNumber: number): Queryable;
  skip(rowNumber: number): Queryable;
  count(): Executable;
  execute(): Promise<AxiosPromise>;
  entity(entity: string, id: number | string): Entity;
  getURL(): string;
}
