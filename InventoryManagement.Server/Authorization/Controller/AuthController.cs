using InventoryManagement.Server.Authorization.Requests;
using InventoryManagement.Server.Authorization.Responses;
using InventoryManagement.Server.Authorization.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InventoryManagement.Server.Authorization.Controller
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IAuthService authService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
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
    }
}
