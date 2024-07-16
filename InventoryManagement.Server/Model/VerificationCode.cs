namespace InventoryManagement.Server.Model
{
    public class VerificationCode
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public string Code { get; set; }
        public DateTime ExpirationTime { get; set; }
    }
}
