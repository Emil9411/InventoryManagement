namespace InventoryManagement.Server.Authorization.Models
{
    public class JwtSettings
    {
        public string? ValidIssuer { get; set; }
        public string? ValidAudience { get; set; }
    }
}
