using InventoryManagement.Server.Context;
using InventoryManagement.Server.Model;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace InventoryManagement.Server.Repository
{
    public class InventoryRepo : IInventoryRepo
    {
        private readonly UnifiedContext _context;
        private readonly UserManager<AppUser> _userManager;
        private readonly ILogger<InventoryRepo> _logger;

        public InventoryRepo(UnifiedContext context, ILogger<InventoryRepo> logger, UserManager<AppUser> userManager)
        {
            _context = context;
            _logger = logger;
            _userManager = userManager;
        }

        public async Task CreateInventoryAsync(Inventory inventory)
        {
            if (inventory == null)
            {
                _logger.LogError("InventoryRepo: CreateInventoryAsync: inventory is null");
                throw new ArgumentNullException(nameof(inventory));
            }
            await _context.Inventories.AddAsync(inventory);
            await _context.SaveChangesAsync();
            _logger.LogInformation($"InventoryRepo: CreateInventoryAsync: Inventory with id {inventory.InventoryId} created");
        }

        public async Task DeleteInventoryAsync(int id)
        {
            var inventory = await _context.Inventories.FindAsync(id);
            if (inventory == null)
            {
                _logger.LogError($"InventoryRepo: DeleteInventoryAsync: Inventory with id {id} not found");
                throw new ArgumentNullException(nameof(inventory));
            }
            _context.Inventories.Remove(inventory);
            await _context.SaveChangesAsync();
            _logger.LogInformation($"InventoryRepo: DeleteInventoryAsync: Inventory with id {id} deleted");
        }

        public async Task<IEnumerable<Inventory>> GetAllInventoriesAsync()
        {
            var inventories = await _context.Inventories.ToListAsync();
            _logger.LogInformation("InventoryRepo: GetAllInventoriesAsync: All inventories retrieved");
            return inventories;
        }

        public async Task<Inventory> GetInventoryByIdAsync(int id)
        {
            var inventory = await _context.Inventories.FindAsync(id);
            if (inventory == null)
            {
                _logger.LogError($"InventoryRepo: GetInventoryByIdAsync: Inventory with id {id} not found");
                throw new ArgumentNullException(nameof(inventory));
            }
            _logger.LogInformation($"InventoryRepo: GetInventoryByIdAsync: Inventory with id {id} retrieved");
            return inventory;
        }

        public async Task UpdateInventoryAsync(Inventory inventory)
        {
            if (inventory == null)
            {
                _logger.LogError("InventoryRepo: UpdateInventoryAsync: inventory is null");
                throw new ArgumentNullException(nameof(inventory));
            }
            _context.Inventories.Update(inventory);
            await _context.SaveChangesAsync();
            _logger.LogInformation($"InventoryRepo: UpdateInventoryAsync: Inventory with id {inventory.InventoryId} updated");
        }

        public async Task<bool> InventoryExistsAsync(int id)
        {
            var inventory = await _context.Inventories.FindAsync(id);
            if (inventory == null)
            {
                _logger.LogError($"InventoryRepo: InventoryExistsAsync: Inventory with id {id} not found");
                return false;
            }
            _logger.LogInformation($"InventoryRepo: InventoryExistsAsync: Inventory with id {id} exists");
            return true;
        }

        public async Task AddEmployeeToInventoryAsync(int inventoryId, int employeeId)
        {
            var inventory = await _context.Inventories.FindAsync(inventoryId);
            var employee = await _userManager.FindByIdAsync(employeeId.ToString());
            if (inventory == null)
            {
                _logger.LogError($"InventoryRepo: AddEmployeeToInventoryAsync: Inventory with id {inventoryId} not found");
                throw new ArgumentNullException(nameof(inventory));
            }
            if (employee == null)
            {
                _logger.LogError($"InventoryRepo: AddEmployeeToInventoryAsync: Employee with id {employeeId} not found");
                throw new ArgumentNullException(nameof(employee));
            }
            inventory.Employees.Add(employee);
            await _context.SaveChangesAsync();
            _logger.LogInformation($"InventoryRepo: AddEmployeeToInventoryAsync: Employee with id {employeeId} added to inventory with id {inventoryId}");
        }

        public async Task RemoveEmployeeFromInventoryAsync(int inventoryId, int employeeId)
        {
            var inventory = await _context.Inventories.FindAsync(inventoryId);
            var employee = await _userManager.FindByIdAsync(employeeId.ToString());
            if (inventory == null)
            {
                _logger.LogError($"InventoryRepo: RemoveEmployeeFromInventoryAsync: Inventory with id {inventoryId} not found");
                throw new ArgumentNullException(nameof(inventory));
            }
            if (employee == null)
            {
                _logger.LogError($"InventoryRepo: RemoveEmployeeFromInventoryAsync: Employee with id {employeeId} not found");
                throw new ArgumentNullException(nameof(employee));
            }
            inventory.Employees.Remove(employee);
            await _context.SaveChangesAsync();
            _logger.LogInformation($"InventoryRepo: RemoveEmployeeFromInventoryAsync: Employee with id {employeeId} removed from inventory with id {inventoryId}");
        }

        public async Task<IEnumerable<AppUser>> GetEmployeesByInventoryIdAsync(int inventoryId)
        {
            var inventory = await _context.Inventories.FindAsync(inventoryId);
            if (inventory == null)
            {
                _logger.LogError($"InventoryRepo: GetEmployeesByInventoryIdAsync: Inventory with id {inventoryId} not found");
                throw new ArgumentNullException(nameof(inventory));
            }
            _logger.LogInformation($"InventoryRepo: GetEmployeesByInventoryIdAsync: Employees in inventory with id {inventoryId} retrieved");
            return inventory.Employees;
        }
    }
}
