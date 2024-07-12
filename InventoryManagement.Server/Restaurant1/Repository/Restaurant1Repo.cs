using InventoryManagement.Server.Context;
using InventoryManagement.Server.Model.Restaurants;

namespace InventoryManagement.Server.Restaurant1.Repository
{
    public class Restaurant1Repo : IRestaurant1RepoSingleItem, IRestaurant1RepoAllItem
    {
        private readonly ItemContext _context;
        private readonly ILogger<Restaurant1Repo> _logger;

        public Restaurant1Repo(ItemContext context, ILogger<Restaurant1Repo> logger)
        {
            _context = context;
            _logger = logger;
        }

        public Restaurant1Item? GetItemById(int id)
        {
            var item = _context.Restaurant1Items.FirstOrDefault(i => i.Id == id);
            if (item != null)
            {
                _logger.LogInformation($"Item with id {id} found in Restaurant1");
                return item;
            }
            _logger.LogWarning($"Item with id {id} not found in Restaurant1");
            return null;
        }

        public Restaurant1Item? GetItemByName(string name)
        {
            var item = _context.Restaurant1Items.FirstOrDefault(i => i.Name == name);
            if (item != null)
            {
                _logger.LogInformation($"Item with name {name} found in Restaurant1");
                return item;
            }
            _logger.LogWarning($"Item with name {name} not found in Restaurant1");
            return null;
        }

        public void CreateItem(Restaurant1Item item)
        {
            if (item == null)
            {
                _logger.LogError("Item is null in Restaurant1");
                return;
            }
            _context.Restaurant1Items.Add(item);
            _context.SaveChanges();
            _logger.LogInformation($"Item with id {item.Id} created in Restaurant1");
        }

        public void UpdateItem(Restaurant1Item item)
        {
            if (item == null)
            {
                _logger.LogError("Item is null in Restaurant1");
                return;
            }
            _context.Restaurant1Items.Update(item);
            _context.SaveChanges();
            _logger.LogInformation($"Item with id {item.Id} updated in Restaurant1");
        }

        public void DeleteItem(int id)
        {
            var item = _context.Restaurant1Items.FirstOrDefault(i => i.Id == id);
            if (item != null)
            {
                _context.Restaurant1Items.Remove(item);
                _context.SaveChanges();
                _logger.LogInformation($"Item with id {id} deleted in Restaurant1");
            }
            _logger.LogWarning($"Item with id {id} not found in Restaurant1");
        }

        public Restaurant1Item? ShouldOrderItem(int id, bool shouldOrder)
        {
            var item = _context.Restaurant1Items.FirstOrDefault(i => i.Id == id);
            if (item != null)
            {
                item.ShouldOrder = shouldOrder;
                _context.Restaurant1Items.Update(item);
                _context.SaveChanges();
                _logger.LogInformation($"Item with id {id} should order updated in Restaurant1");
                return item;
            }
            _logger.LogWarning($"Item with id {id} not found in Restaurant1");
            return null;
        }

        public IEnumerable<Restaurant1Item> GetAllItems()
        {
            var items = _context.Restaurant1Items.ToList();
            if (items.Count == 0)
            {
                _logger.LogWarning($"No items found in Restaurant1");
                return null;
            }
            _logger.LogInformation($"All items in Restaurant1 retrieved");
            return items;
        }

        public IEnumerable<Restaurant1Item> GetAllMaterialItems()
        {
            var items = _context.Restaurant1Items.Where(i => i.IsMaterial).ToList();
            if (items.Count == 0)
            {
                _logger.LogWarning($"No material items found in Restaurant1");
                return null;
            }
            _logger.LogInformation($"All material items in Restaurant1 retrieved");
            return items;
        }

        public IEnumerable<Restaurant1Item> GetAllNonMaterialItems()
        {
            var items = _context.Restaurant1Items.Where(i => !i.IsMaterial).ToList();
            if (items.Count == 0)
            {
                _logger.LogWarning($"No non-material items found in Restaurant1");
                return null;
            }
            _logger.LogInformation($"All non-material items in Restaurant1 retrieved");
            return items;
        }

        public IEnumerable<Restaurant1Item> GetAllItemsToOrder()
        {
            var items = _context.Restaurant1Items.Where(i => i.ShouldOrder).ToList();
            if (items.Count == 0)
            {
                _logger.LogWarning($"No items to order found in Restaurant1");
                return null;
            }
            _logger.LogInformation($"All items to order in Restaurant1 retrieved");
            return items;
        }

        public IEnumerable<Restaurant1Item> GetAllFoodOrDrinkItems()
        {
            var items = _context.Restaurant1Items.Where(i => i.IsFoodOrDrink).ToList();
            if (items.Count == 0)
            {
                _logger.LogWarning($"No food or drink items found in Restaurant1");
                return null;
            }
            _logger.LogInformation($"All food or drink items in Restaurant1 retrieved");
            return items;
        }

        public IEnumerable<Restaurant1Item> GetAllNonFoodOrDrinkItems()
        {
            var items = _context.Restaurant1Items.Where(i => !i.IsFoodOrDrink).ToList();
            if (items.Count == 0)
            {
                _logger.LogWarning($"No non-food or drink items found in Restaurant1");
                return null;
            }
            _logger.LogInformation($"All non-food or drink items in Restaurant1 retrieved");
            return items;
        }
    }
}
