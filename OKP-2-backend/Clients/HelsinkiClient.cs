using System.Web;
using backend.Models;

namespace backend.Clients;

// Source for this client pattern thing
// https://www.youtube.com/watch?v=Z6Y2adsMnAA
public class HelsinkiClient : IHelsinkiClient
{
    private readonly HttpClient _httpClient;

    public HelsinkiClient(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<string> Get(HelsinkiFilters filters, string address)
    {
        return await _httpClient.GetStringAsync(UriBuilder(filters, address));
    }

    public async Task<string> GetOne(string address)
    {
        return await _httpClient.GetStringAsync(address);
    }

    private string UriBuilder(HelsinkiFilters filters, string address)
    {
        // Append filters as query string parameters
        var queryParams = new List<string>();
        string url = address;

        if (!string.IsNullOrEmpty(filters.limit)) queryParams.Add($"limit={HttpUtility.UrlEncode(filters.limit)}");
        if (!string.IsNullOrEmpty(filters.start)) queryParams.Add($"start={HttpUtility.UrlEncode(filters.start)}");
        if (!string.IsNullOrEmpty(filters.tags_search)) queryParams.Add($"tags_search={HttpUtility.UrlEncode(filters.tags_search)}");
        if (!string.IsNullOrEmpty(filters.tags_filter)) queryParams.Add($"tags_filter={HttpUtility.UrlEncode(filters.tags_filter)}");
        if (!string.IsNullOrEmpty(filters.distance_filter)) queryParams.Add($"distance_filter={HttpUtility.UrlEncode(filters.distance_filter)}");
        if (!string.IsNullOrEmpty(filters.language_filter)) queryParams.Add($"language_filter={HttpUtility.UrlEncode(filters.language_filter)}");

        if (queryParams.Any()) {
            string queryString = string.Join("&", queryParams);
            url += "?" + queryString;
        }

        return url;
    }
}

public interface IHelsinkiClient
{
    Task<string> Get(HelsinkiFilters filters, string address);
    Task<string> GetOne(string address);
}
