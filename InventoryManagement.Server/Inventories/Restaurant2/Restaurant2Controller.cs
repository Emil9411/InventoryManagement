﻿using InventoryManagement.Server.Generics.Controller;
using InventoryManagement.Server.Generics.Repository;
using InventoryManagement.Server.Model.Restaurants;
using Microsoft.AspNetCore.Mvc;

namespace InventoryManagement.Server.Inventories.Restaurant2
{
    [ApiController]
    [Route("api/restaurant2/items")]
    public class Restaurant2Controller(IGenericRepo<Restaurant2Item> genericRepo, ILogger<GenericController<Restaurant2Item>> logger) : GenericController<Restaurant2Item>(genericRepo, logger)
    {
    }
}
