# Use the desired base image for your application
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /app

# Copy csproj and restore as distinct layers
COPY *.csproj ./
RUN dotnet restore

# Copy everything else and build the app
COPY . ./
RUN dotnet publish -c Release -o /app/publish

# Use the appropriate runtime image for your application
FROM mcr.microsoft.com/dotnet/aspnet:6.0
WORKDIR /app/publish
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "CurrencyConverter.dll"]
