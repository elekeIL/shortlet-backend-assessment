# ---- Shortlet Backend Assessment  -----

## Overview
This project is a REST API built using NestJS and TypeScript that integrates data from the REST Countries API. The design emphasizes robust data handling, secure and scalable API design and performance optimization.


## Setup Instructions
Prerequisites
Before you begin, ensure you have the following installed on your local machine:

- Node.js (v16.x or later)

- npm (v7.x or later)

- TypeScript (v5.1.3 or later)


### Environment Configuration

1. Clone the repository:

```bash
$ git clone https://github.com/elekeIL/shortlet-backend-assessment.git
$ cd shortlet-backend-assessment
```
2. Install the dependencies:

 ```bash
$ npm install
```

3. Create a .env file in the root directory and add the following environment variables:

   REST_COUNTRIES_API_URL=https://restcountries.com/v3.1

   REST_CALL_TIME_OUT=60000



### Running the Application

1. Start the application
```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
2.The API will be available at http://localhost:3010

### Running Tests

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

## Swagger Documentation
To explore the API endpoints and see detailed documentation, navigate to the Swagger UI at http://localhost:3010/api/docs. This interactive interface allows you to test the API endpoints and view the available operations and responses.

## API Endpoints


- GET /countries: Retrieve a list of countries with pagination and optional filtering by region or population size.

- GET /countries/: Retrieve detailed information for a specific country, including its languages, population, area, and bordering countries.

- GET /regions: Retrieve a list of regions and the countries within each region, with additional aggregated data such as the total population of the region.

- GET /languages: Retrieve a list of languages and the countries where they are spoken. Include the total number of speakers globally for each language.

- GET /statistics: Provide aggregated statistics such as the total number of countries, the largest country by area, the smallest by population, and the most widely spoken language.

## Implementation Approach

### Data Integration
- #### Fetching Data: The service fetches data from the REST Countries API and processes it to provide meaningful information through the API endpoints.
- #### Caching: Implemented caching to reduce the number of API calls to the REST Countries API and improve performance.
### Security
- #### Error Handling: Comprehensive error handling to manage issues like data inconsistency and API unavailability.
- #### Rate Limiting: Implemented rate limiting to prevent abuse and ensure the API remains responsive.

### Performance
- #### Pagination: Implemented pagination to handle large datasets efficiently.
- #### Filtering and Sorting: Provided filtering options by region and population size, and sorted results alphabetically.

## Interesting Challenges and Features

### Challenges
- #### Data Consistency: Ensuring the integrity and consistency of data fetched from the REST Countries API.
- #### Performance Optimization: Implementing efficient caching and data processing mechanisms.

### Features
- #### Detailed Data: Provided detailed country data including languages, population, borders, and geographical coordinates.
- #### Aggregated Data: Offered aggregated statistics and data for regions and languages, enhancing the usability of the API.

## Aspects I am Particularly Proud of
- #### Comprehensive Error Handling: The service handles various error scenarios gracefully, providing meaningful error messages to clients.
- #### Efficient Data Management: The use of caching and efficient data processing techniques to deliver fast and reliable responses.
- #### Implementing comprehensive unit and integration tests to ensure optimal functionality of services and endpoints across a vast array of scenarios.


## Potential Improvements and Additional Features
If I had more time, I would consider implementing the following improvements and additional features:

- #### Authentication and Authorization: Add user authentication and authorization to secure the API endpoints.
- #### More Detailed Statistics: Provide more detailed and complex statistics on countries and regions.
- #### Extended Filtering Options: Add more filtering options, such as filtering by language or currency.
- #### Enhanced Caching: Implement more advanced caching strategies to further improve performance.
