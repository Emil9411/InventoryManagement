using InventoryManagement.Server.Model;
using InventoryManagement.Server.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InventoryManagement.Server.Controller
{
    [Route("api/inventory")]
    [ApiController]
    public class InventoryController : ControllerBase
    {
        private readonly IInventoryRepo _inventoryRepo;
        private readonly IItemRepo _itemRepo;
        private readonly ILogger<InventoryController> _logger;

        public InventoryController(IInventoryRepo inventoryRepo, IItemRepo itemRepo, ILogger<InventoryController> logger)
        {
            _inventoryRepo = inventoryRepo;
            _itemRepo = itemRepo;
            _logger = logger;
        }

        [HttpGet("{id}/items"), Authorize(Roles = "Admin, Manager, User")]
        public async Task<ActionResult<IEnumerable<Item>>> GetAllItemsByInventoryId(int id)
        {
            var items = await _itemRepo.GetAllItemsAsync(id);
            if (items == null)
            {
                _logger.LogError($"InventoryController: GetAllItemsByInventoryId: Items for inventory with id {id} not found");
                return NotFound($"Items for inventory with id {id} not found");
            }
            _logger.LogInformation($"InventoryController: GetAllItemsByInventoryId: Items for inventory with id {id} retrieved");
            return Ok(items);
        }

        [HttpGet("{id}/ingredients"), Authorize(Roles = "Admin, Manager, User")]
        public async Task<ActionResult<IEnumerable<Item>>> GetAllIngredientsByInventoryId(int id)
        {
            var items = await _itemRepo.GetAllIngredientsAsync(id);
            if (items == null)
            {
                _logger.LogError($"InventoryController: GetAllIngredientsByInventoryId: Ingredients for inventory with id {id} not found");
                return NotFound($"Ingredients for inventory with id {id} not found");
            }
            _logger.LogInformation($"InventoryController: GetAllIngredientsByInventoryId: Ingredients for inventory with id {id} retrieved");
            return Ok(items);
        }

        [HttpGet("{id}/noningredients"), Authorize(Roles = "Admin, Manager, User")]
        public async Task<ActionResult<IEnumerable<Item>>> GetAllNonIngredientsByInventoryId(int id)
        {
            var items = await _itemRepo.GetAllNonIngredientsAsync(id);
            if (items == null)
            {
                _logger.LogError($"InventoryController: GetAllNonIngredientsByInventoryId: Non-ingredients for inventory with id {id} not found");
                return NotFound($"Non-ingredients for inventory with id {id} not found");
            }
            _logger.LogInformation($"InventoryController: GetAllNonIngredientsByInventoryId: Non-ingredients for inventory with id {id} retrieved");
            return Ok(items);
        }

        [HttpGet("{id}/itemstoorder"), Authorize(Roles = "Admin, Manager, User")]
        public async Task<ActionResult<IEnumerable<Item>>> GetAllItemsToOrderByInventoryId(int id)
        {
            var items = await _itemRepo.GetAllItemsToOrderAsync(id);
            if (items == null)
            {
                _logger.LogError($"InventoryController: GetAllItemsToOrderByInventoryId: Items to order for inventory with id {id} not found");
                return NotFound($"Items to order for inventory with id {id} not found");
            }
            _logger.LogInformation($"InventoryController: GetAllItemsToOrderByInventoryId: Items to order for inventory with id {id} retrieved");
            return Ok(items);
        }

        [HttpGet("{id}/consumableitems"), Authorize(Roles = "Admin, Manager, User")]
        public async Task<ActionResult<IEnumerable<Item>>> GetAllConsumableItemsByInventoryId(int id)
        {
            var items = await _itemRepo.GetAllConsumableItemsAsync(id);
            if (items == null)
            {
                _logger.LogError($"InventoryController: GetAllConsumableItemsByInventoryId: Consumable items for inventory with id {id} not found");
                return NotFound($"Consumable items for inventory with id {id} not found");
            }
            _logger.LogInformation($"InventoryController: GetAllConsumableItemsByInventoryId: Consumable items for inventory with id {id} retrieved");
            return Ok(items);
        }

        [HttpGet("{id}/noneconsumableitems"), Authorize(Roles = "Admin, Manager, User")]
        public async Task<ActionResult<IEnumerable<Item>>> GetAllNonConsumableItemsByInventoryId(int id)
        {
            var items = await _itemRepo.GetAllNonConsumableItemsAsync(id);
            if (items == null)
            {
                _logger.LogError($"InventoryController: GetAllNonConsumableItemsByInventoryId: Non-consumable items for inventory with id {id} not found");
                return NotFound($"Non-consumable items for inventory with id {id} not found");
            }
            _logger.LogInformation($"InventoryController: GetAllNonConsumableItemsByInventoryId: Non-consumable items for inventory with id {id} retrieved");
            return Ok(items);
        }

        [HttpGet("{id}/equipmentitems"), Authorize(Roles = "Admin, Manager, User")]
        public async Task<ActionResult<IEnumerable<Item>>> GetAllEquipmentItemsByInventoryId(int id)
        {
            var items = await _itemRepo.GetAllEquipmentItemsAsync(id);
            if (items == null)
            {
                _logger.LogError($"InventoryController: GetAllEquipmentItemsByInventoryId: Equipment items for inventory with id {id} not found");
                return NotFound($"Equipment items for inventory with id {id} not found");
            }
            _logger.LogInformation($"InventoryController: GetAllEquipmentItemsByInventoryId: Equipment items for inventory with id {id} retrieved");
            return Ok(items);
        }

        [HttpGet("{id}/nonequipmentitems"), Authorize(Roles = "Admin, Manager, User")]
        public async Task<ActionResult<IEnumerable<Item>>> GetAllNonEquipmentItemsByInventoryId(int id)
        {
            var items = await _itemRepo.GetAllNonEquipmentItemsAsync(id);
            if (items == null)
            {
                _logger.LogError($"InventoryController: GetAllNonEquipmentItemsByInventoryId: Non-equipment items for inventory with id {id} not found");
                return NotFound($"Non-equipment items for inventory with id {id} not found");
            }
            _logger.LogInformation($"InventoryController: GetAllNonEquipmentItemsByInventoryId: Non-equipment items for inventory with id {id} retrieved");
            return Ok(items);
        }

        [HttpGet("{id}"), Authorize(Roles = "Admin, Manager")]
        public async Task<ActionResult<Inventory>> GetInventoryById(int id)
        {
            var inventory = await _inventoryRepo.GetInventoryByIdAsync(id);
            if (inventory == null)
            {
                _logger.LogError($"InventoryController: GetInventoryById: Inventory with id {id} not found");
                return NotFound($"Inventory with id {id} not found");
            }
            _logger.LogInformation($"InventoryController: GetInventoryById: Inventory with id {id} retrieved");
            return Ok(inventory);
        }

        [HttpGet("all"), Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<Inventory>>> GetAllInventories()
        {
            var inventories = await _inventoryRepo.GetAllInventoriesAsync();
            if (inventories == null)
            {
                _logger.LogError("InventoryController: GetAllInventories: No inventories found");
                return NotFound("No inventories found");
            }
            _logger.LogInformation("InventoryController: GetAllInventories: All inventories retrieved");
            return Ok(inventories);
        }

        [HttpPost("create"), Authorize(Roles = "Admin")]
        public async Task<ActionResult<Inventory>> CreateInventory(Inventory inventory)
        {
            await _inventoryRepo.CreateInventoryAsync(inventory);
            _logger.LogInformation($"InventoryController: CreateInventory: Inventory with id {inventory.InventoryId} created");
            return CreatedAtAction(nameof(GetInventoryById), new { id = inventory.InventoryId }, inventory);
        }

        [HttpPut("update"), Authorize(Roles = "Admin")]
        public async Task<ActionResult<Inventory>> UpdateInventory(Inventory inventory)
        {
            await _inventoryRepo.UpdateInventoryAsync(inventory);
            _logger.LogInformation($"InventoryController: UpdateInventory: Inventory with id {inventory.InventoryId} updated");
            return Ok(inventory);
        }

        [HttpDelete("delete/{id}"), Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeleteInventory(int id)
        {
            await _inventoryRepo.DeleteInventoryAsync(id);
            _logger.LogInformation($"InventoryController: DeleteInventory: Inventory with id {id} deleted");
            return Ok();
        }

        [HttpGet("exists/{id}"), Authorize(Roles = "Admin, Manager, User")]
        public async Task<ActionResult<bool>> InventoryExists(int id)
        {
            var exists = await _inventoryRepo.InventoryExistsAsync(id);
            _logger.LogInformation($"InventoryController: InventoryExists: Inventory with id {id} exists: {exists}");
            return Ok(exists);
        }

        [HttpPost("{inventoryId}/addemployee/{employeeId}"), Authorize(Roles = "Admin, Manager")]
        public async Task<ActionResult> AddEmployeeToInventory(int inventoryId, int employeeId)
        {
            await _inventoryRepo.AddEmployeeToInventoryAsync(inventoryId, employeeId);
            _logger.LogInformation($"InventoryController: AddEmployeeToInventory: Employee with id {employeeId} added to inventory with id {inventoryId}");
            return Ok();
        }

        [HttpDelete("{inventoryId}/removeemployee/{employeeId}"), Authorize(Roles = "Admin, Manager")]
        public async Task<ActionResult> RemoveEmployeeFromInventory(int inventoryId, int employeeId)
        {
            await _inventoryRepo.RemoveEmployeeFromInventoryAsync(inventoryId, employeeId);
            _logger.LogInformation($"InventoryController: RemoveEmployeeFromInventory: Employee with id {employeeId} removed from inventory with id {inventoryId}");
            return Ok();
        }

        [HttpGet("{id}/employees"), Authorize(Roles = "Admin, Manager")]
        public async Task<ActionResult<IEnumerable<AppUser>>> GetEmployeesByInventoryId(int id)
        {
            var employees = await _inventoryRepo.GetEmployeesByInventoryIdAsync(id);
            if (employees == null)
            {
                _logger.LogError($"InventoryController: GetEmployeesByInventoryId: Employees for inventory with id {id} not found");
                return NotFound($"Employees for inventory with id {id} not found");
            }
            _logger.LogInformation($"InventoryController: GetEmployeesByInventoryId: Employees for inventory with id {id} retrieved");
            return Ok(employees);
        }
    }
}
