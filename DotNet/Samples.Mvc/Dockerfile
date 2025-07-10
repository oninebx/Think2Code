# Use SDK to build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy all source code
COPY Samples.Mvc.csproj ./

RUN dotnet restore
COPY . .
RUN dotnet publish -c Release -o /app/out

# Use runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/out .

ENTRYPOINT ["dotnet", "Samples.Mvc.dll"]