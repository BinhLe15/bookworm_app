
# Bookworm App

A bookstore website offering a variety of online books across diverse fields, designed for users to looking for their favorite book.


## Environment Variables

To run this project, you will need to add the following environment in .env.example variables to your .env file

`uv package manager`

`docker`

`alembic`

`pnpm`


## Setup and Installation

Clone this project

Navigate to bookwrom_app directory:

```bash
  cd bookwomr_app
```

To deploy this project create .env file base on .env.example and run

```bash
  docker compose up -d
```

## Running the Backend

Navigate to the backend directory:

```bash
  cd bookwomr_app/backend
```

Install dependencies:

```bash
  uv sync
```

Apply database migrations:

```bash
  alembic upgrade head
```

Activate the virtual environment:

```bash
  source .venv/bin/activate
```

Start the FastAPI development server:

```bash
  fast api dev app/main.py
```

## Running the Frontend

Navigate to the frontend directory:

```bash
  cd bookworm_app/frontend
```

Install dependencies:

```bash
  pnpm install
```

Start the development server:

```bash
  pnpm run dev
```