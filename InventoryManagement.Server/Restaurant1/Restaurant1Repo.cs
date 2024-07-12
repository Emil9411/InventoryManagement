using InventoryManagement.Server.Context;
using InventoryManagement.Server.Model.Restaurants;
using InventoryManagement.Server.Restaurant1.Repository;

namespace InventoryManagement.Server.Restaurant1
{
    public class Restaurant1Repo : GenericRepo<Restaurant1Item>
    {
        public Restaurant1Repo(ItemContext context, ILogger<Restaurant1Repo> logger) : base(context, logger)
        {
        }
    }
}
