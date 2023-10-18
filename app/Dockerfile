# Learn about building .NET container images:
# https://github.com/dotnet/dotnet-docker/blob/main/samples/README.md
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /app

# Copy everything else and build the app
COPY CurrencyConverter.csproj .
COPY . .
RUN dotnet publish -c Release -o /app/publish

# Install Node.js and npm (assuming you are using a Debian-based image)
RUN apt-get update && apt-get install -y nodejs npm

# Add the necessary .NET runtime files
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        libc6 \
    && rm -rf /var/lib/apt/lists/*

# Build the React frontend
WORKDIR /currency_converter
RUN npm install
RUN npm run build


# Final stage/image
FROM mcr.microsoft.com/dotnet/aspnet:6.0
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "CurrencyConverter.dll"]
