using InventoryManagement.Server.Generics.Repository;
using InventoryManagement.Server.Model;
using Microsoft.AspNetCore.Mvc;

namespace InventoryManagement.Server.Generics.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class GenericController<T> : ControllerBase where T : Item
    {
        private readonly IGenericRepo<T> _genericRepo;
        private readonly ILogger<GenericController<T>> _logger;

        public GenericController(IGenericRepo<T> genericRepo, ILogger<GenericController<T>> logger)
        {
            _genericRepo = genericRepo;
            _logger = logger;
        }

        [HttpGet("getall")]
        public async Task<IActionResult> GetAllItems()
        {
            var items = await _genericRepo.GetAllItemsAsync();
            if (items != null)
            {
                _logger.LogInformation("All items retrieved");
                return Ok(items);
            }
            _logger.LogWarning("No items found");
            return NotFound("No items found");
        }

        [HttpGet("get/{id}")]
        public async Task<IActionResult> GetItemById(int id)
        {
            var item = await _genericRepo.GetItemByIdAsync(id);
            if (item != null)
            {
                _logger.LogInformation($"Item with id {id} found");
                return Ok(item);
            }
            _logger.LogWarning($"Item with id {id} not found");
            return NotFound($"Item with id {id} not found");
        }

        [HttpGet("getbyname/{name}")]
        public async Task<IActionResult> GetItemByName(string name)
        {
            var item = await _genericRepo.GetItemByNameAsync(name);
            if (item != null)
            {
                _logger.LogInformation($"Item with name {name} found");
                return Ok(item);
            }
            _logger.LogWarning($"Item with name {name} not found");
            return NotFound($"Item with name {name} not found");
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateItem([FromBody] T item)
        {
            if (item == null)
            {
                _logger.LogError("Item is null");
                return BadRequest("Item is null");
            }
            await _genericRepo.CreateItemAsync(item);
            _logger.LogInformation($"Item with id {item.Id} created");
            return Ok($"Item with id {item.Id} created");
        }

        [HttpPut("update")]
        public async Task<IActionResult> UpdateItem([FromBody] T item)
        {
            if (item == null)
            {
                _logger.LogError("Item is null");
                return BadRequest("Item is null");
            }
            await _genericRepo.UpdateItemAsync(item);
            _logger.LogInformation($"Item with id {item.Id} updated");
            return Ok($"Item with id {item.Id} updated");
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteItem(int id)
        {
            await _genericRepo.DeleteItemAsync(id);
            _logger.LogInformation($"Item with id {id} deleted");
            return Ok($"Item with id {id} deleted");
        }

        [HttpGet("getmaterialitems")]
        public async Task<IActionResult> GetAllMaterialItems()
        {
            var items = await _genericRepo.GetAllMaterialItemsAsync();
            if (items != null)
            {
                _logger.LogInformation("All material items retrieved");
                return Ok(items);
            }
            _logger.LogWarning("No material items found");
            return NotFound("No material items found");
        }

        [HttpGet("getnonmaterialitems")]
        public async Task<IActionResult> GetAllNonMaterialItems()
        {
            var items = await _genericRepo.GetAllNonMaterialItemsAsync();
            if (items != null)
            {
                _logger.LogInformation("All non-material items retrieved");
                return Ok(items);
            }
            _logger.LogWarning("No non-material items found");
            return NotFound("No non-material items found");
        }

        [HttpGet("getitemstoorder")]
        public async Task<IActionResult> GetAllItemsToOrder()
        {
            var items = await _genericRepo.GetAllItemsToOrderAsync();
            if (items != null)
            {
                _logger.LogInformation("All items to order retrieved");
                return Ok(items);
            }
            _logger.LogWarning("No items to order found");
            return NotFound("No items to order found");
        }

        [HttpGet("getfoodordrinkitems")]
        public async Task<IActionResult> GetAllFoodOrDrinkItems()
        {
            var items = await _genericRepo.GetAllFoodOrDrinkItemsAsync();
            if (items != null)
            {
                _logger.LogInformation("All food or drink items retrieved");
                return Ok(items);
            }
            _logger.LogWarning("No food or drink items found");
            return NotFound("No food or drink items found");
        }

        [HttpGet("getnonfoodordrinkitems")]
        public async Task<IActionResult> GetAllNonFoodOrDrinkItems()
        {
            var items = await _genericRepo.GetAllNonFoodOrDrinkItemsAsync();
            if (items != null)
            {
                _logger.LogInformation("All non-food or drink items retrieved");
                return Ok(items);
            }
            _logger.LogWarning("No non-food or drink items found");
            return NotFound("No non-food or drink items found");
        }

        [HttpGet("shouldorder/{id}/{shouldOrder}")]
        public async Task<IActionResult> ShouldOrderItem(int id, bool shouldOrder)
        {
            var item = await _genericRepo.UpdateShouldOrderStatusAsync(id, shouldOrder);
            if (item != null)
            {
                _logger.LogInformation($"Item with id {id} should order status updated");
                return Ok($"Item with id {id} should order status updated");
            }
            _logger.LogWarning($"Item with id {id} not found");
            return NotFound($"Item with id {id} not found");
        }
    }
}
