FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /app

# Copy the entire project directory
COPY . .

# Restore, build, and publish the app
RUN dotnet restore CurrencyConverter.csproj
RUN dotnet publish -c Release -o /app/publish

# Add the necessary .NET runtime files
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        libc6 \
    && rm -rf /var/lib/apt/lists/*

# Final stage/image
FROM mcr.microsoft.com/dotnet/aspnet:6.0
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "CurrencyConverter.dll"]
