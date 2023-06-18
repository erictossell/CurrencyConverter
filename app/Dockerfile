FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /app

# Copy csproj and restore as distinct layers
COPY *.csproj /build
RUN dotnet restore

# Copy everything else and build the app
COPY . /build
RUN dotnet publish -c Release -o /build/publish

# Add the necessary .NET runtime files
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        libc6 \
    && rm -rf /var/lib/apt/lists/*


# Final stage/image
FROM mcr.microsoft.com/dotnet/aspnet:6.0
WORKDIR /app
COPY --from=build /build/publish .
ENTRYPOINT ["dotnet", "CurrencyConverter.dll"]

