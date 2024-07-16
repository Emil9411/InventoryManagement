using InventoryManagement.Server.Authorization.Models;
using InventoryManagement.Server.Context;
using InventoryManagement.Server.Model;
using MailKit.Net.Smtp;
using MimeKit;

namespace InventoryManagement.Server.Authorization.Services
{
    public class EmailSender : IEmailSender
    {
        private readonly ILogger<EmailSender> _logger;
        private readonly IConfiguration _configuration;
        private readonly VerifCodesContext _verifCodesContext;
        private readonly UserContext _userContext;

        public EmailSender(ILogger<EmailSender> logger, IConfiguration configuration, VerifCodesContext verifCodesContext, UserContext userContext)
        {
            _logger = logger;
            _configuration = configuration;
            _verifCodesContext = verifCodesContext;
            _userContext = userContext;
        }

        public void SendEmail(string username, string email, string subject, string body, string? verificationCode)
        {
            var emailMessage = new MimeMessage();
            var smtpSettings = _configuration.GetSection("SmtpSettings").Get<SmtpSettings>();

            emailMessage.From.Add(new MailboxAddress("EM&EM Software", smtpSettings.SenderEmail));
            emailMessage.To.Add(new MailboxAddress(username, email));

            emailMessage.Subject = subject;
            emailMessage.Body = new TextPart("plain")
            {
                Text = verificationCode == null ? body : $"{body}\n\nYour verification code is: {verificationCode}\n\nThis code will expire in 3 hours."
            };

            using (var client = new SmtpClient())
            {
                client.Connect(smtpSettings.Server, smtpSettings.Port, true);
                client.Authenticate(smtpSettings.SenderEmail, smtpSettings.SenderPassword);
                client.Send(emailMessage);
                client.Disconnect(true);
                if (verificationCode == null)
                {
                    _logger.LogInformation($"EmailSender: Email sent to {email}");
                }
                else
                {
                    _logger.LogInformation($"EmailSender: Verification code sent to {email}");
                }
            }
        }

        public string GenerateVerificationCode()
        {
            var random = new Random();
            return random.Next(100000, 999999).ToString(); // Generates a 6-digit code
        }

        public void SaveVerificationCode(string email, string verificationCode)
        {
            var user = _userContext.Users.FirstOrDefault(u => u.Email == email);
            var verifCode = _verifCodesContext.VerificationCodes.FirstOrDefault(vc => vc.UserId == user.Id);
            if (verifCode != null)
            {
                _verifCodesContext.VerificationCodes.Remove(verifCode);
            }
            else
            {
                _verifCodesContext.VerificationCodes.Add(new VerificationCode
                {
                    UserId = user.Id,
                    Code = verificationCode,
                    ExpirationTime = DateTime.Now.AddHours(3)
                });
            }
            _verifCodesContext.SaveChanges();
            _logger.LogInformation($"EmailSender: Verification code saved for {email}");
        }
    }
}
