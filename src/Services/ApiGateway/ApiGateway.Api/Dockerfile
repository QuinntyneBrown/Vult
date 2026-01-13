FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["src/Services/ApiGateway/ApiGateway.Api/ApiGateway.Api.csproj", "src/Services/ApiGateway/ApiGateway.Api/"]
RUN dotnet restore "src/Services/ApiGateway/ApiGateway.Api/ApiGateway.Api.csproj"
COPY . .
WORKDIR "/src/src/Services/ApiGateway/ApiGateway.Api"
RUN dotnet build "ApiGateway.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "ApiGateway.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ApiGateway.Api.dll"]
