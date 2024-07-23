using Microsoft.AspNetCore.Identity;

namespace InventoryManagement.Server.Model
{
    public class AppUser : IdentityUser
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Address { get; set; }
        public string? City { get; set; }
        public string? Country { get; set; }
        public string? PostalCode { get; set; }
        public int? InventoryId { get; set; }
        public Inventory Inventory { get; set; }
    }
}
