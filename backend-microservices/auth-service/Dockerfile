FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app

COPY ../pom.xml ./parent-pom.xml
RUN apk add --no-cache maven
RUN mvn install:install-file -Dfile=parent-pom.xml \
    -DgroupId=com.accessmap \
    -DartifactId=backend-microservices \
    -Dversion=1.0.0 \
    -Dpackaging=pom
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests -B

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
