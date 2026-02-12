using CalendarApi.Models;
using MongoDB.Driver;

namespace CalendarApi.Services;

public class EventService
{
    private readonly IMongoCollection<CalendarEvent> _eventsCollection;

    public EventService(MongoDbSettings settings)
    {
        var client = new MongoClient(settings.ConnectionString);
        var database = client.GetDatabase(settings.DatabaseName);
        _eventsCollection = database.GetCollection<CalendarEvent>(settings.EventsCollectionName);
    }

    public async Task<List<CalendarEvent>> GetAllAsync() =>
        await _eventsCollection.Find(_ => true).ToListAsync();

    public async Task<CalendarEvent?> GetByIdAsync(string id) =>
        await _eventsCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

    public async Task<CalendarEvent> CreateAsync(CalendarEvent newEvent)
    {
        await _eventsCollection.InsertOneAsync(newEvent);
        return newEvent;
    }

    public async Task UpdateAsync(string id, CalendarEvent updatedEvent) =>
        await _eventsCollection.ReplaceOneAsync(x => x.Id == id, updatedEvent);

    public async Task DeleteAsync(string id) =>
        await _eventsCollection.DeleteOneAsync(x => x.Id == id);
}
