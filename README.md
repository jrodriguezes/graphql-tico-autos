# GraphQL Tico Autos API

A NestJS GraphQL service that exposes vehicle records stored in MongoDB, including public lookup/filter queries and an owner-scoped query protected by JWT validation.

> **Status:** backend prototype / portfolio project. Read operations are implemented. Vehicle mutations, token issuance, deployment configuration, and production hardening are not yet included.

## Current Capabilities

- Query all vehicles.
- Query one vehicle by MongoDB identifier.
- Filter and paginate vehicles by brand, model, year, price, and status.
- Query vehicles belonging to the authenticated owner.
- Validate bearer JWTs through Passport.
- Generate the GraphQL schema from TypeScript decorators.
- Connect to MongoDB through Mongoose.
- Expose Apollo GraphQL at /graphql.

The service does not currently create users, log users in, issue tokens, or mutate vehicle records. The protected query expects a JWT issued by another trusted service using the same secret and the required claims.

## Tech Stack

- Node.js
- TypeScript 5
- NestJS 11
- GraphQL 16
- Apollo Server 5
- Mongoose 9 / MongoDB
- Passport and passport-jwt
- Jest

## Architecture

~~~text
GraphQL client
      │
      ▼
Apollo /graphql
      │
      ├── public vehicle queries
      │        │
      │        ▼
      │   VehiclesResolver
      │        │
      │        ▼
      │   VehiclesService ──> Mongoose ──> MongoDB
      │
      └── myVehicles
               │
               ▼
        Passport JWT guard
               │
               ▼
        ownerId-filtered service query
~~~

## GraphQL Operations

### All vehicles

~~~graphql
query GetVehicles {
  vehicles {
    _id
    ownerId
    brand
    model
    year
    price
    mileage
    status
    observations
    plateId
    imageUrl
  }
}
~~~

### One vehicle

~~~graphql
query GetVehicle($id: String!) {
  vehicle(id: $id) {
    _id
    brand
    model
    year
    price
  }
}
~~~

Variables:

~~~json
{
  "id": "REPLACE_WITH_A_MONGODB_OBJECT_ID"
}
~~~

### Filtered and paginated vehicles

~~~graphql
query FilterVehicles($filters: VehicleFiltersInput) {
  filteredVehicles(filters: $filters) {
    data {
      _id
      brand
      model
      year
      price
      status
    }
    total
    page
    limit
    totalPages
  }
}
~~~

Variables:

~~~json
{
  "filters": {
    "brand": "Toyota",
    "minYear": 2018,
    "maxPrice": 25000,
    "status": "available",
    "page": 1,
    "limit": 8
  }
}
~~~

### Authenticated owner's vehicles

~~~graphql
query MyVehicles {
  myVehicles {
    _id
    ownerId
    brand
    model
    year
    price
  }
}
~~~

Send the token as an HTTP header:

~~~json
{
  "Authorization": "Bearer YOUR_JWT"
}
~~~

The validated token payload must contain sub, numberId, and name. myVehicles uses numberId as the vehicle owner identifier.

## Project Structure

~~~text
backend-graphql-tico-autosii/
├── src/
│   ├── database/                   # MongoDB connection module
│   ├── modules/
│   │   ├── auth/                   # Passport JWT strategy
│   │   ├── graphql/                # GraphQL object and input types
│   │   └── vehicles/               # Schema, resolver, and service
│   ├── app.module.ts               # GraphQL and module composition
│   ├── main.ts                     # CORS and application bootstrap
│   └── schema.gql                  # Generated GraphQL schema
├── test/                           # End-to-end test configuration
├── package.json
└── tsconfig.json
~~~

## Local Development

### Requirements

- Node.js 20 or newer
- npm
- A reachable MongoDB database

### Installation

~~~bash
git clone https://github.com/jrodriguezes/graphql-tico-autos.git
cd graphql-tico-autos
npm install
~~~

Create a local .env file. The repository does not currently include an .env.example.

~~~env
DATABASE_URL=mongodb://127.0.0.1:27017/tico_autos
JWT_SECRET=replace_with_the_secret_used_by_the_token_issuer
PORT=3002
~~~

Start the development server:

~~~bash
npm run start:dev
~~~

Open http://localhost:3002/graphql. If PORT is omitted, the application defaults to 3002.

## Commands

~~~bash
npm run build        # Compile the NestJS application
npm run start:dev    # Start in watch mode
npm run start:prod   # Run the compiled dist/main entry point
npm test             # Run Jest unit tests
npm run test:e2e     # Run the configured e2e suite
npm run test:cov     # Generate test coverage
npm run lint         # ESLint with automatic fixes
npm run format       # Prettier with automatic writes
~~~

The lint and format commands modify source files. Review their diffs before committing.

## Testing Status

The repository has Jest and an end-to-end test scaffold, but the current e2e expectation still targets the default Nest Hello World route while this application exposes GraphQL and has no root controller. Treat the e2e suite as incomplete until it:

- Boots against an isolated test database.
- Sends GraphQL requests to /graphql.
- Covers filtering and pagination.
- Creates a signed test JWT for myVehicles.
- Verifies unauthorized access.
- Cleans up test records.

## Security and Production Readiness

Current development defaults require hardening before any public deployment:

- GraphQL Playground is enabled unconditionally.
- CORS is enabled without an origin allowlist.
- JWT verification falls back to an empty secret when JWT_SECRET is absent.
- No rate limiting, request complexity limit, or query-depth limit is configured.
- No authentication/token-issuance flow exists in this service.
- No input mutation authorization is needed yet because mutations are not implemented.
- Secrets must remain outside Git and should come from the deployment platform.
- Production logs must not include bearer tokens or personal vehicle-owner data.

Do not expose this API publicly until the environment is validated and the Playground, CORS, secrets, observability, and abuse controls are environment-aware.

## Known Limitations and Roadmap

- [ ] Add and document an .env.example with safe placeholders.
- [ ] Add vehicle create/update/delete mutations with validation and authorization.
- [ ] Decide whether authentication remains external or add a documented auth service integration.
- [ ] Make Playground and CORS environment-specific.
- [ ] Fail startup when required secrets or the database URL are missing.
- [ ] Add GraphQL depth/complexity controls and rate limiting.
- [ ] Replace the stale e2e test with GraphQL integration coverage.
- [ ] Add Docker and deployment configuration only after runtime requirements are finalized.
- [ ] Add CI for build, tests, and non-mutating lint checks.
- [ ] Publish a deployment URL only after production hardening.

## License

package.json marks the project as UNLICENSED. The repository is not offered under an open-source license.

## Author

[Jeremy Rodriguez](https://github.com/jrodriguezes)
