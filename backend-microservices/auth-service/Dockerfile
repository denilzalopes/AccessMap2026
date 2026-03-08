# ── Étape 1 : Build avec Maven ────────────────────────────────────────────────
FROM eclipse-temurin:21-jdk-jammy AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN apt-get update && apt-get install -y maven && mvn clean package -DskipTests

# ── Étape 2 : Image de production allégée ─────────────────────────────────────
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
# Copier uniquement le JAR compilé
COPY --from=builder /app/target/*.jar app.jar
# Activer les Virtual Threads (Project Loom) via variable d'env
ENV JAVA_OPTS="-XX:+UseZGC -Dspring.threads.virtual.enabled=true"
EXPOSE 8080
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
