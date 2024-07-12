using InventoryManagement.Server.Context;
using InventoryManagement.Server.Generics.Repository;
using InventoryManagement.Server.Model.Restaurants;

namespace InventoryManagement.Server.Inventories.Restaurant1
{
    public class Restaurant1Repo : GenericRepo<Restaurant1Item>
    {
        public Restaurant1Repo(ItemContext context, ILogger<Restaurant1Repo> logger) : base(context, logger)
        {
        }
    }
}
