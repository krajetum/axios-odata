import { Axios } from "axios";
import { Query } from "./classes/query";

interface QueryData {}

class ODataClient implements QueryData {
  private axios: Axios;

  constructor(axios: Axios) {
    this.axios = axios;
  }

  query(): Query {
    return new Query(this.axios);
  }
}

export default ODataClient;
