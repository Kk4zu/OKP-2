using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Net.Http.Headers;
using System.Data;
using Microsoft.EntityFrameworkCore;
using backend.Clients;

namespace backend.Controllers;

[Authorize]
[Route("api")]
[ApiController]
public class FavoriteController : ControllerBase
{
    private readonly PostgresContext _context;
    private readonly IJwtProvider _jwt;
    private readonly IHelsinkiClient _helsinkiClient;

    public FavoriteController(PostgresContext context, IJwtProvider jwt, IHelsinkiClient helsinkiClient)
    {
        _context = context;
        _jwt = jwt;
        _helsinkiClient = helsinkiClient;
    }

    [HttpPost("favorites")]
    public IActionResult GetFavorites()
    {
        string token;
        try
        {
            token = Request.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", "");
        }
        catch
        {
            return BadRequest("Failed to parse Authorization header");
        }

        // Name id is somehow automatically derived from
        // ClaimTypes.NameIdentifier which we use in our JWT service
        var username = _jwt.GetClaim(token, "nameid");

        var userdata = this._context.Favorites
            .Where(favorite => favorite.User == username)
            .Select(favorite => new { favorite.User, favorite.Id, favorite.Type })
            .ToList();

        var places = new List<object>();
        var activities = new List<object>();
        var events = new List<object>();

        var placeErrors = new List<string>();
        var activityErrors = new List<string>();
        var eventErrors = new List<string>();

        foreach (var favorite in userdata)
        {
            try
            {
                if (favorite.Type == "place")
                {
                    var address = $"v2/{favorite.Type}/{favorite.Id}";
                    var place = _helsinkiClient.GetOne(address);
                    places.Add(place.Result);
                }
                else if (favorite.Type == "activity")
                {
                    var address = $"v2/{favorite.Type}/{favorite.Id}";
                    var activity = _helsinkiClient.GetOne(address);
                    activities.Add(activity.Result);
                }
                else if (favorite.Type == "event")
                {
                    var address = $"v1/{favorite.Type}/{favorite.Id}";
                    var eventt = _helsinkiClient.GetOne(address);
                    events.Add(eventt.Result);
                }
            }
            catch (Exception ex)
            {
                var errorMessage = $"{favorite.Type} {favorite.Id} not found: {ex.Message}";
                if (favorite.Type == "place")
                {
                    placeErrors.Add(errorMessage);
                }
                else if (favorite.Type == "activity")
                {
                    activityErrors.Add(errorMessage);
                }
                else if (favorite.Type == "event")
                {
                    eventErrors.Add(errorMessage);
                }
            }
        }

        return Ok(new
        {
            status = "Success",
            favorites = new
            {
                userdata,
                places,
                activities,
                events,
                placeErrors,
                activityErrors,
                eventErrors
            }
        });
    }

    [HttpPost("favorite")]
    public IActionResult SaveFavorite([FromForm] FavoriteRequest request)
    {
        string token;
        try
        {
            token = Request.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", "");
        }
        catch
        {
            return BadRequest("Failed to parse Authorization header");
        }

        // Check if post request has correct parameters
        if (!request.Type.Equals("place") && !request.Type.Equals("activity") && !request.Type.Equals("event"))
        {
            return BadRequest($"Invalid place paramater: {request.Type}. Only place, activity and event are allowed");
        }

        // Name id is somehow automatically derived from
        // ClaimTypes.NameIdentifier which we use in our JWT service
        request.User = _jwt.GetClaim(token, "nameid");

        // Construct full favorite object from request
        Favorite favorite = new Favorite { User = request.User, Type = request.Type, Id = request.Id };

        try
        {
            this._context.Favorites.Add(favorite);
            this._context.SaveChanges();
        }
        catch (DbUpdateException ex)
        {
            // Handle the database update error here
            if (ex.InnerException is Npgsql.PostgresException pgEx && pgEx.SqlState == "23505")
            {
                return BadRequest($"Record with name of \"{request.User}\" and id of \"{request.Id}\" already exists");
            }

            // Handle other errors
            return BadRequest("Internal server error");
        }

        return Ok(new { status = "Success" });
    }

    [HttpPost("unfavorite")]
    public IActionResult RemoveFavorite([FromForm] FavoriteRequest request)
    {
        string token;
        try
        {
            token = Request.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", "");
        }
        catch
        {
            return BadRequest("Failed to parse Authorization header");
        }

        // Check if post request has correct parameters
        if (!request.Type.Equals("place") && !request.Type.Equals("activity") && !request.Type.Equals("event"))
        {
            return BadRequest($"Invalid place paramater: \"{request.Type}\". Only place, activity and event are allowed");
        }

        // Name id is somehow automatically derived from
        // ClaimTypes.NameIdentifier which we use in our JWT service
        request.User = _jwt.GetClaim(token, "nameid");

        // Construct full favorite object from request
        Favorite favorite = new Favorite { User = request.User, Type = request.Type, Id = request.Id };

        try
        {
            this._context.Favorites.Remove(favorite);
            this._context.SaveChanges();
        }
        catch (DbUpdateException ex)
        {
            if (ex is DbUpdateConcurrencyException)
            {
                // Handle optimistic concurrency exception
                return BadRequest($"The record of id: \"{request.Id}\", does not exist");
            }

            // Handle other exceptions here
            return BadRequest("Internal server error");
        }

        return Ok(new { status = "Success" });
    }
}
