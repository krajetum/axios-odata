import { Axios, AxiosPromise } from "axios";
import { ODataListData } from "../models";

interface EntitySet {
  filter(filterquery: string): Queryable;
  select(fields: string | string[]): Queryable;
  paginate(page: number, rows: number): Executable;
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
  select(fields: string | string[]): Queryable;
  paginate(page: number, rows: number): Executable;
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
  paginate(page: number, rows: number): Executable {
    this.parameters["$top"] = rows;
    this.parameters["$skip"] = (page - 1) * rows;
    return this as Executable;
  }
  property(key: string): Entity {
    this.url += `/${key}`;
    return this as Entity;
  }

  /**
   * Retrieves a single entity
   * @param entity entity to inspect
   * @param id id of the entity to retrieve
   * @returns Entity interface
   */
  entity(entity: string, id: number | string): Entity {
    this.url += `/${entity}(${typeof id === "number" ? id : `'${id}'`})`;
    return this as Entity;
  }

  /**
   *
   * Retrieves a collection of entities
   *
   * @param resource resource to query
   * @returns EntitySet
   */
  entities(resource: string): EntitySet {
    this.url += `/${resource}`;
    return this as EntitySet;
  }
  /**
   * Applies a filter to the query.
   * All the concatenated filters are in AND
   * @param filterquery filter to apply
   * @returns
   */
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

  select(fields: string | string[]): Queryable {
    let params = this.parameters["$select"] as string;

    if (params === undefined) {
      if (typeof fields === "string") {
        params = fields;
      } else {
        params = "";
        for (let field of fields as string[]) {
          params += field + ", ";
        }
        params = params.slice(0, -2);
      }
    } else {
      if (typeof fields === "string") {
        params += fields;
      } else {
        for (let field of fields as string[]) {
          params += field + ", ";
        }
        params = params.slice(0, -2);
      }
    }

    this.parameters["$select"] = params;
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
