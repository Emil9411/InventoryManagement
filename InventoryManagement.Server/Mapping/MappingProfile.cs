using AutoMapper;
using InventoryManagement.Server.Model;

namespace InventoryManagement.Server.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Item, ItemDto>().ReverseMap();
            CreateMap<Inventory, InventoryDto>().ReverseMap();
        }
    }
}
