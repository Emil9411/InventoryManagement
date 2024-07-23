using InventoryManagement.Server.Model;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace InventoryManagement.Server.Context
{
    public class UnifiedContext : IdentityDbContext<AppUser, IdentityRole, string>
    {
        public UnifiedContext(DbContextOptions<UnifiedContext> options) : base(options)
        {
        }

        public DbSet<VerificationCode> VerificationCodes { get; set; }
        public DbSet<Inventory> Inventories { get; set; }
        public DbSet<Item> Items { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Item>()
                .HasOne(i => i.Inventory)
                .WithMany(i => i.Items)
                .HasForeignKey(i => i.InventoryId);
            modelBuilder.Entity<Item>()
                .HasIndex(i => new { i.Name, i.InventoryId })
                .IsUnique();

            modelBuilder.Entity<Inventory>()
                .HasMany(i => i.Employees)
                .WithOne(u => u.Inventory)
                .HasForeignKey(u => u.InventoryId);
            modelBuilder.Entity<Inventory>()
                .HasMany(i => i.Items)
                .WithOne(i => i.Inventory)
                .HasForeignKey(i => i.InventoryId);
            modelBuilder.Entity<Inventory>()
                .HasIndex(i => i.Name)
                .IsUnique();

            modelBuilder.Entity<AppUser>()
                .HasOne(u => u.Inventory)
                .WithMany(i => i.Employees)
                .HasForeignKey(u => u.InventoryId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
