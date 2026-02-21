using System.Security.Claims;
using TravelAccounting.Application.Auth;

namespace TravelAccounting.Api.Auth;

public sealed class HttpCurrentUserContext(IHttpContextAccessor httpContextAccessor) : ICurrentUserContext
{
    public string UserId
    {
        get
        {
            var user = httpContextAccessor.HttpContext?.User;
            var userId = user?.FindFirstValue(ClaimTypes.NameIdentifier) ?? user?.Identity?.Name;

            if (string.IsNullOrWhiteSpace(userId))
            {
                throw new InvalidOperationException("Authenticated user context is not available.");
            }

            return userId;
        }
    }
}
