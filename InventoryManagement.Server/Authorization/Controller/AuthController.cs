using InventoryManagement.Server.Authorization.Requests;
using InventoryManagement.Server.Authorization.Responses;
using InventoryManagement.Server.Authorization.Services;
using InventoryManagement.Server.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace InventoryManagement.Server.Authorization.Controller
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;
        private readonly IConfiguration _configuration;
        private readonly IEmailSender _emailSender;
        private readonly UserManager<AppUser> _userManager;

        public AuthController(IAuthService authService, ILogger<AuthController> logger, IConfiguration configuration, IEmailSender emailSender, UserManager<AppUser> userManager)
        {
            _authService = authService;
            _logger = logger;
            _configuration = configuration;
            _emailSender = emailSender;
            _userManager = userManager;
        }

        [HttpPost("register"), Authorize(Roles = "Admin, Manager")]
        public async Task<IActionResult> Registration([FromBody] RegistrationRequest request)
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

            var verificationCode = _emailSender.GenerateVerificationCode();
            _emailSender.SaveVerificationCode(result.Email, verificationCode);
            _emailSender.SendEmail(result.Username, result.Email, "Email Verification", "Please verify your email address", verificationCode);

            _logger.LogInformation($"AuthController: User with email {result.Email} and username {result.Username} registered successfully");
            return CreatedAtAction(nameof(Registration), new AuthResponse(result.Email, result.Username, request.Role));
        }

        [HttpPost("verify/{userId}")]
        public async Task<IActionResult> VerifyEmail(string userId, [FromBody] VerifyRequest request)
        {
            var result = await _authService.VerifyEmail(userId, request.VerificationCode);
            var user = await _userManager.FindByIdAsync(userId);

            if (!result)
            {
                _emailSender.SendEmail(user.UserName, user.Email, "Email Verification", "Email verification failed", null);
                _logger.LogError($"AuthController: Email verification failed for user with id {userId}");
                return BadRequest("Email verification failed");
            }

            _emailSender.SendEmail(user.UserName, user.Email, "Email Verification", "Email verified successfully", null);
            _logger.LogInformation($"AuthController: Email verified successfully for user with id {userId}");
            return Ok("Email verified successfully");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] AuthRequest request)
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

            var user = await _userManager.FindByEmailAsync(request.Email);

            if (!user.EmailConfirmed)
            {
                _logger.LogError($"AuthController: Login failed for user with email {request.Email} because email is not verified");
                return BadRequest("Email is not verified");
            }

            var roles = await _userManager.GetRolesAsync(user);

            Response.Cookies.Append("Authorization", result.Token, new CookieOptions
            {
                HttpOnly = true,
            });

            _logger.LogInformation($"AuthController: User with email {request.Email} logged in successfully");
            return Ok(new AuthResponse(request.Email, result.Username, roles[0]));
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
                var role = claims.FirstOrDefault(c => c.Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/role")?.Value ?? "";

                _logger.LogInformation("AuthController: WhoAmI: User found");
                return Ok(new AuthResponse(email, username, role));
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

            var cookieData = _authService.Verify(cookie);

            if (cookieData == null)
            {
                _logger.LogError("AuthController: ChangePassword: Invalid cookie");
                return Unauthorized("AuthController: ChangePassword: Invalid cookie");
            }

            var claims = cookieData.Claims.ToList();
            var email = claims.FirstOrDefault(c => c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress")?.Value ?? "";
            var username = claims.FirstOrDefault(c => c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name")?.Value ?? "";

            var result = await _authService.ChangePasswordAsync(email, request.OldPassword, request.NewPassword);

            if (!result.Success)
            {
                _logger.LogError($"AuthController: ChangePassword failed for user with email {result.Email}");
                return BadRequest(result.ErrorMessages);
            }

            _emailSender.SendEmail(username, email, "Password Change", "Your password has been changed", null);
            _logger.LogInformation($"AuthController: ChangePassword: Password changed successfully for user with email {result.Email}");
            return Ok("Password changed successfully");
        }

        [HttpDelete("delete/{email}"), Authorize(Roles = "Admin, Manager")]
        public async Task<IActionResult> DeleteUser(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            var result = await _authService.DeleteUser(email);

            if (!result.Success)
            {
                _logger.LogError($"AuthController: DeleteUser failed for user with email {email}");
                return BadRequest(result.ErrorMessages);
            }

            _emailSender.SendEmail(user.UserName, user.Email, "Account Deletion", "Your account has been deleted", null);
            _logger.LogInformation($"AuthController: DeleteUser: User with email {email} deleted successfully");
            return Ok("User deleted successfully");
        }
    }
}
