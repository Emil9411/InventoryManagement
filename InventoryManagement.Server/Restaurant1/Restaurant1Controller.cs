using InventoryManagement.Server.Model.Restaurants;
using InventoryManagement.Server.Restaurant1.Controller;
using InventoryManagement.Server.Restaurant1.Repository;
using Microsoft.AspNetCore.Mvc;

namespace InventoryManagement.Server.Restaurant1
{
    [ApiController]
    [Route("api/restaurant1/items")]
    public class Restaurant1Controller : GenericController<Restaurant1Item>
    {
        public Restaurant1Controller(IGenericRepo<Restaurant1Item> genericRepo, ILogger<GenericController<Restaurant1Item>> logger) : base(genericRepo, logger)
        {
        }
    }
}
