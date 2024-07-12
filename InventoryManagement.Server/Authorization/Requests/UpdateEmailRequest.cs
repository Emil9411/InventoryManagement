using System.ComponentModel.DataAnnotations;

namespace InventoryManagement.Server.Authorization.Requests
{
    public record UpdateEmailRequest([Required] string Email,
                                     [Required] string NewEmail);
}
