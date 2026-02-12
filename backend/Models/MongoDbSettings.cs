namespace CalendarApi.Models;

public class MongoDbSettings
{
    public string ConnectionString { get; set; } = "mongodb://mongodb:27017";
    public string DatabaseName { get; set; } = "calendardb";
    public string EventsCollectionName { get; set; } = "events";
}
