using InventoryManagement.Server.Model;

namespace InventoryManagement.Server.Restaurant1.Repository
{
    public interface IGenericRepo<T> where T : Item
    {
        Task<T?> GetItemByIdAsync(int id);
        Task<T?> GetItemByNameAsync(string name);
        Task CreateItemAsync(T item);
        Task UpdateItemAsync(T item);
        Task DeleteItemAsync(int id);
        Task<T?> UpdateShouldOrderStatusAsync(int id, bool shouldOrder);
        Task<IEnumerable<T>> GetAllItemsAsync();
        Task<IEnumerable<T>> GetAllMaterialItemsAsync();
        Task<IEnumerable<T>> GetAllNonMaterialItemsAsync();
        Task<IEnumerable<T>> GetAllItemsToOrderAsync();
        Task<IEnumerable<T>> GetAllFoodOrDrinkItemsAsync();
        Task<IEnumerable<T>> GetAllNonFoodOrDrinkItemsAsync();
    }
}
