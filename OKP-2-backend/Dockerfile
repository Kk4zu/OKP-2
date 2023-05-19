# Start with the .NET SDK image
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build

# Set the working directory
WORKDIR /app

# Copy the project file(s) to the container
COPY *.csproj ./

# Copy the remaining source code to the container
COPY . ./

# Publish the application
RUN dotnet publish --configuration Release --output out

# Build the final runtime image
FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS runtime

# Set the working directory
WORKDIR /app

# Copy the published output from the build image
COPY --from=build /app/out ./

# Set the environment variables
ENV ASPNETCORE_URLS=http://0.0.0.0:7266

# Expose the desired port
EXPOSE 7266

# Set the entry point for the application
ENTRYPOINT ["dotnet", "OKP-2-backend.dll"]
