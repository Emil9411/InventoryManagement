using InventoryManagement.Server.Authorization.Models;
using InventoryManagement.Server.Model;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace InventoryManagement.Server.Authorization.Services
{
    public class TokenService : ITokenService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<TokenService> _logger;
        private const int ExpirationInMinutes = 60;

        public TokenService(IConfiguration configuration, ILogger<TokenService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public string CreateToken(AppUser user, string role)
        {
            try
            {
                var claims = CreateClaims(user, role);
                if (claims == null || !claims.Any())
                {
                    _logger.LogError("TokenService: No claims created for the token");
                    return string.Empty;
                }

                var signingCredentials = CreateSigningCredentials();
                if (signingCredentials == null)
                {
                    _logger.LogError("TokenService: Signing credentials could not be created");
                    return string.Empty;
                }

                var expiration = DateTime.UtcNow.AddMinutes(ExpirationInMinutes);
                var jwtToken = CreateJwtToken(claims, signingCredentials, expiration);
                return new JwtSecurityTokenHandler().WriteToken(jwtToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "TokenService: Error creating token");
                return string.Empty;
            }
        }

        private JwtSecurityToken CreateJwtToken(List<Claim> claims, SigningCredentials signingCredentials, DateTime expiration)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings").Get<JwtSettings>();
            if (jwtSettings == null)
            {
                _logger.LogError("TokenService: JwtSettings configuration section is missing");
                throw new InvalidOperationException("JwtSettings configuration section is missing");
            }

            return new JwtSecurityToken(
                issuer: jwtSettings.ValidIssuer,
                audience: jwtSettings.ValidAudience,
                claims: claims,
                expires: expiration,
                signingCredentials: signingCredentials
            );
        }

        private List<Claim> CreateClaims(AppUser user, string? role)
        {
            try
            {
                if (user == null || string.IsNullOrEmpty(user.Id) || string.IsNullOrEmpty(user.UserName) || string.IsNullOrEmpty(user.Email))
                {
                    _logger.LogError("TokenService: User information is incomplete or null");
                    return new List<Claim>();
                }

                var claims = new List<Claim>
                {
                    new(JwtRegisteredClaimNames.Sub, user.Id),
                    new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new(JwtRegisteredClaimNames.Iat, DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString()),
                    new(ClaimTypes.Name, user.UserName),
                    new(ClaimTypes.Email, user.Email)
                };

                if (!string.IsNullOrEmpty(role))
                {
                    claims.Add(new Claim(ClaimTypes.Role, role));
                }

                return claims;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "TokenService: Error creating claims for token");
                return new List<Claim>();
            }
        }

        private SigningCredentials CreateSigningCredentials()
        {
            try
            {
                var issuerSigningKey = _configuration.GetValue<string>("IssuerSigningKey");
                if (string.IsNullOrEmpty(issuerSigningKey))
                {
                    _logger.LogError("TokenService: IssuerSigningKey is null or empty");
                    throw new InvalidOperationException("IssuerSigningKey is null or empty");
                }

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(issuerSigningKey));
                return new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "TokenService: Error creating signing credentials");
                throw;
            }
        }
    }
}
