# Learn about building .NET container images:
# https://github.com/dotnet/dotnet-docker/blob/main/samples/README.md
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /app

# Copy everything else and build the app
COPY CurrencyConverter.csproj .
COPY . .
RUN dotnet publish -c Release -o /app/publish

# Add the necessary .NET runtime files
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        libc6 \
    && rm -rf /var/lib/apt/lists/*

# Build the React frontend
WORKDIR /app/client
RUN npm install
RUN npm run build

# Build runtime image
FROM mcr.microsoft.com/dotnet/5.0-aspnet AS runtime
WORKDIR /app
COPY --from=build /app/out .   
# Copy the .NET application
COPY --from=build /app/client/build ./client/build   
# Copy the React build

# Copy your SQLite database to the appropriate location
COPY your-sqlite-database.db /app/your-sqlite-database.db


# Final stage/image
FROM mcr.microsoft.com/dotnet/aspnet:6.0
WORKDIR /app
COPY --from=build /app/publish .
COPY wwwroot /app/wwwroot
ENTRYPOINT ["dotnet", "CurrencyConverter.dll"]
