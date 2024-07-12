using InventoryManagement.Server.Model;
using Microsoft.AspNetCore.Identity;

namespace InventoryManagement.Server.Authorization.Seeder
{
    public class AuthSeeder
    {
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly UserManager<AppUser> _userManager;

        public AuthSeeder(RoleManager<IdentityRole> roleManager, UserManager<AppUser> userManager)
        {
            _roleManager = roleManager;
            _userManager = userManager;
        }

        public void AddRoles()
        {
            var tAdmin = CreateAdminRole(_roleManager);
            tAdmin.Wait();

            var tUser = CreateUserRole(_roleManager);
            tUser.Wait();
        }

        public void AddAmin()
        {
            var tAdmin = CreateAdminIfNotExists();
            tAdmin.Wait();
        }

        public void AddTestUser()
        {
            var tUser = CreateTestUserIfNotExists();
            tUser.Wait();
        }

        private async Task CreateAdminIfNotExists()
        {
            var adminInDb = await _userManager.FindByEmailAsync("admin@admin.com");
            if (adminInDb == null)
            {
                var admin = new AppUser { UserName = "admin", Email = "admin@admin.com" };
                var adminCreated = await _userManager.CreateAsync(admin, "admin123");

                if (adminCreated.Succeeded)
                {
                    await _userManager.AddToRoleAsync(admin, "Admin");
                }
            }
        }

        private async Task CreateTestUserIfNotExists()
        {
            var userInDb = await _userManager.FindByEmailAsync("test@test.com");
            if (userInDb == null)
            {
                var user = new AppUser { UserName = "test", Email = "test@test.com" };
                var userCreated = await _userManager.CreateAsync(user, "test123");

                if (userCreated.Succeeded)
                {
                    await _userManager.AddToRoleAsync(user, "User");
                }
            }
        }

        private static async Task CreateAdminRole(RoleManager<IdentityRole> roleManager)
        {
            await roleManager.CreateAsync(new IdentityRole("Admin"));
        }

        private static async Task CreateUserRole(RoleManager<IdentityRole> roleManager)
        {
            await roleManager.CreateAsync(new IdentityRole("User"));
        }
    }
}
