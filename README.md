# NexusMetrics AI

A real-time system monitoring and predictive DevOps platform built as a Single-Application Monolith using Spring Boot WebFlux and React.

## Prerequisites

1. **Java 17** or higher installed.
2. **Maven 3.8+** installed.
3. **Node.js 20+** installed (handled automatically by Maven during build, but good for local dev).
4. **PostgreSQL** installed and running on port `5432`.

## Step 1: Database Setup

Ensure you have a local PostgreSQL instance running. The application expects a database named `nexus_metrics_db`.

1. Open pgAdmin or your terminal `psql`.
2. Create the database:
   ```sql
   CREATE DATABASE nexus_metrics_db;
   ```
*(The application will automatically create the tables and insert the default server using `schema.sql` on startup).*

## Step 2: OpenRouter API Key (Optional but recommended)

To use the AI Diagnostic Simulation fully, you need an OpenRouter API key. 
In `application.yml`, either replace `${OPENROUTER_API_KEY:your-default-api-key-here}` with your key, or run the application with an environment variable. If you do not provide one, the application will gracefully fall back to a hardcoded response for the simulation.

## Step 3: Build the Monolith

Because of the `frontend-maven-plugin`, Maven will automatically download Node/npm, install the React dependencies, build the React app, and package it into the Spring Boot `.jar`.

Open your terminal at the root of the project (`C:/Users/Priyam Shrivastava/OneDrive/Desktop/NexusMetrics AI System Build/`) and run:

```bash
mvn clean package
```

*Note: The first time you run this, it might take a few minutes as it downloads Node.js and npm dependencies.*

## Step 4: Run the Application

Once the build is successful, you can run the generated `.jar` file:

```bash
java -jar target/nexus-metrics-ai-1.0.0-SNAPSHOT.jar
```

Alternatively, you can run it directly via Maven (which is faster for development):

```bash
mvn spring-boot:run
```

## Step 5: View the Application

Open your web browser and navigate to:

**http://localhost:8080**

You will see the React dashboard load up, and it will immediately start streaming your local machine's actual CPU and Memory usage! Click the "Simulate Critical Server Anomaly" button to see the UI react and the OpenRouter AI response generate.