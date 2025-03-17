.PHONY: up down create-topic list-topics logs ps down-v up-topic

# Start Kafka and Zookeeper
up:
	docker-compose up --build

ps:
	docker ps

# Stop and remove containers
down:
	docker-compose down

down-v:
	docker-compose down --volumes

# Create Kafka topic
create-topic:
	docker exec kafka kafka-topics --create --topic processing_topic --bootstrap-server kafka:9092 --partitions 1 --replication-factor 1 || true

# List available Kafka topics
list-topics:
	docker exec kafka kafka-topics --list --bootstrap-server kafka:9092

# View Kafka logs
logs:
	docker-compose logs -f kafka

up-topic:
	docker-compose up -d && docker exec kafka kafka-topics --create --topic processing_topic --bootstrap-server kafka:9092 --partitions 1 --replication-factor 1