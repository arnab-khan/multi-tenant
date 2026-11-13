# Local development

Install Node.js, Java 21, and Docker Desktop. Install frontend dependencies once:

```powershell
npm.cmd --prefix frontend install
```

Open Docker Desktop and wait for its engine to start. From the project root, start the frontend and backend together:

```powershell
powershell -ExecutionPolicy Bypass -File .\start.ps1
```

This starts MySQL in Docker, both backend services locally using `spring-boot:run`, and all five frontend apps. Logs appear in the same terminal. The backend uses Maven from PATH when available, otherwise its Maven wrappers.

| App or service | Address |
| --- | --- |
| Frontend shell | `http://localhost:4200` |
| Auth frontend | `http://localhost:4201` |
| Profile frontend | `http://localhost:4202` |
| Dynamic sites frontend | `http://localhost:4203` |
| Dynamic forms frontend | `http://localhost:4204` |
| Auth GraphQL | `http://localhost:8080/graphql` |
| Tenant GraphQL | `http://localhost:8081/graphql` |
| MySQL | `localhost:3307` |

Press `Ctrl+C` to stop the frontend and backend services. MySQL stays running. To stop it without deleting its data:

```powershell
docker compose stop mysql
```

For backend-only startup, see [backend/README.md](backend/README.md).
