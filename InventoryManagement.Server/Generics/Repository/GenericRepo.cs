using InventoryManagement.Server.Context;
using InventoryManagement.Server.Model;
using Microsoft.EntityFrameworkCore;

namespace InventoryManagement.Server.Generics.Repository
{
    public class GenericRepo<T> : IGenericRepo<T> where T : Item
    {
        private readonly UnifiedContext _context;
        private readonly ILogger<GenericRepo<T>> _logger;
        private readonly DbSet<T> _dbSet;

        public GenericRepo(UnifiedContext context, ILogger<GenericRepo<T>> logger)
        {
            _context = context;
            _logger = logger;
            _dbSet = context.Set<T>();
        }

        public async Task<T?> GetItemByIdAsync(int id)
        {
            var item = await _dbSet.FirstOrDefaultAsync(i => i.Id == id);
            if (item != null)
            {
                _logger.LogInformation($"Item with id {id} found");
                return item;
            }
            _logger.LogWarning($"Item with id {id} not found");
            return null;
        }

        public async Task<T?> GetItemByNameAsync(string name)
        {
            var item = await _dbSet.FirstOrDefaultAsync(i => i.Name == name);
            if (item != null)
            {
                _logger.LogInformation($"Item with name {name} found");
                return item;
            }
            _logger.LogWarning($"Item with name {name} not found");
            return null;
        }

        public async Task CreateItemAsync(T item)
        {
            if (item == null)
            {
                _logger.LogError("Item is null");
                return;
            }
            await _dbSet.AddAsync(item);
            await _context.SaveChangesAsync();
            _logger.LogInformation($"Item with id {item.Id} created");
        }

        public async Task UpdateItemAsync(T item)
        {
            if (item == null)
            {
                _logger.LogError("Item is null");
                return;
            }
            await _dbSet.AddAsync(item);
            await _context.SaveChangesAsync();
            _logger.LogInformation($"Item with id {item.Id} updated");
        }

        public async Task DeleteItemAsync(int id)
        {
            var item = await _dbSet.FirstOrDefaultAsync(i => i.Id == id);
            if (item != null)
            {
                _dbSet.Remove(item);
                await _context.SaveChangesAsync();
                _logger.LogInformation($"Item with id {id} deleted");
            }
            else
            {
                _logger.LogWarning($"Item with id {id} not found");
            }
        }

        public async Task<T?> UpdateShouldOrderStatusAsync(int id, bool shouldOrder)
        {
            var item = await _dbSet.FirstOrDefaultAsync(i => i.Id == id);
            if (item != null)
            {
                item.ShouldOrder = shouldOrder;
                _dbSet.Update(item);
                await _context.SaveChangesAsync();
                _logger.LogInformation($"Item with id {id} should order status updated");
                return item;
            }
            _logger.LogWarning($"Item with id {id} not found");
            return null;
        }

        public async Task<IEnumerable<T>> GetAllItemsAsync()
        {
            var items = await _dbSet.ToListAsync();
            if (items.Count == 0)
            {
                _logger.LogWarning($"No items found");
            }
            else
            {
                _logger.LogInformation($"All items retrieved");
            }
            return items;
        }

        public async Task<IEnumerable<T>> GetAllMaterialItemsAsync()
        {
            var items = await _dbSet.Where(i => i.IsMaterial).ToListAsync();
            if (items.Count == 0)
            {
                _logger.LogWarning($"No material items found");
            }
            else
            {
                _logger.LogInformation($"All material items retrieved");
            }
            return items;
        }

        public async Task<IEnumerable<T>> GetAllNonMaterialItemsAsync()
        {
            var items = await _dbSet.Where(i => !i.IsMaterial).ToListAsync();
            if (items.Count == 0)
            {
                _logger.LogWarning($"No non-material items found");
            }
            else
            {
                _logger.LogInformation($"All non-material items retrieved");
            }
            return items;
        }

        public async Task<IEnumerable<T>> GetAllItemsToOrderAsync()
        {
            var items = await _dbSet.Where(i => i.ShouldOrder).ToListAsync();
            if (items.Count == 0)
            {
                _logger.LogWarning($"No items to order found");
            }
            else
            {
                _logger.LogInformation($"All items to order retrieved");
            }
            return items;
        }

        public async Task<IEnumerable<T>> GetAllFoodOrDrinkItemsAsync()
        {
            var items = await _dbSet.Where(i => i.IsFoodOrDrink).ToListAsync();
            if (items.Count == 0)
            {
                _logger.LogWarning($"No food or drink items found");
            }
            else
            {
                _logger.LogInformation($"All food or drink items retrieved");
            }
            return items;
        }

        public async Task<IEnumerable<T>> GetAllNonFoodOrDrinkItemsAsync()
        {
            var items = await _dbSet.Where(i => !i.IsFoodOrDrink).ToListAsync();
            if (items.Count == 0)
            {
                _logger.LogWarning($"No non-food or drink items found");
            }
            else
            {
                _logger.LogInformation($"All non-food or drink items retrieved");
            }
            return items;
        }
    }
}
