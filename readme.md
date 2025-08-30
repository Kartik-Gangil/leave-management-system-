
# Leave Management System

An interactive guide to understanding and running the Leave Management System project.

## Table of Contents

- [Project Overview](#project-overview)
- [Getting Started](#getting-started)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Database Setup](#database-setup)
- [Scripts](#scripts)
- [Dependencies](#dependencies)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

The Leave Management System is designed to streamline and automate the process of requesting, approving, and tracking employee leave. It consists of a backend (Node.js with Express), a frontend (React), and a PostgreSQL database.

## Getting Started

To get started with the Leave Management System, follow these steps:

1.  **Clone the repository:**  (Add your repository link here)
    ```bash
    git clone <repository_link>
    cd leave-management-system
    ```

2.  **Install Docker:** Ensure Docker is installed and running on your machine.

## Backend Setup

1.  **Navigate to the `backend` directory.**
2.  **Install dependencies:**
    ```bash
    cd backend
    npm install
    ```
3.  **Set up environment variables:** Create a `.env` file in the `backend` directory.  You'll need to configure the necessary environment variables based on your project needs.  Consider including:

    ```
    DATABASE_URL="postgresql://techcarrel:123@localhost:5432/LMD?schema=public" #Or your db URL. Adjust as needed.
    PORT=3000 # Or any preferred port
    JWT_SECRET="your_jwt_secret_key" # Replace with a strong secret
    ```

4.  **Run migrations:**  Use Prisma to run database migrations.

    ```bash
    npx prisma migrate dev
    npx prisma generate
    ```

5.  **Start the backend server:**
    ```bash
    npm run dev #For development with nodemon
    ```
    Or
     ```bash
    npm run start #For production
    ```
    The backend server will start at `http://localhost:3000` (or the port you specified).

## Frontend Setup

1.  **Navigate to the `leave-management-dashboard` directory.**
2.  **Install dependencies:**
    ```bash
    cd leave-management-dashboard
    npm install
    ```
3.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The frontend application will be served at `http://localhost:5173` (or another port, as indicated by Vite).

## Database Setup

The project uses PostgreSQL as the database.

1.  **Using Docker Compose:**
    *   Create a `docker-compose.yml` file in the project root directory with the following content:

        ```yaml
        version: "3.9"
        services:
          postgres:
            image: postgres:17
            container_name: postgres
            environment:
              POSTGRES_USER: techcarrel
              POSTGRES_PASSWORD: 123
              POSTGRES_DB: LMD
            ports:
              - "5432:5432"
            volumes:
              - postgres_data:/var/lib/postgresql/data

        volumes:
          postgres_data:
        ```

    *   Run the Docker Compose command:

        ```bash
        docker-compose up -d
        ```

2.  **Direct PostgreSQL Installation:** If you are not using Docker, ensure PostgreSQL is installed and running on your system.  Create a database named `LMD` and a user `techcarrel` with password `123`.  Update the `.env` file with the correct connection details.

**Important:**  For production, use strong, unique passwords and consider more robust database management strategies.

## Scripts

### Backend Scripts

*   `start`:  Runs the backend server using `node index.js`.
*   `dev`: Runs the backend server in development mode using `nodemon index.js` (automatic restart on file changes).
*   `test`:  Placeholder for running tests.

### Frontend Scripts

*   `dev`: Starts the Vite development server.
*   `build`: Builds the production-ready application using `tsc -b && vite build`.
*   `lint`:  Runs ESLint to check code quality.
*   `preview`: Previews the production build using Vite.

## Dependencies

### Backend Dependencies

*   `@prisma/client`:  ORM for database interactions.
*   `bcryptjs`: For password hashing.
*   `cors`:  For enabling Cross-Origin Resource Sharing.
*   `dotenv`:  For loading environment variables.
*   `express`:  Web framework.
*   `express-router`: Handles the routing for express app.
*   `jsonwebtoken`:  For creating and verifying JSON Web Tokens (JWTs).
*   `multer`:  For handling file uploads.
*   `nanoid`:  For generating unique IDs.
*   `prisma`:  Prisma CLI.
*   `uuid`: For generating unique identifiers.

### Frontend Dependencies

*   `axios`:  For making HTTP requests.
*   `react`:  JavaScript library for building user interfaces.
*   `react-dom`:  Entry point to the DOM and server rendering methods for React.
*   `react-router-dom`:  For routing within the React application.
*   `tailwindcss`:  CSS framework.
*   `@tailwindcss/vite`:  Integrates Tailwind CSS with Vite.

### Frontend DevDependencies

*   `@eslint/js`:  JavaScript linter.
*   `@types/react`:  TypeScript definitions for React.
*   `@types/react-dom`:  TypeScript definitions for React DOM.
*   `@vitejs/plugin-react`:  Vite plugin for React.
*   `eslint`:  JavaScript linter.
*   `eslint-plugin-react-hooks`:  ESLint plugin for React Hooks.
*   `eslint-plugin-react-refresh`:  ESLint plugin for React Fast Refresh.
*   `globals`: Defines globals for JavaScript environments.
*   `typescript`:  TypeScript compiler.
*   `typescript-eslint`: Integrates ESLint with TypeScript.
*   `vite`:  Build tool.

## Contributing

Contributions are welcome!  Please follow these guidelines:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them with clear, concise messages.
4.  Submit a pull request.

## License

(Specify the License, e.g., MIT License)
```
