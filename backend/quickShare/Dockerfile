FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app


COPY pom.xml .
RUN mvn dependency:go-offline

# Copy the rest of your source code
COPY src ./src


RUN mvn clean package -DskipTests


# Stage 2: Create a lightweight final image for the runtime environment
FROM amazoncorretto:21-alpine-jdk
WORKDIR /app

# Copy only the built JAR file from the 'build' stage
COPY --from=build /app/target/*.jar app.jar

# Expose the application port
EXPOSE 8080

# The command to run your application
ENTRYPOINT ["java", "-jar", "app.jar"]