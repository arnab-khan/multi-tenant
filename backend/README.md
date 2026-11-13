# Local backend startup

Install Java 21 and Docker Desktop. The startup script uses Maven from PATH when available, otherwise each service's Maven wrapper.

Open Docker Desktop and wait for its engine to start. From the project root, run:

```powershell
powershell -ExecutionPolicy Bypass -File .\backend\start-backend.ps1
```

Or, from the `backend` folder:

```powershell
powershell -ExecutionPolicy Bypass -File .\start-backend.ps1
```

The script starts MySQL in Docker, waits until it is ready, and runs both backend services locally using `spring-boot:run`. Service logs appear in the terminal.

| Service | Address |
| --- | --- |
| MySQL | `localhost:3307` |
| Auth GraphQL | `http://localhost:8080/graphql` |
| Tenant GraphQL | `http://localhost:8081/graphql` |

Press `Ctrl+C` to stop the local services. MySQL stays running. To stop MySQL without deleting its data, run this from the project root:

```powershell
docker compose stop mysql
```
