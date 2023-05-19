namespace backend.Models;

public partial class FavoriteRequest
{
    public string? User { get; set; } = null!;

    public string Type { get; set; } = null!;

    public string Id { get; set; } = null!;
}
