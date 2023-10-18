# Stage 1: Build the .NET and React application
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /app

# Copy and restore .NET dependencies
COPY /app/CurrencyConverter.csproj .
RUN dotnet restore

# Copy the rest of the application and build
COPY /app .
RUN dotnet publish -c Release -o /app/publish

# Build the React frontend
WORKDIR /app/client
RUN apt-get update && apt-get install -y nodejs npm
RUN npm install
RUN npm run build

# Stage 2: Create the final image
FROM mcr.microsoft.com/dotnet/aspnet:6.0
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "CurrencyConverter.dll"]
