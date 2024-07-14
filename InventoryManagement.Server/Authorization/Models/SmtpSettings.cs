namespace InventoryManagement.Server.Authorization.Models
{
    public record SmtpSettings(string Server, int Port, string SenderEmail, string SenderPassword);
}
