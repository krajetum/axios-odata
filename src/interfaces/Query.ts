import { Axios, AxiosPromise } from "axios";
import { ODataListData } from "../models";

interface EntitySet {
  filter(filterquery: string): Queryable;
  select(): Queryable;
  count(): Executable;
  execute(): Promise<AxiosPromise>;
  entity(entity: string, id: number | string): Entity;
  getURL(): string;
}

interface Entity {
  entities(resource: string): EntitySet;
  value(): Executable;
  property(key: string): Entity;
  getURL(): string;
}

interface Queryable {
  filter(filterquery: string): Queryable;
  select(): Queryable;
  execute(): Promise<AxiosPromise>;
  count(): Executable;
  getURL(): string;
}

interface Executable {
  execute(): Promise<AxiosPromise>;

  getURL(): string;
}

export class Query implements EntitySet, Entity, Queryable, Executable {
  private url: string;
  private axios: Axios;
  private parameters: any;

  constructor(axios: Axios) {
    this.url = "";
    this.axios = axios;
    this.parameters = {};
  }
  property(key: string): Entity {
    this.url += `/${key}`;
    return this as Entity;
  }

  /**
   *
   * @param entity entity to inspect
   * @param id id of the entity to retrieve
   * @returns Entity interface
   */
  entity(entity: string, id: number | string): Entity {
    this.url += `/${entity}(${typeof id === "number" ? id : `'${id}'`})`;
    return this as Entity;
  }

  entities(resource: string): EntitySet {
    this.url += `/${resource}`;
    return this as EntitySet;
  }

  filter(filterquery: string): Queryable {
    let filter = this.parameters["$filter"];
    if (filter === undefined) {
      filter = filterquery;
    } else {
      filter = filter + ` and ${filterquery}`;
    }
    this.parameters["$filter"] = filter;
    return this as Queryable;
  }

  select(): Queryable {
    throw new Error("Method not implemented.");
    return this as Queryable;
  }

  count(): Executable {
    this.url += "/$count";
    return this as Executable;
  }

  async execute(): Promise<AxiosPromise> {
    return this.axios.get(this.url, {
      params: this.parameters,
    });
  }

  value(): Executable {
    this.url += "/$value";
    return this as Executable;
  }

  getURL(): string {
    return this.url;
  }
}
