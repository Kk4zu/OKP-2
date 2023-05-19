using backend.Models;
using Microsoft.AspNetCore.Mvc;
using backend.Clients;

namespace backend.Controllers;

[Route("api")]
[ApiController]
public class HelsinkiController : Controller
{
    private readonly IHelsinkiClient _helsinkiClient;

    public HelsinkiController(IHelsinkiClient helsinkiClient)
    {
        _helsinkiClient = helsinkiClient;
    }

    [HttpGet]
    [Route("")]
    [Route("/api")]
    public IActionResult Default()
    {
        return Ok();
    }

    [HttpGet("places")]
    public IActionResult Places([FromQuery] HelsinkiFilters filters)
    {
        var address = "v2/places/";
        var data = _helsinkiClient.Get(filters, address);
        return Ok(new { Data = data });
    }

    [HttpGet("place/{id}")]
    public IActionResult Place(string id)
    {
        var address = $"v2/place/{id}";
        var data = _helsinkiClient.GetOne(address);
        return Ok(new { Data = data });
    }

    [HttpGet("activities")]
    public IActionResult Activities([FromQuery] HelsinkiFilters filters)
    {
        var address = "v2/activities";
        var data = _helsinkiClient.Get(filters, address);
        return Ok(new { Data = data });
    }

    [HttpGet("activity/{id}")]
    public IActionResult Activity(string id)
    {
        var address = $"v2/activity/{id}";
        var data = _helsinkiClient.GetOne(address);
        return Ok(new { Data = data });
    }

    [HttpGet("events")]
    public IActionResult Events([FromQuery] HelsinkiFilters filters)
    {
        var address = "v1/events/";
        var data = _helsinkiClient.Get(filters, address);
        return Ok(new { Data = data });
    }

    [HttpGet("event/{id}")]
    public IActionResult Event(string id)
    {
        var address = $"v1/event/{id}";
        var data = _helsinkiClient.GetOne(address);
        return Ok(new { Data = data });
    }
}
