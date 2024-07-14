using InventoryManagement.Server.Generics.Controller;
using InventoryManagement.Server.Generics.Repository;
using InventoryManagement.Server.Model.Restaurants;
using Microsoft.AspNetCore.Mvc;

namespace InventoryManagement.Server.Inventories.Restaurant1
{
    [ApiController]
    [Route("api/restaurant1/items")]
    public class Restaurant1Controller(IGenericRepo<Restaurant1Item> genericRepo, ILogger<GenericController<Restaurant1Item>> logger) : GenericController<Restaurant1Item>(genericRepo, logger)
    {
    }
}
