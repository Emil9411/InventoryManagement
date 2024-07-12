using InventoryManagement.Server.Context;
using InventoryManagement.Server.Generics.Repository;
using InventoryManagement.Server.Model.Restaurants;

namespace InventoryManagement.Server.Restaurant3
{
    public class Restaurant3Repo : GenericRepo<Restaurant3Item>
    {
        public Restaurant3Repo(ItemContext context, ILogger<Restaurant3Repo> logger) : base(context, logger)
        {
        }
    }
}
