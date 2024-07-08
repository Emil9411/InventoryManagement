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

    }
}
