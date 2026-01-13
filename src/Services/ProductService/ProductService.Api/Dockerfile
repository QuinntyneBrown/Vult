FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["src/Vult.Messaging/Vult.Messaging.csproj", "src/Vult.Messaging/"]
COPY ["src/Services/ProductService/ProductService.Api/ProductService.Api.csproj", "src/Services/ProductService/ProductService.Api/"]
RUN dotnet restore "src/Services/ProductService/ProductService.Api/ProductService.Api.csproj"
COPY . .
WORKDIR "/src/src/Services/ProductService/ProductService.Api"
RUN dotnet build "ProductService.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "ProductService.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ProductService.Api.dll"]
