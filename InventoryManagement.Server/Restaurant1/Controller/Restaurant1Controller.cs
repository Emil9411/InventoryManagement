using InventoryManagement.Server.Model.Restaurants;
using InventoryManagement.Server.Restaurant1.Repository;
using Microsoft.AspNetCore.Mvc;

namespace InventoryManagement.Server.Restaurant1.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class Restaurant1Controller : ControllerBase
    {
        private readonly IRestaurant1RepoSingleItem _singleItemRepo;
        private readonly IRestaurant1RepoAllItem _allItemRepo;
        private readonly ILogger<Restaurant1Controller> _logger;

        public Restaurant1Controller(IRestaurant1RepoSingleItem singleItemRepo, IRestaurant1RepoAllItem allItemRepo, ILogger<Restaurant1Controller> logger)
        {
            _singleItemRepo = singleItemRepo;
            _allItemRepo = allItemRepo;
            _logger = logger;
        }

        [HttpGet("getall")]
        public ActionResult<IEnumerable<Restaurant1Item>> GetAllItems()
        {
            var items = _allItemRepo.GetAllItems();
            if (items != null)
            {
                _logger.LogInformation("All items in Restaurant1 retrieved");
                return Ok(items);
            }
            _logger.LogWarning("No items found in Restaurant1");
            return NotFound("No items found in Restaurant1");
        }

        [HttpGet("get/{id}")]
        public ActionResult<Restaurant1Item> GetItemById(int id)
        {
            var item = _singleItemRepo.GetItemById(id);
            if (item != null)
            {
                _logger.LogInformation($"Item with id {id} found in Restaurant1");
                return Ok(item);
            }
            _logger.LogWarning($"Item with id {id} not found in Restaurant1");
            return NotFound($"Item with id {id} not found in Restaurant1");
        }

        [HttpGet("getbyname/{name}")]
        public ActionResult<Restaurant1Item> GetItemByName(string name)
        {
            var item = _singleItemRepo.GetItemByName(name);
            if (item != null)
            {
                _logger.LogInformation($"Item with name {name} found in Restaurant1");
                return Ok(item);
            }
            _logger.LogWarning($"Item with name {name} not found in Restaurant1");
            return NotFound($"Item with name {name} not found in Restaurant1");
        }

        [HttpPost("create")]
        public ActionResult CreateItem([FromBody] Restaurant1Item item)
        {
            if (item == null)
            {
                _logger.LogError("Item is null in Restaurant1");
                return BadRequest("Item is null in Restaurant1");
            }
            _singleItemRepo.CreateItem(item);
            _logger.LogInformation($"Item with id {item.Id} created in Restaurant1");
            return Ok($"Item with id {item.Id} created in Restaurant1");
        }

        [HttpPut("update")]
        public ActionResult UpdateItem([FromBody] Restaurant1Item item)
        {
            if (item == null)
            {
                _logger.LogError("Item is null in Restaurant1");
                return BadRequest("Item is null in Restaurant1");
            }
            _singleItemRepo.UpdateItem(item);
            _logger.LogInformation($"Item with id {item.Id} updated in Restaurant1");
            return Ok($"Item with id {item.Id} updated in Restaurant1");
        }

        [HttpDelete("delete/{id}")]
        public ActionResult DeleteItem(int id)
        {
            _singleItemRepo.DeleteItem(id);
            _logger.LogInformation($"Item with id {id} deleted in Restaurant1");
            return Ok($"Item with id {id} deleted in Restaurant1");
        }

        [HttpGet("getmaterialitems")]
        public ActionResult<IEnumerable<Restaurant1Item>> GetAllMaterialItems()
        {
            var items = _allItemRepo.GetAllMaterialItems();
            if (items != null)
            {
                _logger.LogInformation("All material items in Restaurant1 retrieved");
                return Ok(items);
            }
            _logger.LogWarning("No material items found in Restaurant1");
            return NotFound("No material items found in Restaurant1");
        }

        [HttpGet("getnonmaterialitems")]
        public ActionResult<IEnumerable<Restaurant1Item>> GetAllNonMaterialItems()
        {
            var items = _allItemRepo.GetAllNonMaterialItems();
            if (items != null)
            {
                _logger.LogInformation("All non-material items in Restaurant1 retrieved");
                return Ok(items);
            }
            _logger.LogWarning("No non-material items found in Restaurant1");
            return NotFound("No non-material items found in Restaurant1");
        }

        [HttpGet("getitemstoorder")]
        public ActionResult<IEnumerable<Restaurant1Item>> GetAllItemsToOrder()
        {
            var items = _allItemRepo.GetAllItemsToOrder();
            if (items != null)
            {
                _logger.LogInformation("All items to order in Restaurant1 retrieved");
                return Ok(items);
            }
            _logger.LogWarning("No items to order found in Restaurant1");
            return NotFound("No items to order found in Restaurant1");
        }

        [HttpGet("getfoodordrinkitems")]
        public ActionResult<IEnumerable<Restaurant1Item>> GetAllFoodOrDrinkItems()
        {
            var items = _allItemRepo.GetAllFoodOrDrinkItems();
            if (items != null)
            {
                _logger.LogInformation("All food or drink items in Restaurant1 retrieved");
                return Ok(items);
            }
            _logger.LogWarning("No food or drink items found in Restaurant1");
            return NotFound("No food or drink items found in Restaurant1");
        }

        [HttpGet("getnonfoodordrinkitems")]
        public ActionResult<IEnumerable<Restaurant1Item>> GetAllNonFoodOrDrinkItems()
        {
            var items = _allItemRepo.GetAllNonFoodOrDrinkItems();
            if (items != null)
            {
                _logger.LogInformation("All non-food or drink items in Restaurant1 retrieved");
                return Ok(items);
            }
            _logger.LogWarning("No non-food or drink items found in Restaurant1");
            return NotFound("No non-food or drink items found in Restaurant1");
        }

        [HttpGet("shouldorder/{id}/{shouldOrder}")]
        public ActionResult ShouldOrderItem(int id, bool shouldOrder)
        {
            var item = _singleItemRepo.ShouldOrderItem(id, shouldOrder);
            if (item != null)
            {
                _logger.LogInformation($"Item with id {id} should order status updated in Restaurant1");
                return Ok($"Item with id {id} should order status updated in Restaurant1");
            }
            _logger.LogWarning($"Item with id {id} not found in Restaurant1");
            return NotFound($"Item with id {id} not found in Restaurant1");
        }
    }
}
