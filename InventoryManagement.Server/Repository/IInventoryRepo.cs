using InventoryManagement.Server.Model;

namespace InventoryManagement.Server.Repository
{
    public interface IInventoryRepo
    {
        Task<Inventory> GetInventoryByIdAsync(int id);
        Task<IEnumerable<Inventory>> GetAllInventoriesAsync();
        Task CreateInventoryAsync(Inventory inventory);
        Task DeleteInventoryAsync(int id);
        Task UpdateInventoryAsync(Inventory inventory);
        Task<bool> InventoryExistsAsync(int id);
        Task AddEmployeeToInventoryAsync(int inventoryId, int employeeId);
        Task RemoveEmployeeFromInventoryAsync(int inventoryId, int employeeId);
        Task<IEnumerable<AppUser>> GetEmployeesByInventoryIdAsync(int inventoryId);

    }
}
