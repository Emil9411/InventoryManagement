using InventoryManagement.Server.Model;

namespace InventoryManagement.Server.Repository
{
    public interface IItemRepo
    {
        Task<Item> GetItemByIdAsync(int id);
        Task<IEnumerable<Item>> GetItemByNameAsync(string name, int? inventoryId);
        Task CreateItemAsync(Item item);
        Task UpdateItemAsync(Item item);
        Task DeleteItemAsync(int id);
        Task<Item> UpdateShouldOrderStatusAsync(int id, bool shouldOrder);
        Task<IEnumerable<Item>> GetAllItemsAsync(int? inventoryId);
        Task<IEnumerable<Item>> GetAllIngredientsAsync(int? inventoryId);
        Task<IEnumerable<Item>> GetAllNonIngredientsAsync(int? inventoryId);
        Task<IEnumerable<Item>> GetAllItemsToOrderAsync(int? inventoryId);
        Task<IEnumerable<Item>> GetAllConsumableItemsAsync(int? inventoryId);
        Task<IEnumerable<Item>> GetAllNonConsumableItemsAsync(int? inventoryId);
        Task<IEnumerable<Item>> GetAllEquipmentItemsAsync(int? inventoryId);
        Task<IEnumerable<Item>> GetAllNonEquipmentItemsAsync(int? inventoryId);
    }
}
