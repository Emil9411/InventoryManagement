using InventoryManagement.Server.Model.Restaurants;

namespace InventoryManagement.Server.Restaurant1.Repository
{
    public interface IRestaurant1RepoSingleItem
    {
        Restaurant1Item? GetItemById(int id);
        Restaurant1Item? GetItemByName(string name);
        void CreateItem(Restaurant1Item item);
        void UpdateItem(Restaurant1Item item);
        void DeleteItem(int id);
    }
}
