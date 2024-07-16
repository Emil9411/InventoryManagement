using InventoryManagement.Server.Model;
using Microsoft.EntityFrameworkCore;

namespace InventoryManagement.Server.Context
{
    public class VerifCodesContext : DbContext
    {
        public VerifCodesContext(DbContextOptions<VerifCodesContext> options) : base(options)
        {
        }

        public DbSet<VerificationCode> VerificationCodes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<VerificationCode>()
                .HasIndex(vc => vc.UserId)
                .IsUnique();
        }
    }
}
