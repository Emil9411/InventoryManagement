using InventoryManagement.Server.Generics.Controller;
using InventoryManagement.Server.Generics.Repository;
using InventoryManagement.Server.Model.Restaurants;
using Microsoft.AspNetCore.Mvc;

namespace InventoryManagement.Server.Inventories.Restaurant3
{
    [ApiController]
    [Route("api/restaurant3/items")]
    public class Restaurant3Controller(IGenericRepo<Restaurant3Item> genericRepo, ILogger<GenericController<Restaurant3Item>> logger) : GenericController<Restaurant3Item>(genericRepo, logger)
    {
    }
}
