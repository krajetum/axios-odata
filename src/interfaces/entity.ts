import EntitySet from "./entitySet";
import Executable from "./executable";

export default interface Entity {
  entities(resource: string): EntitySet;
  value(): Executable;
  property(key: string): Entity;
  getURL(): string;
}
