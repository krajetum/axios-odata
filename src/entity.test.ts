import ODataClient from ".";
const URL = require("url");
const axios = require("axios");

describe("url generation", () => {
  let client: ODataClient;

  beforeAll(() => {
    const http = axios.create({
      baseURL:
        "https://services.odata.org/TripPinRESTierService/(S(dnx33crwjgtxair2gvwwxbnu))/",
    });
    client = new ODataClient(http);
  });

  test("Requesting EntitySet", () => {
    let url = client.query().entities("People").getURL();
    expect(url).toBe("/People");
  });

  test("Requesting EntitySet", () => {
    let url = client.query().entity("People", "russellwhyte").getURL();

    expect(url).toBe("/People('russellwhyte')");
  });

  test("Requesting complex property", () => {
    let url = client
      .query()
      .entity("Airports", "KSFO")
      .property("Location")
      .getURL();
    expect(url).toBe("/Airports('KSFO')/Location");
  });

  test("Requesting collection of complex property", () => {
    let url = client
      .query()
      .entity("People", "russellwhyte")
      .entities("AddressInfo")
      .getURL();
    expect(url).toBe("/People('russellwhyte')/AddressInfo");
  });

  test("Requesting a Single Primitive Property Raw Value", () => {
    let url = client
      .query()
      .entity("Airports", "KSFO")
      .property("Name")
      .value()
      .getURL();
    expect(url).toBe("/Airports('KSFO')/Name/$value");
  });

  test("Requesting a Enum Type Property Raw Value", () => {
    let url = client
      .query()
      .entity("People", "russellwhyte")
      .property("Gender")
      .value()
      .getURL();
    expect(url).toBe("/People('russellwhyte')/Gender/$value");
  });
});

describe("query data", () => {
  let client: ODataClient;

  beforeAll(() => {
    const http = axios.create({
      baseURL:
        "https://services.odata.org/TripPinRESTierService/(S(dnx33crwjgtxair2gvwwxbnu))/",
    });
    client = new ODataClient(http);
  });

  test("System Query Option $filter", async () => {
    try {
      let url = await client
        .query()
        .entities("People")
        .filter("FirstName eq 'Scott'")
        .execute();
      expect(url.request.path).toBe(
        "/TripPinRESTierService/(S(dnx33crwjgtxair2gvwwxbnu))/People?$filter=FirstName+eq+'Scott'"
      );
    } catch (ex) {
      throw ex;
    }
  });

  test("Filter on Complex Type Property", async () => {
    try {
      let url = await client
        .query()
        .entities("Airports")
        .filter("contains(Location/Address, 'San Francisco')")
        .execute();

      expect(url.request.path).toBe(
        "/TripPinRESTierService/(S(dnx33crwjgtxair2gvwwxbnu))/Airports?$filter=contains(Location%2FAddress,+'San+Francisco')"
      );
    } catch (ex: any) {
      throw ex;
    }
  });

  /*
  test("Filter on Enum Properties", async () => {
    try {
      let url = await client
        .query()
        .entities("People")
        .filter(
          "Gender eq Microsoft.OData.Service.Sample.TrippinInMemory.Models.PersonGender'Female'"
        )
        .execute();

      expect(url.request.path).toBe(
        "/TripPinRESTierService/(S(dnx33crwjgtxair2gvwwxbnu))/People?$filter=Gender+eq+Microsoft.OData.Service.Sample.TrippinInMemory.Models.PersonGender'Female'"
      );
    } catch (ex: any) {
      throw ex;
    }
  });
*/
});
