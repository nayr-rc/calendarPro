using CalendarApi.Models;
using CalendarApi.Services;

var builder = WebApplication.CreateBuilder(args);

// Configure MongoDB settings
var mongoSettings = new MongoDbSettings
{
    ConnectionString = Environment.GetEnvironmentVariable("MONGODB_URI") ?? "mongodb://mongodb:27017",
    DatabaseName = "calendardb",
    EventsCollectionName = "events"
};

// Add services
builder.Services.AddSingleton(mongoSettings);
builder.Services.AddSingleton<EventService>();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");
app.MapControllers();

app.Run();
