# Tico Autos Backend API

Backend application for Tico Autos built with [NestJS](https://nestjs.com/) and [GraphQL](https://graphql.org/). It provides a robust, scalable API for managing vehicles, implementing JWT-based authentication and MongoDB for data storage.

## Current Project Status
Active Development

## Problem it solves
This project serves as the backend infrastructure for a vehicle management platform (Tico Autos), providing secure and efficient data querying and manipulation through a GraphQL API, instead of traditional REST endpoints, minimizing over-fetching of data.

## Key Features
- **GraphQL API**: Powered by Apollo Server, providing a single and flexible data endpoint.
- **Authentication**: Secure JWT-based authentication using Passport.js.
- **Modular Architecture**: Built with NestJS, dividing the logic into isolated feature modules (`Auth`, `Vehicles`).
- **Database Integration**: MongoDB connection via Mongoose for flexible document storage.
- **Interactive Playground**: GraphQL Playground enabled for easy testing and exploration of the schema.

## Technologies Used
- **Node.js**
- **NestJS** (`^11.0.1`)
- **GraphQL** (`^16.13.2`)
- **Apollo Server** (`^5.5.0`)
- **MongoDB & Mongoose** (`^9.6.1`)
- **TypeScript** (`^5.7.3`)
- **Jest** (for Testing)

## General Architecture

```mermaid
graph TD
    Client[Client App] -->|GraphQL Queries/Mutations| API[NestJS GraphQL API]
    API --> Auth[Auth Module - JWT]
    API --> Vehicles[Vehicles Module]
    Vehicles --> DB[(MongoDB)]
    Auth --> DB
```

The system follows a modular architecture based on NestJS. Requests are received via the `/graphql` endpoint, where Apollo Server processes them. The `AppModule` coordinates the database connection (`DatabaseModule`) and feature modules like `VehiclesModule` and `AuthModule`.

## Main Repository Structure

```text
backend-graphql-tico-autosii/
├── src/
│   ├── modules/
│   │   ├── auth/          # Authentication logic and JWT strategies
│   │   ├── graphql/       # Global GraphQL configurations
│   │   └── vehicles/      # Vehicle management resolvers and services
│   ├── database/          # MongoDB connection setup
│   ├── app.module.ts      # Main application module
│   ├── main.ts            # Application entry point
│   └── schema.gql         # Auto-generated GraphQL schema
├── test/                  # E2E tests and Jest configuration
├── .env                   # Environment variables (not tracked by git)
└── package.json           # Project dependencies and scripts
```

## Prerequisites
Before you begin, ensure you have met the following requirements:
- **Node.js** (v20+ recommended)
- **npm** (v10+ recommended)
- A running **MongoDB** instance (local or Atlas)

## Step-by-Step Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd backend-graphql-tico-autosii
   ```

2. **Install the dependencies:**
   ```bash
   npm install
   ```

## Environment Configuration

Create a `.env` file in the root of the project. You can use the following table to configure your environment variables:

| Name | Required | Purpose | Example |
| :--- | :---: | :--- | :--- |
| `PORT` | Optional | Port on which the server will run (defaults to 3002). | `3002` |
| `DATABASE_URL` | Yes | MongoDB connection string. | `mongodb+srv://user:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority` |
| `JWT_SECRET` | Yes | Secret key used to sign JSON Web Tokens. | `my_super_secret_jwt_key_123!` |

> **⚠️ Warning**: Never commit your actual `.env` file or hardcode credentials into the repository.

## How to Run the Project in Development

Execute the following command from the root directory to start the server in watch mode:

```bash
npm run start:dev
```
The server will start at `http://localhost:3002` by default. 
You can access the **GraphQL Playground** at `http://localhost:3002/graphql`.

## How to Generate the Production Build

1. **Compile the application:**
   ```bash
   npm run build
   ```
   This will output the compiled files into the `dist/` directory.

2. **Run the production build:**
   ```bash
   npm run start:prod
   ```

## API and Endpoints

Because this is a GraphQL application, there is only one main endpoint:
- **`POST /graphql`**: Main endpoint for all queries and mutations.
- **`GET /graphql`**: Interactive GraphQL Playground (enabled in development).

The full API schema is automatically generated and can be found in `src/schema.gql`.

## Tests and Quality Control

The project uses Jest as its testing framework. You can run the following commands from the root directory to execute tests:

- **Run unit tests:**
  ```bash
  npm run test
  ```
- **Run tests in watch mode:**
  ```bash
  npm run test:watch
  ```
- **Run test coverage:**
  ```bash
  npm run test:cov
  ```
- **Run end-to-end (e2e) tests:**
  ```bash
  npm run test:e2e
  ```
- **Run linter:**
  ```bash
  npm run lint
  ```

## Pending Confirmation / Missing Data
- **Deployment setup**: Explicit deployment pipelines (e.g., Dockerfile, CI/CD scripts) were not found in the root directory.
- **License & Maintainers**: No specific `LICENSE` file or identified maintainer information exists in the repository.
