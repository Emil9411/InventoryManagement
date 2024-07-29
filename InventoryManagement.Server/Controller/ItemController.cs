using InventoryManagement.Server.Model;
using InventoryManagement.Server.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InventoryManagement.Server.Controller
{
    [Route("api/item")]
    [ApiController]
    public class ItemController : ControllerBase
    {
        private readonly IItemRepo _itemRepo;
        private readonly ILogger<ItemController> _logger;

        public ItemController(IItemRepo itemRepo, ILogger<ItemController> logger)
        {
            _itemRepo = itemRepo;
            _logger = logger;
        }

        [HttpGet("get/{id}"), Authorize(Roles = "Admin, Manager, User")]
        public async Task<IActionResult> GetItemById(int id)
        {
            var item = await _itemRepo.GetItemByIdAsync(id);

            if (item == null)
            {
                _logger.LogError($"ItemController: Item with id {id} not found");
                return NotFound("Item not found");
            }

            _logger.LogInformation($"ItemController: Item with id {id} retrieved successfully");
            return Ok(item);
        }

        [HttpGet("getByName/{name}"), Authorize(Roles = "Admin, Manager")]
        public async Task<IActionResult> GetItemByName(string name)
        {
            var items = await _itemRepo.GetItemByNameAsync(name, null);

            if (items == null)
            {
                _logger.LogError($"ItemController: Item/s with name {name} not found");
                return NotFound("Item/s not found");
            }

            _logger.LogInformation($"ItemController: Item/s with name {name} retrieved successfully");
            return Ok(items);
        }

        [HttpGet("getByName/{name}/inventory/{inventoryId}"), Authorize(Roles = "Admin, Manager, User")]
        public async Task<IActionResult> GetItemByName(string name, int inventoryId)
        {
            var items = await _itemRepo.GetItemByNameAsync(name, inventoryId);

            if (items == null)
            {
                _logger.LogError($"ItemController: Item with name {name} not found in inventory with id {inventoryId}");
                return NotFound("Item not found");
            }

            _logger.LogInformation($"ItemController: Item with name {name} retrieved successfully from inventory with id {inventoryId}");
            return Ok(items);
        }

        [HttpPost("create"), Authorize(Roles = "Admin, Manager")]
        public async Task<IActionResult> CreateItem([FromBody] Item item)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogError("ItemController: Invalid item creation request");
                return BadRequest("Invalid item creation request");
            }

            await _itemRepo.CreateItemAsync(item);
            _logger.LogInformation($"ItemController: Item with name {item.Name} created successfully");
            return CreatedAtAction(nameof(CreateItem), item);
        }

        [HttpPatch("update"), Authorize(Roles = "Admin, Manager")]
        public async Task<IActionResult> UpdateItem([FromBody] Item item)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogError("ItemController: Invalid item update request");
                return BadRequest("Invalid item update request");
            }

            await _itemRepo.UpdateItemAsync(item);
            _logger.LogInformation($"ItemController: Item with id {item.Id} updated successfully");
            return Ok("Item updated successfully");
        }

        [HttpDelete("delete/{id}"), Authorize(Roles = "Admin, Manager")]
        public async Task<IActionResult> DeleteItem(int id)
        {
            await _itemRepo.DeleteItemAsync(id);
            _logger.LogInformation($"ItemController: Item with id {id} deleted successfully");
            return Ok("Item deleted successfully");
        }

        [HttpPatch("updateShouldOrderStatus/{id}/{shouldOrder}"), Authorize(Roles = "Admin, Manager")]
        public async Task<IActionResult> UpdateShouldOrderStatus(int id, bool shouldOrder)
        {
            var item = await _itemRepo.UpdateShouldOrderStatusAsync(id, shouldOrder);

            if (item == null)
            {
                _logger.LogError($"ItemController: Item with id {id} not found");
                return NotFound("Item not found");
            }

            _logger.LogInformation($"ItemController: Should order status updated successfully for item with id {id}");
            return Ok(item);
        }

        [HttpGet("getAllItems"), Authorize(Roles = "Admin, Manager")]
        public async Task<IActionResult> GetAllItems()
        {
            var items = await _itemRepo.GetAllItemsAsync(null);

            if (items == null)
            {
                _logger.LogError("ItemController: No items found");
                return NotFound("No items found");
            }

            _logger.LogInformation("ItemController: All items retrieved successfully");
            return Ok(items);
        }

        [HttpGet("getAllIngredients"), Authorize(Roles = "Admin, Manager")]
        public async Task<IActionResult> GetAllIngredients()
        {
            var items = await _itemRepo.GetAllIngredientsAsync(null);

            if (items == null)
            {
                _logger.LogError("ItemController: No ingredients found");
                return NotFound("No ingredients found");
            }

            _logger.LogInformation("ItemController: All ingredients retrieved successfully");
            return Ok(items);
        }

        [HttpGet("getAllNonIngredients"), Authorize(Roles = "Admin, Manager")]
        public async Task<IActionResult> GetAllNonIngredients()
        {
            var items = await _itemRepo.GetAllNonIngredientsAsync(null);

            if (items == null)
            {
                _logger.LogError("ItemController: No non-ingredients found");
                return NotFound("No non-ingredients found");
            }

            _logger.LogInformation("ItemController: All non-ingredients retrieved successfully");
            return Ok(items);
        }

        [HttpGet("getAllItemsToOrder"), Authorize(Roles = "Admin, Manager")]
        public async Task<IActionResult> GetAllItemsToOrder()
        {
            var items = await _itemRepo.GetAllItemsToOrderAsync(null);

            if (items == null)
            {
                _logger.LogError("ItemController: No items to order found");
                return NotFound("No items to order found");
            }

            _logger.LogInformation("ItemController: All items to order retrieved successfully");
            return Ok(items);
        }

        [HttpGet("getAllConsumableItems"), Authorize(Roles = "Admin, Manager")]
        public async Task<IActionResult> GetAllConsumableItems()
        {
            var items = await _itemRepo.GetAllConsumableItemsAsync(null);

            if (items == null)
            {
                _logger.LogError("ItemController: No consumable items found");
                return NotFound("No consumable items found");
            }

            _logger.LogInformation("ItemController: All consumable items retrieved successfully");
            return Ok(items);
        }

        [HttpGet("getAllNonConsumableItems"), Authorize(Roles = "Admin, Manager")]
        public async Task<IActionResult> GetAllNonConsumableItems()
        {
            var items = await _itemRepo.GetAllNonConsumableItemsAsync(null);

            if (items == null)
            {
                _logger.LogError("ItemController: No non-consumable items found");
                return NotFound("No non-consumable items found");
            }

            _logger.LogInformation("ItemController: All non-consumable items retrieved successfully");
            return Ok(items);
        }

        [HttpGet("getAllEquipmentItems"), Authorize(Roles = "Admin, Manager")]
        public async Task<IActionResult> GetAllEquipmentItems()
        {
            var items = await _itemRepo.GetAllEquipmentItemsAsync(null);

            if (items == null)
            {
                _logger.LogError("ItemController: No equipment items found");
                return NotFound("No equipment items found");
            }

            _logger.LogInformation("ItemController: All equipment items retrieved successfully");
            return Ok(items);
        }

        [HttpGet("getAllNonEquipmentItems"), Authorize(Roles = "Admin, Manager")]
        public async Task<IActionResult> GetAllNonEquipmentItems()
        {
            var items = await _itemRepo.GetAllNonEquipmentItemsAsync(null);

            if (items == null)
            {
                _logger.LogError("ItemController: No non-equipment items found");
                return NotFound("No non-equipment items found");
            }

            _logger.LogInformation("ItemController: All non-equipment items retrieved successfully");
            return Ok(items);
        }
    }
}
