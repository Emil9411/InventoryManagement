using InventoryManagement.Server.Context;
using InventoryManagement.Server.Model;
using Microsoft.EntityFrameworkCore;

namespace InventoryManagement.Server.Repository
{
    public class ItemRepo : IItemRepo
    {
        private readonly UnifiedContext _context;
        private readonly ILogger<ItemRepo> _logger;

        public ItemRepo(UnifiedContext context, ILogger<ItemRepo> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<Item> GetItemByIdAsync(int id)
        {
            if (id <= 0)
            {
                _logger.LogWarning($"Invalid id {id}");
                throw new ArgumentException($"Invalid id {id}");
            }

            var item = await _context.Items.FirstOrDefaultAsync(i => i.Id == id);

            if (item == null)
            {
                _logger.LogWarning($"Item with id {id} not found");
                throw new ArgumentException($"Item with id {id} not found");
            }

            _logger.LogInformation($"Item with id {id} found");
            return item;
        }

        public async Task<IEnumerable<Item>> GetItemByNameAsync(string name, int? inventoryId)
        {
            if (string.IsNullOrWhiteSpace(name))
            {
                _logger.LogWarning($"Invalid name {name}");
                throw new ArgumentException($"Invalid name {name}");
            }

            if (inventoryId.HasValue && inventoryId <= 0)
            {
                _logger.LogWarning($"Invalid inventory id {inventoryId}");
                throw new ArgumentException($"Invalid inventory id {inventoryId}");
            }

            if (inventoryId.HasValue)
            {
                var items = await _context.Items
                    .Where(i => i.Name.Contains(name) && i.InventoryId == inventoryId)
                    .ToListAsync();

                _logger.LogInformation($"Items with name {name} found in inventory {inventoryId}");
                return items;
            }
            else
            {
                var items = await _context.Items
                    .Where(i => i.Name.Contains(name))
                    .ToListAsync();

                _logger.LogInformation($"Items with name {name} found");
                return items;
            }
        }

        public async Task CreateItemAsync(Item item)
        {
            if (item == null)
            {
                _logger.LogWarning("Item is null");
                throw new ArgumentNullException(nameof(item), "Item is null");
            }

            if (item.InventoryId > 0)
            {
                var inventory = await _context.Inventories.FirstOrDefaultAsync(i => i.InventoryId == item.InventoryId);

                if (inventory == null)
                {
                    _logger.LogWarning($"Inventory with id {item.InventoryId} not found");
                    throw new ArgumentException($"Inventory with id {item.InventoryId} not found");
                }
                else
                {
                    item.Inventory = inventory;
                }
            }

            // Ensure the Id is set to the default value (e.g., 0 for int) before adding to context
            item.Id = 0;

            await _context.Items.AddAsync(item);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Item with id {item.Id} created");
        }


        public async Task UpdateItemAsync(Item item)
        {
            if (item == null)
            {
                _logger.LogWarning("Item is null");
                throw new ArgumentNullException("Item is null");
            }

            _context.Items.Update(item);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Item with id {item.Id} updated");
        }

        public async Task DeleteItemAsync(int id)
        {
            if (id <= 0)
            {
                _logger.LogWarning($"Invalid id {id}");
                throw new ArgumentException($"Invalid id {id}");
            }

            var item = await _context.Items.FirstOrDefaultAsync(i => i.Id == id);

            if (item == null)
            {
                _logger.LogWarning($"Item with id {id} not found");
                throw new ArgumentException($"Item with id {id} not found");
            }

            _context.Items.Remove(item);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Item with id {id} deleted");
        }

        public async Task<Item> UpdateShouldOrderStatusAsync(int id, bool shouldOrder)
        {
            if (id <= 0)
            {
                _logger.LogWarning($"Invalid id {id}");
                throw new ArgumentException($"Invalid id {id}");
            }

            var item = await _context.Items.FirstOrDefaultAsync(i => i.Id == id);

            if (item == null)
            {
                _logger.LogWarning($"Item with id {id} not found");
                throw new ArgumentException($"Item with id {id} not found");
            }

            item.ShouldOrder = shouldOrder;
            _context.Items.Update(item);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Item with id {id} should order status updated");
            return item;
        }

        public async Task<IEnumerable<Item>> GetAllItemsAsync(int? inventoryId)
        {
            if (inventoryId.HasValue && inventoryId <= 0)
            {
                _logger.LogWarning($"Invalid inventory id {inventoryId}");
                throw new ArgumentException($"Invalid inventory id {inventoryId}");
            }

            if (inventoryId.HasValue)
            {
                var items = await _context.Items
                    .Where(i => i.InventoryId == inventoryId)
                    .ToListAsync();

                _logger.LogInformation($"All items found in inventory {inventoryId}");
                return items;
            }
            else
            {
                var items = await _context.Items.ToListAsync();

                _logger.LogInformation("All items found");
                return items;
            }
        }

        public async Task<IEnumerable<Item>> GetAllIngredientsAsync(int? inventoryId)
        {
            if (inventoryId.HasValue && inventoryId <= 0)
            {
                _logger.LogWarning($"Invalid inventory id {inventoryId}");
                throw new ArgumentException($"Invalid inventory id {inventoryId}");
            }

            if (inventoryId.HasValue)
            {
                var items = await _context.Items
                    .Where(i => i.InventoryId == inventoryId && i.IsIngredient)
                    .ToListAsync();

                _logger.LogInformation($"All ingredients found in inventory {inventoryId}");
                return items;
            }
            else
            {
                var items = await _context.Items
                    .Where(i => i.IsIngredient)
                    .ToListAsync();

                _logger.LogInformation("All ingredients found");
                return items;
            }
        }

        public async Task<IEnumerable<Item>> GetAllNonIngredientsAsync(int? inventoryId)
        {
            if (inventoryId.HasValue && inventoryId <= 0)
            {
                _logger.LogWarning($"Invalid inventory id {inventoryId}");
                throw new ArgumentException($"Invalid inventory id {inventoryId}");
            }

            if (inventoryId.HasValue)
            {
                var items = await _context.Items
                    .Where(i => i.InventoryId == inventoryId && i.IsNonIngredient)
                    .ToListAsync();

                _logger.LogInformation($"All non-ingredients found in inventory {inventoryId}");
                return items;
            }
            else
            {
                var items = await _context.Items
                    .Where(i => !i.IsIngredient)
                    .ToListAsync();

                _logger.LogInformation("All non-ingredients found");
                return items;
            }
        }

        public async Task<IEnumerable<Item>> GetAllItemsToOrderAsync(int? inventoryId)
        {
            if (inventoryId.HasValue && inventoryId <= 0)
            {
                _logger.LogWarning($"Invalid inventory id {inventoryId}");
                throw new ArgumentException($"Invalid inventory id {inventoryId}");
            }

            if (inventoryId.HasValue)
            {
                var items = await _context.Items
                    .Where(i => i.InventoryId == inventoryId && i.ShouldOrder)
                    .ToListAsync();

                _logger.LogInformation($"All items to order found in inventory {inventoryId}");
                return items;
            }
            else
            {
                var items = await _context.Items
                    .Where(i => i.ShouldOrder)
                    .ToListAsync();

                _logger.LogInformation("All items to order found");
                return items;
            }
        }

        public async Task<IEnumerable<Item>> GetAllConsumableItemsAsync(int? inventoryId)
        {
            if (inventoryId.HasValue && inventoryId <= 0)
            {
                _logger.LogWarning($"Invalid inventory id {inventoryId}");
                throw new ArgumentException($"Invalid inventory id {inventoryId}");
            }

            if (inventoryId.HasValue)
            {
                var items = await _context.Items
                    .Where(i => i.InventoryId == inventoryId && i.IsConsumable)
                    .ToListAsync();

                _logger.LogInformation($"All consumable items found in inventory {inventoryId}");
                return items;
            }
            else
            {
                var items = await _context.Items
                    .Where(i => i.IsConsumable)
                    .ToListAsync();

                _logger.LogInformation("All consumable items found");
                return items;
            }
        }

        public async Task<IEnumerable<Item>> GetAllNonConsumableItemsAsync(int? inventoryId)
        {
            if (inventoryId.HasValue && inventoryId <= 0)
            {
                _logger.LogWarning($"Invalid inventory id {inventoryId}");
                throw new ArgumentException($"Invalid inventory id {inventoryId}");
            }

            if (inventoryId.HasValue)
            {
                var items = await _context.Items
                    .Where(i => i.InventoryId == inventoryId && i.IsNonConsumable)
                    .ToListAsync();

                _logger.LogInformation($"All non-consumable items found in inventory {inventoryId}");
                return items;
            }
            else
            {
                var items = await _context.Items
                    .Where(i => !i.IsConsumable)
                    .ToListAsync();

                _logger.LogInformation("All non-consumable items found");
                return items;
            }
        }

        public async Task<IEnumerable<Item>> GetAllEquipmentItemsAsync(int? inventoryId)
        {
            if (inventoryId.HasValue && inventoryId <= 0)
            {
                _logger.LogWarning($"Invalid inventory id {inventoryId}");
                throw new ArgumentException($"Invalid inventory id {inventoryId}");
            }

            if (inventoryId.HasValue)
            {
                var items = await _context.Items
                    .Where(i => i.InventoryId == inventoryId && i.IsEquipment)
                    .ToListAsync();

                _logger.LogInformation($"All equipment items found in inventory {inventoryId}");
                return items;
            }
            else
            {
                var items = await _context.Items
                    .Where(i => i.IsEquipment)
                    .ToListAsync();

                _logger.LogInformation("All equipment items found");
                return items;
            }
        }

        public async Task<IEnumerable<Item>> GetAllNonEquipmentItemsAsync(int? inventoryId)
        {
            if (inventoryId.HasValue && inventoryId <= 0)
            {
                _logger.LogWarning($"Invalid inventory id {inventoryId}");
                throw new ArgumentException($"Invalid inventory id {inventoryId}");
            }

            if (inventoryId.HasValue)
            {
                var items = await _context.Items
                    .Where(i => i.InventoryId == inventoryId && i.IsNonEquipment)
                    .ToListAsync();

                _logger.LogInformation($"All non-equipment items found in inventory {inventoryId}");
                return items;
            }
            else
            {
                var items = await _context.Items
                    .Where(i => !i.IsEquipment)
                    .ToListAsync();

                _logger.LogInformation("All non-equipment items found");
                return items;
            }
        }
    }
}
