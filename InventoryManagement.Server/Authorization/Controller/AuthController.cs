using InventoryManagement.Server.Authorization.Models;
using InventoryManagement.Server.Authorization.Requests;
using InventoryManagement.Server.Authorization.Responses;
using InventoryManagement.Server.Authorization.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Net.Mail;

namespace InventoryManagement.Server.Authorization.Controller
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;
        private readonly IConfiguration _configuration;

        public AuthController(IAuthService authService, ILogger<AuthController> logger, IConfiguration configuration)
        {
            _authService = authService;
            _logger = logger;
            _configuration = configuration;
        }

        [HttpPost("register"), Authorize(Roles = "Admin, Manager")]
        public async Task<IActionResult> Registration(RegistrationRequest request)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogError("AuthController: Invalid registration request");
                return BadRequest("Invalid registration request");
            }

            var result = await _authService.RegisterAsync(request.Email, request.Username, request.Password, request.Role);

            if (!result.Success)
            {
                _logger.LogError($"AuthController: Registration failed for user with email {result.Email} and username {result.Username}");
                return BadRequest(result.ErrorMessages);
            }

            _logger.LogInformation($"AuthController: User with email {result.Email} and username {result.Username} registered successfully");
            SendEmail(result.Email, "Registration successful", "You have successfully registered");
            return CreatedAtAction(nameof(Registration), new AuthResponse(result.Email, result.Username));
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(AuthRequest request)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogError("AuthController: Invalid login request");
                return BadRequest("Invalid login request");
            }

            var result = await _authService.LoginAsync(request.Email, request.Password);

            if (!result.Success)
            {
                _logger.LogError($"AuthController: Login failed for user with email {request.Email}");
                return BadRequest(result.ErrorMessages);
            }

            Response.Cookies.Append("Authorization", result.Token, new CookieOptions
            {
                HttpOnly = true,
            });

            _logger.LogInformation($"AuthController: User with email {request.Email} logged in successfully");
            return Ok(new AuthResponse(request.Email, result.Username));
        }

        [HttpPost("logout"), Authorize(Roles = "Admin, Manager, User")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("Authorization");

            _logger.LogInformation("AuthController: User logged out successfully");
            return Ok("User logged out successfully");
        }

        [HttpGet("check"), Authorize(Roles = "Admin, Manager, User")]
        public IActionResult Check()
        {
            var cookie = Request.Cookies["Authorization"];

            if (cookie == null)
            {
                _logger.LogError("AuthController: WhoAmI: No cookie found");
                return Unauthorized("AuthController: WhoAmI: No cookie found");
            }

            var result = _authService.Verify(cookie);

            if (result != null)
            {
                var claims = result.Claims.ToList();
                var email = claims.FirstOrDefault(c => c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress")?.Value ?? "";
                var username = claims.FirstOrDefault(c => c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name")?.Value ?? "";

                _logger.LogInformation("AuthController: WhoAmI: User found");
                return Ok(new AuthResponse(email, username));
            }

            _logger.LogError("AuthController: WhoAmI: User not found");
            return Unauthorized("AuthController: WhoAmI: User not found");
        }

        [HttpPatch("changepassword"), Authorize(Roles = "Admin, Manager, User")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogError("AuthController: Invalid change password request");
                return BadRequest("Invalid change password request");
            }

            var cookie = Request.Cookies["Authorization"];

            if (cookie == null)
            {
                _logger.LogError("AuthController: ChangePassword: No cookie found");
                return Unauthorized("AuthController: ChangePassword: No cookie found");
            }

            var result = await _authService.ChangePasswordAsync(cookie, request.OldPassword, request.NewPassword);

            if (!result.Success)
            {
                _logger.LogError($"AuthController: ChangePassword failed for user with email {result.Email}");
                return BadRequest(result.ErrorMessages);
            }

            _logger.LogInformation($"AuthController: ChangePassword: Password changed successfully for user with email {result.Email}");
            return Ok("Password changed successfully");
        }

        [HttpDelete("delete"), Authorize(Roles = "Admin, Manager")]
        public async Task<IActionResult> DeleteUser(string email)
        {
            var result = await _authService.DeleteUser(email);

            if (!result.Success)
            {
                _logger.LogError($"AuthController: DeleteUser failed for user with email {email}");
                return BadRequest(result.ErrorMessages);
            }

            _logger.LogInformation($"AuthController: DeleteUser: User with email {email} deleted successfully");
            return Ok("User deleted successfully");
        }

        private void SendEmail(string email, string subject, string body)
        {
            var smtpSettings = _configuration.GetSection("SmtpSettings").Get<SmtpSettings>();
            if (smtpSettings == null)
            {
                _logger.LogError("AuthController: SendEmail: SmtpSettings configuration section is missing");
                return;
            }

            using (var client = new SmtpClient(smtpSettings.Server))
            {
                client.Port = smtpSettings.Port;
                client.EnableSsl = true;
                client.UseDefaultCredentials = false; // Ensure this is set after setting the Credentials
                client.Credentials = new NetworkCredential(smtpSettings.SenderEmail, smtpSettings.SenderPassword);
                client.DeliveryMethod = SmtpDeliveryMethod.Network;

                var mailMessage = new MailMessage
                {
                    From = new MailAddress(smtpSettings.SenderEmail),
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = true,
                };

                mailMessage.To.Add(email);

                try
                {
                    client.Send(mailMessage);
                    _logger.LogInformation($"AuthController: SendEmail: Email sent to {email}");
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, $"AuthController: SendEmail: Error sending email to {email}");
                }
            }
        }

    }
}
