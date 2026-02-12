FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["CalendarApi.csproj", "./"]
RUN dotnet restore "CalendarApi.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "CalendarApi.csproj" -c Release -o /app/build
RUN dotnet publish "CalendarApi.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
EXPOSE 5000
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "CalendarApi.dll"]
