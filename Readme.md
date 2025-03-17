# Kafka Service Communication Setup  

This project implements a Kafka-based communication system in a microservices architecture.  

## Features  

- **Kafka & Zookeeper** for service-to-service communication.  
- **API Gateway** for handling client requests.  
- **PostgreSQL** as the primary database.  
- **Microservices (Service A & Service B)** for processing messages.  
- **Dockerized Setup** with managed services and API Gateway.  
- **Environment-based Logging** for better debugging.  
- **Environment Variables Handling** for configuration management.  
- **Cron Job Execution** every 5 minutes to summarize user messages.
- **Working on monorepo setup**

## Getting Started  

### Clone the Repository  

```sh
git clone git@github.com:Bikram-Gyawali/kafka-microservices-setup.git
```

### Run the Project  

To build and start the services, run:  

```sh
make up
```

Wait for the containers to spin up.  

### Stop the Containers  

```sh
make down-v
```

## API Endpoints  

### 1️⃣ Send a Message to a Service  

**Endpoint:**  
```http
POST http://localhost:3000/send-message
```

**Request Body:**  
```json
{
  "userId": "7aefe555-3c0f-4f60-a0a6-05270a3f3ae1",
  "message": "hello world ? {{$randomEmail}}",
  "serviceType": 0  
}
```
📌 **Use `serviceType: 0` to send the message to Service B.**  
📌 **Use `serviceType: 1` to send the message to Service A.**  

---

### 2️⃣ Get User Summary  

**Endpoint:**  
```http
GET http://localhost:3000/summary/{userId}
```

---

### 3️⃣ Manually Trigger Summary Update  

**Endpoint:**  
```http
POST http://localhost:3000/schedule-job
```

This manually triggers the cron job that summarizes user messages.  

---

## Additional Notes  

- Ensure Docker is installed and running.  
- Modify environment variables as needed in the `.env` file.  
- Logs will be generated based on the selected environment.

## TODO 

- Global error handling inservices
- Monorepo setup
- Monitoring of the message passing
- Security configurations etc
