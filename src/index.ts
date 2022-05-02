import { Axios } from "axios";
import { Query } from "./interfaces/Query";

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
