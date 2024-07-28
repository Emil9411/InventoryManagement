using InventoryManagement.Server.Authorization.Models;
using InventoryManagement.Server.Authorization.Responses;
using InventoryManagement.Server.Context;
using InventoryManagement.Server.Model;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace InventoryManagement.Server.Authorization.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly ITokenService _tokenService;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AuthService> _logger;
        private readonly UnifiedContext _unifiedContext;

        public AuthService(UserManager<AppUser> userManager, ITokenService tokenService, IConfiguration configuration, ILogger<AuthService> logger, UnifiedContext unifiedContext)
        {
            _userManager = userManager;
            _tokenService = tokenService;
            _configuration = configuration;
            _logger = logger;
            _unifiedContext = unifiedContext;
        }

        public async Task<AuthResult> RegisterAsync(string email, string username, string password, string role)
        {
            var existingUser = await _userManager.FindByEmailAsync(email);
            if (existingUser != null)
            {
                _logger.LogError($"AuthService: User with email {email} already exists");
                return new AuthResult(false, email, "", "User with this email already exists");
            }
            existingUser = await _userManager.FindByNameAsync(username);
            if (existingUser != null)
            {
                _logger.LogError($"AuthService: User with username {username} already exists");
                return new AuthResult(false, "", username, "User with this username already exists");
            }

            var newUser = new AppUser
            {
                Email = email,
                UserName = username
            };

            var result = await _userManager.CreateAsync(newUser, password);
            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(newUser, role);
                _logger.LogInformation($"AuthService: User with email {email} created successfully");
                return new AuthResult(true, email, username, "");
            }
            else
            {
                _logger.LogError($"AuthService: Error creating user with email {email}");
                return FailedRegistration(result, email, username);
            }
        }

        public async Task<AuthResult> LoginAsync(string email, string password)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                _logger.LogError($"AuthService: User with email {email} not found");
                return BadCredentials();
            }

            var validPassword = await _userManager.CheckPasswordAsync(user, password);
            if (!validPassword)
            {
                _logger.LogError($"AuthService: Invalid password for user with email {email}");
                return BadCredentials();
            }

            var roles = await _userManager.GetRolesAsync(user);
            var accessToken = _tokenService.CreateToken(user, roles[0]);
            _logger.LogInformation($"AuthService: User with email {email} logged in successfully");
            return new AuthResult(true, email, user?.UserName ?? "", accessToken);
        }

        public async Task<AuthResult> ChangePasswordAsync(string email, string currentPassword, string newPassword)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                _logger.LogError($"AuthService: User with email {email} not found");
                return BadCredentials();
            }

            var validPassword = await _userManager.CheckPasswordAsync(user, currentPassword);
            if (!validPassword)
            {
                _logger.LogError($"AuthService: Invalid password for user with email {email}");
                return BadCredentials();
            }

            var result = await _userManager.ChangePasswordAsync(user, currentPassword, newPassword);
            if (result.Succeeded)
            {
                _logger.LogInformation($"AuthService: Password for user with email {email} changed successfully");
                return new AuthResult(true, email, user?.UserName ?? "", "");
            }
            else
            {
                _logger.LogError($"AuthService: Error changing password for user with email {email}");
                return FailedRegistration(result, email, user?.UserName ?? "");
            }
        }

        public async Task<ICollection<UserDto>> AllUsers()
        {
            var users = await _userManager.Users.ToListAsync();
            var userDtos = new List<UserDto>();
            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                userDtos.Add(new UserDto(user.Id, user.LastName, user.FirstName, user.City, user.PostalCode, user.Address, user.Email, user.PhoneNumber, user.UserName, roles[0], user.EmailConfirmed));
            }
            return userDtos;
        }

        public async Task<AuthResult> DeleteUser(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                _logger.LogError($"AuthService: User with email {email} not found");
                return BadCredentials();
            }

            var result = await _userManager.DeleteAsync(user);
            if (result.Succeeded)
            {
                _logger.LogInformation($"AuthService: User with email {email} deleted successfully");
                return new AuthResult(true, email, user.UserName, "");
            }
            else
            {
                _logger.LogError($"AuthService: Error deleting user with email {email}");
                return FailedRegistration(result, email, user.UserName);
            }
        }

        public async Task<UserDto> UpdateUserData(UserDto userDto)
        {
            var user = await _userManager.FindByIdAsync(userDto.Id);
            if (user == null)
            {
                _logger.LogError($"AuthService: User with id {userDto.Id} not found");
                return null;
            }

            user.LastName = userDto.LastName;
            user.FirstName = userDto.FirstName;
            user.City = userDto.City;
            user.PostalCode = userDto.PostalCode;
            user.Address = userDto.Address;
            user.PhoneNumber = userDto.PhoneNumber;

            await _userManager.UpdateAsync(user);
            _logger.LogInformation($"AuthService: User with id {userDto.Id} updated successfully");
            return userDto;
        }

        public async Task<UserDto> GetUserByEmail(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                _logger.LogError($"AuthService: User with email {email} not found");
                return null;
            }

            var roles = await _userManager.GetRolesAsync(user);
            return new UserDto(user.Id, user.LastName, user.FirstName, user.City, user.PostalCode, user.Address, user.Email, user.PhoneNumber, user.UserName, roles[0], user.EmailConfirmed);
        }

        public JwtSecurityToken Verify(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var issuerSigningKey = _configuration.GetSection("IssuerSigningKey").Value;
            var key = !string.IsNullOrEmpty(issuerSigningKey) ? Encoding.UTF8.GetBytes(issuerSigningKey) : throw new ArgumentNullException("IssuerSigningKey is null or empty");

            tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuerSigningKey = true,
                ValidateIssuer = false,
                ValidateAudience = false,
            }, out SecurityToken validatedToken);

            return (JwtSecurityToken)validatedToken;
        }

        public async Task<bool> VerifyEmail(string userId, string verificationCode)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                _logger.LogError($"AuthService: User with id {userId} not found");
                return false;
            }
            if (!string.IsNullOrEmpty(verificationCode))
            {
                var verifCode = _unifiedContext.VerificationCodes.FirstOrDefault(vc => vc.UserId == user.Id);
                if (verifCode == null)
                {
                    _logger.LogError($"AuthService: Verification code for user with id {userId} not found");
                    return false;
                }
                if (verifCode.Code == verificationCode)
                {
                    _unifiedContext.VerificationCodes.Remove(verifCode);
                    await _unifiedContext.SaveChangesAsync();
                    user.EmailConfirmed = true;
                    await _userManager.UpdateAsync(user);
                    _logger.LogInformation($"AuthService: Verification code for user with id {userId} verified successfully");
                    return true;
                }
            }
            _logger.LogError($"AuthService: Verification code for user with id {userId} not verified");
            return false;
        }

        private static AuthResult FailedRegistration(IdentityResult result, string email, string username)
        {
            var authResult = new AuthResult(false, email, username, "");
            foreach (var error in result.Errors)
            {
                authResult.ErrorMessages.Add(error.Code, error.Description);
            }
            return authResult;
        }

        private static AuthResult BadCredentials()
        {
            var result = new AuthResult(false, "", "", "");
            result.ErrorMessages.Add("Bad credentials", "Invalid email and/or password");
            return result;
        }
    }
}
