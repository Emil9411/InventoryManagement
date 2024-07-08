using InventoryManagement.Server.Model.Restaurants;

namespace InventoryManagement.Server.Restaurant1.Repository
{
    public interface IRestaurant1RepoAllItem
    {
        IEnumerable<Restaurant1Item> GetAllItems();
        IEnumerable<Restaurant1Item> GetAllMaterialItems();
        IEnumerable<Restaurant1Item> GetAllNonMaterialItems();
        IEnumerable<Restaurant1Item> GetAllItemsToOrder();
        IEnumerable<Restaurant1Item> GetAllFoodOrDrinkItems();
        IEnumerable<Restaurant1Item> GetAllNonFoodOrDrinkItems();
    }
}
