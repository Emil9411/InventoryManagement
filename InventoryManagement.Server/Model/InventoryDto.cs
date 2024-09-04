namespace InventoryManagement.Server.Model
{
    public class InventoryDto
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

        // List of items related to this inventory, represented by ItemDTO
        public List<ItemDto> Items { get; set; }
    }
}
