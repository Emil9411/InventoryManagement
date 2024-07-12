using InventoryManagement.Server.Generics.Controller;
using InventoryManagement.Server.Generics.Repository;
using InventoryManagement.Server.Model.Restaurants;
using Microsoft.AspNetCore.Mvc;

namespace InventoryManagement.Server.Restaurant3
{
    [ApiController]
    [Route("api/restaurant3/items")]
    public class Restaurant3Controller : GenericController<Restaurant3Item>
    {
        public Restaurant3Controller(IGenericRepo<Restaurant3Item> genericRepo, ILogger<GenericController<Restaurant3Item>> logger) : base(genericRepo, logger)
        {
        }
    }
}
