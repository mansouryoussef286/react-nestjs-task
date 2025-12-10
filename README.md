### Full-Stack Signup/Signin Project

This is a full-stack project demonstrating a complete signup/signin flow with a frontend, backend API, and database integration. 
The project mimics real-world user authentication and session management.

  ---

<details open> 
<summary><h2>✨ Features</h2></summary>
  
- Frontend in React with SPA routing
- Backend in NestJS with REST API
- MongoDB for user data persistence
- User authentication (JWT Bearer Auth)
  - adding protected routes for authenticated users
  - adding protected pages in frontend 
- Logging using Winston with daily rotational files
- Rate limitting the api to avoid DOS attacks
- Hashing passwords for extra security using `bcryptjs`
- CORS setup for development and production
- Dockerized frontend, backend, and database for easier deployment or testing
  
</details>

<details>
<summary><h2>🏗️ System Architecture</h2></summary>

This project follows a **monolithic codebase** approach, but is organized **modularly** to improve maintainability and separation of concerns.  

**Backend (NestJS) modules:**

- **Auth Module:** Handles signup, signin, JWT generation, and token validation.  
- **Logging Module:** Configures Winston with daily rotation; captures exceptions and request logs.  
- **Common Module:** Contains shared utilities, configurations, guards, interceptors, and rate limiting (throttler).  
- **User Module:** Handles user-specific operations, profile management, and protected routes.  

This structure allows clear separation of concerns while keeping the code in a single deployable monolithic application, making it easier to maintain and extend.

</details>

<details>
<summary><h2>🗂️ Project Structure</h2></summary>

The project is organized to separate concerns and make it easy to maintain both backend and frontend:

```bash
/frontend # React application
  /api # API service calls to the backend
  /context # React context providers (e.g., user authentication state)
  /hooks # Custom React hooks
  /models # TypeScript interfaces and models
  /pages
    /external # Public pages (signup, signin, landing)
    /internal # Protected pages (dashboard, profile, etc.)
  /components # Reusable UI components (if any but in my case didn't use)
  /assets # Static assets like images and styles

/backend # NestJS backend
  /common # Shared modules, configuration, guards, interceptors, throttler
  /data # Database models, schemas, and repositories
  /features # Functional modules (Account, user)
    /controllers # API route handlers
    /services # Business logic services
    /dto # Data Transfer Objects
  /filters # Exception filters
  /interceptors # Request/response interceptors
  /config # Environment-based configuration to be strongly typed

/-backend_logs # Host-mapped logs folder for Winston output
/docker-compose.yml # Docker Compose configuration for frontend, backend, and MongoDB
```
</details>


<details open>

  <summary><h2>🚀 Getting Started</h2></summary>

  1- Clone the repository:
  
    git clone [<repo-url>](https://github.com/mansouryoussef286/react-nestjs-task.git)
    cd react-nestjs-task
  
  2- Build and run using Docker Compose: <span id = "#docker-build"></span>
      to run in detach mode but show the backend logs
      
	    docker-compose up -d --build && docker-compose logs -f backend

      # exit after usage
    	docker-compose down

  
  3- Open in browser:
  
    Frontend: http://localhost:5173
    Backend Swagger: http://localhost:3005/api/swagger

</details> 

<details > 
  
<summary><h2>⚙️ Configuration</h2></summary>
  
Backend: `.env.production` for docker build or `.env` for development

Frontend: `.env.production` or `.env` for development

Docker Compose: ports, volumes, and environment variables are configurable

</details> 

<details > 
  <summary><h2>💬 User Flow Examples</h2></summary>
 
  - User submits signup form → Frontend sends POST /api/auth/signup → Backend creates user in MongoDB → Returns JWT → Frontend stores token
  
  - User accesses protected route → Frontend attaches JWT → Backend validates → Returns requested data
   
  - User accesses protected route → Frontend attaches JWT (expired) → Backend invalidates → Returns requested `401 unauthorized` error → Frontend requests refreshing token using RefreshToken → Backend returns new token → Frontend attaches JWT (new valid) → Backend validates → Returns requested data 

</details> 

 <details> 
   <summary><h2>🐳 Docker Setup Details</h2></summary>

   - Services: mongo, backend, frontend
   - Volumes:
     - -backend_logs: mapped to host for log files
     - mongo-data: to persist database data between containers lifecycles
   - Ports:
     - Backend: 3005 → 3000 inside container
     - Frontend: 5173 → 80 inside container
     - Mongo: 27017
   - Rebuild containers after env changes: See the [Getting Started](#getting-started) section.

</details> 

<details> 
  <summary><h2>🔮 Future Improvements</h2></summary>

  - add refresh token to the database to manage sessions and revoke it on:
    - each new token request
    - if new token request with a token different from the saved one (to revoke all sessions)
  - not to mention the error in signin in to protect against `user enumeration` attack
  - adding limit for failed logins to lock the account for some time
  - can modify the loggin by extending the Ilogger by using a database or ELK logging instead of file system:
    - add more info in the logging that could help
  - add validation on env in code to exit before starting
  - add a strategy pattern in exception handling to avoid if/else in the global handler

</details>

<details> 
  <summary><h2>📚 Resources & References</h2></summary>
  
- [NestJS Documentation](https://docs.nestjs.com/)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [MongoDB Documentation](https://www.mongodb.com/docs/)
- [Winston Logging](https://github.com/winstonjs/winston)

</details>
