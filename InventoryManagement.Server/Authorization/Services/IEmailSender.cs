namespace InventoryManagement.Server.Authorization.Services
{
    public interface IEmailSender
    {
        void SendEmail(string username, string email, string subject, string body, string? verificationCode);
        string GenerateVerificationCode();
        void SaveVerificationCode(string email, string verificationCode);
    }
}
