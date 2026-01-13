FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["src/Vult.Messaging/Vult.Messaging.csproj", "src/Vult.Messaging/"]
COPY ["src/Services/TestimonialService/TestimonialService.Api/TestimonialService.Api.csproj", "src/Services/TestimonialService/TestimonialService.Api/"]
RUN dotnet restore "src/Services/TestimonialService/TestimonialService.Api/TestimonialService.Api.csproj"
COPY . .
WORKDIR "/src/src/Services/TestimonialService/TestimonialService.Api"
RUN dotnet build "TestimonialService.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "TestimonialService.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "TestimonialService.Api.dll"]
