namespace InventoryManagement.Server.Model
{
    public class Item
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int? WeightInGrams { get; set; }
        public double? WeightInKilograms { get; set; }
        public int? QuantityInPieces { get; set; }
        public int? QuantityPerPackage { get; set; }
        public double? NetPricePerGram { get; set; }
        public double? NetPricePerKilogram { get; set; }
        public double? NetPricePerPiece { get; set; }
        public double? NetPricePerPackage { get; set; }
        public double? TaxRate { get; set; }
        public double? GrossPricePerGram { get; set; }
        public double? GrossPricePerKilogram { get; set; }
        public double? GrossPricePerPiece { get; set; }
        public double? GrossPricePerPackage { get; set; }
        public bool ShouldOrder { get; set; }
        public bool IsIngredient { get; set; }
        public bool IsConsumable { get; set; }
        public bool IsEquipment { get; set; }
        public int InventoryId { get; set; }
        public Inventory Inventory { get; set; }
    }
}
