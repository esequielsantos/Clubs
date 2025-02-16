# API Documentation

## Overview

This API is designed to help manage a Rotary Club, including members, president, secretary, treasurers, and other profiles. It provides endpoints to manage and retrieve information about the club's members and their roles.

## Getting Started

### Installation

To install the necessary dependencies, run:

```bash
npm install
```

### Running the Application

To start the application in development mode, run:

```bash
npm run start:dev
```

To start the application in production mode, run:

```bash
npm run start:prod
```

### Environment Configuration

Ensure you have a `.env` file in the root directory with the necessary environment variables. For example:

```
DATABASE_URL=sqlite://club.db
PORT=3100
```

## API Endpoints

### Members

#### Get All Members

**Endpoint:** `GET /members`

**Description:** Retrieves a list of all members in the club.

**Response:**

```json
[
  {
    "id": 1,
    "name": "John Doe",
    "admit_date": "2023-01-01T00:00:00.000Z",
    "sponsor_id": 2,
    "birthday": "1990-01-01T00:00:00.000Z",
    "phone": "123-456-7890",
    "email": "john.doe@example.com",
    "rotary_id": 12345,
    "profile": "President",
    "monthly_fee_division_id": 3,
    "honorary": false
  }
]
```

#### Get Member by ID

**Endpoint:** `GET /members/:id`

**Description:** Retrieves details of a specific member by their ID.

**Response:**

```json
{
  "id": 1,
  "name": "John Doe",
  "admit_date": "2023-01-01T00:00:00.000Z",
  "sponsor_id": 2,
  "birthday": "1990-01-01T00:00:00.000Z",
  "phone": "123-456-7890",
  "email": "john.doe@example.com",
  "rotary_id": 12345,
  "profile": "President",
  "monthly_fee_division_id": 3,
  "honorary": false
}
```

#### Add a New Member

**Endpoint:** `POST /members`

**Description:** Adds a new member to the club.

**Request Body:**

```json
{
  "name": "Jane Doe",
  "admit_date": "2023-02-01T00:00:00.000Z",
  "sponsor_id": 1,
  "birthday": "1992-02-01T00:00:00.000Z",
  "phone": "987-654-3210",
  "email": "jane.doe@example.com",
  "rotary_id": 54321,
  "profile": "Secretary",
  "monthly_fee_division_id": 2,
  "honorary": false
}
```

**Response:**

```json
{
  "id": 2,
  "name": "Jane Doe",
  "admit_date": "2023-02-01T00:00:00.000Z",
  "sponsor_id": 1,
  "birthday": "1992-02-01T00:00:00.000Z",
  "phone": "987-654-3210",
  "email": "jane.doe@example.com",
  "rotary_id": 54321,
  "profile": "Secretary",
  "monthly_fee_division_id": 2,
  "honorary": false
}
```

### Profiles

#### Get All Profiles

**Endpoint:** `GET /profiles`

**Description:** Retrieves a list of all profiles in the club.

**Response:**

```json
[
  {
    "id": 1,
    "name": "President"
  },
  {
    "id": 2,
    "name": "Secretary"
  },
  {
    "id": 3,
    "name": "Treasurer"
  }
]
```

## Managing Your Rotary Club

This software allows you to efficiently manage your Rotary Club by providing a centralized system to keep track of members, their roles, and other important information. You can easily add new members, update their details, and retrieve information about specific members or profiles.

By using this API, you can ensure that your club's data is organized and accessible, making it easier to manage the club's activities and responsibilities.
