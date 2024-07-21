namespace InventoryManagement.Server.Model
{
    public class Item
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Quantity { get; set; }
        public string QuantityUnit { get; set; }
        public int QuantityPerPackage { get; set; }
        public bool ShouldOrder { get; set; }
        public bool IsIngredient { get; set; }
        public bool IsConsumable { get; set; }
        public bool IsEquipment { get; set; }
        public int InventoryId { get; set; }
        public Inventory Inventory { get; set; }
    }
}
