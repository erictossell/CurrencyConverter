# Base image with the .NET Core runtime
FROM mcr.microsoft.com/dotnet/runtime:5.0

# Set the working directory in the container
WORKDIR /app

# Copy the application code into the container
COPY . .

# Restore dependencies
RUN dotnet restore

# Build the application
RUN dotnet build --configuration Release

# Set the command to run the application
CMD ["dotnet", "run", "--configuration", "Release"]
