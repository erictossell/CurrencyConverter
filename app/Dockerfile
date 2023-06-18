# Learn about building .NET container images:
# https://github.com/dotnet/dotnet-docker/blob/main/samples/README.md
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /app

# Copy everything else and build the app
COPY CurrencyConverter.csproj /app/publish
COPY . /app/publish
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
COPY wwwroot /app/wwwroot
ENTRYPOINT ["dotnet", "CurrencyConverter.dll"]
