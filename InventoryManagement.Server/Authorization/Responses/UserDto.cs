namespace InventoryManagement.Server.Authorization.Responses
{
    public record UserDto(string Id,
                          string LastName,
                          string FirstName,
                          string City,
                          string PostalCode,
                          string Address,
                          string Email,
                          string PhoneNumber,
                          string UserName,
                          string Role,
                          bool EmailConfirmed);
}
