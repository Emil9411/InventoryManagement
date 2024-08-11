namespace InventoryManagement.Server.Model
{
    public class Inventory
    {
        public int InventoryId { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public string PostalCode { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string? ManagerId { get; set; }
        public ICollection<AppUser>? Employees { get; set; }
        public ICollection<Item>? Items { get; set; }
    }
}
