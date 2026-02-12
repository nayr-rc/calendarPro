using CalendarApi.Models;
using CalendarApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace CalendarApi.Controllers;

[ApiController]
[Route("[controller]")]
public class EventsController : ControllerBase
{
    private readonly EventService _eventService;

    public EventsController(EventService eventService)
    {
        _eventService = eventService;
    }

    [HttpGet]
    public async Task<ActionResult<List<CalendarEvent>>> Get()
    {
        var events = await _eventService.GetAllAsync();
        return Ok(events);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CalendarEvent>> Get(string id)
    {
        var eventItem = await _eventService.GetByIdAsync(id);

        if (eventItem is null)
        {
            return NotFound();
        }

        return Ok(eventItem);
    }

    [HttpPost]
    public async Task<ActionResult<CalendarEvent>> Post([FromBody] CalendarEvent newEvent)
    {
        if (string.IsNullOrWhiteSpace(newEvent.Title) || string.IsNullOrWhiteSpace(newEvent.Date))
        {
            return BadRequest("Title and Date are required");
        }

        await _eventService.CreateAsync(newEvent);
        return CreatedAtAction(nameof(Get), new { id = newEvent.Id }, newEvent);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(string id, [FromBody] CalendarEvent updatedEvent)
    {
        var existingEvent = await _eventService.GetByIdAsync(id);

        if (existingEvent is null)
        {
            return NotFound();
        }

        updatedEvent.Id = existingEvent.Id;
        await _eventService.UpdateAsync(id, updatedEvent);

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var existingEvent = await _eventService.GetByIdAsync(id);

        if (existingEvent is null)
        {
            return NotFound();
        }

        await _eventService.DeleteAsync(id);
        return NoContent();
    }
}
