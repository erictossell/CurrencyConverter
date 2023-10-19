# Stage 1: Build the React frontend
FROM node:14 AS react-build
WORKDIR /app/client

# Copy the React app source code
COPY currency_converter/package.json currency_converter/package-lock.json ./
RUN npm install

# Copy the rest of the React app files
COPY currency_converter/ ./
RUN npm run build

# Stage 2: Build the .NET Core application
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS dotnet-build
WORKDIR /app

# Copy and restore .NET Core dependencies
COPY app/*.csproj ./
RUN dotnet restore

# Copy the rest of the application and build
COPY app/ ./
RUN dotnet publish -c Release -o /app/publish

# Stage 3: Create the final image
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS final
WORKDIR /app
COPY --from=dotnet-build /app/publish .
COPY --from=react-build /app/client/build ./wwwroot

# Copy the SQLite database file
COPY /app/currencyExchanges.db /app/publish/currencyExchanges.db   
 

# This line copies TestDatabase.db to the root of the image


ENTRYPOINT ["dotnet", "CurrencyConverter.dll"]
