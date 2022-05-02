# Axios OData Client

Axios OData Client is a Fluent interface to fetch data with axios using OData Protocol.

## Getting started

```javascript

import ODataClient from 'axios-odata'
import axios from 'axios'

const http = axios.create()

const oclient = new ODataClient(http)

```

### Basic Collection Fetch

```javascript

oclient.query()
       .entities("People")
       .execute()

```

### Basic Entity Fetch

```javascript

oclient.query()
       .entity("People", 'russel')
       .execute()

```

### Requesting complex property

```javascript

oclient.query()
       .entity("Airports", "KSFO")
       .property("Location")
```



## Donations

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/krajetum)
