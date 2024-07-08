namespace InventoryManagement.Server.Model
{
    public abstract class Item
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public int Quantity { get; set; }
        public string? QuantityUnit { get; set; }
        public int QuantityPerPackage { get; set; }
        public bool ShouldOrder { get; set; }
        public bool IsMaterial { get; set; }
    }
}
