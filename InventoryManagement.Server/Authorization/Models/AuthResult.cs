namespace InventoryManagement.Server.Authorization.Models
{
    public record AuthResult(bool Success, string Email, string Username, string Token)
    {
        // Error code - Error message
        public readonly Dictionary<string, string> ErrorMessages = new();
    }
}
