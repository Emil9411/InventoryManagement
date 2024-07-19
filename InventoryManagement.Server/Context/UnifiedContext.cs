using InventoryManagement.Server.Model;
using InventoryManagement.Server.Model.Restaurants;
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
        public DbSet<Restaurant1Item> Restaurant1Items { get; set; }
        public DbSet<Restaurant2Item> Restaurant2Items { get; set; }
        public DbSet<Restaurant3Item> Restaurant3Items { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // VerificationCode configuration
            modelBuilder.Entity<VerificationCode>()
                .HasIndex(vc => vc.UserId)
                .IsUnique();

            // ItemContext configurations
            modelBuilder.Entity<Restaurant1Item>().ToTable("Restaurant1");
            modelBuilder.Entity<Restaurant2Item>().ToTable("Restaurant2");
            modelBuilder.Entity<Restaurant3Item>().ToTable("Restaurant3");

            modelBuilder.Entity<Restaurant1Item>()
                .HasIndex(i => i.Name)
                .IsUnique();
            modelBuilder.Entity<Restaurant2Item>()
                .HasIndex(i => i.Name)
                .IsUnique();
            modelBuilder.Entity<Restaurant3Item>()
                .HasIndex(i => i.Name)
                .IsUnique();
        }
    }
}
