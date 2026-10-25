using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace TravelAccounting.Api.Tests;

internal static class JwtTestTokenFactory
{
    public const string Issuer = "travel-accounting";
    public const string Audience = "travel-accounting-api";
    public const string SigningKey = "dev-only-signing-key-change-me-please-1234567890";

    public static string CreateToken(string userId, DateTimeOffset? expiresAt = null)
    {
        var credentials = new SigningCredentials(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(SigningKey)),
            SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: Issuer,
            audience: Audience,
            claims:
            [
                new Claim("sub", userId),
                new Claim(ClaimTypes.Name, userId),
            ],
            notBefore: DateTime.UtcNow.AddMinutes(-1),
            expires: (expiresAt ?? DateTimeOffset.UtcNow.AddHours(1)).UtcDateTime,
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
