using System.ComponentModel.DataAnnotations;

namespace TravelAccounting.Api.Configuration;

public sealed class JwtAuthenticationSettings
{
    public const string SectionName = "Authentication:Jwt";

    [Required]
    public string Issuer { get; init; } = string.Empty;

    [Required]
    public string Audience { get; init; } = string.Empty;

    public string Authority { get; init; } = string.Empty;

    public string SigningKey { get; init; } = string.Empty;

    public bool RequireHttpsMetadata { get; init; } = true;
}
