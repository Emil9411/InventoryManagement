using InventoryManagement.Server.Context;
using InventoryManagement.Server.Generics.Repository;
using InventoryManagement.Server.Model.Restaurants;

namespace InventoryManagement.Server.Restaurant2
{
    public class Restaurant2Repo : GenericRepo<Restaurant2Item>
    {
        public Restaurant2Repo(ItemContext context, ILogger<Restaurant2Repo> logger) : base(context, logger)
        {
        }
    }
}
