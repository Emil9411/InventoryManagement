using InventoryManagement.Server.Model.Restaurants;
using Microsoft.EntityFrameworkCore;

namespace InventoryManagement.Server.Context
{
    public class ItemContext : DbContext
    {
        public ItemContext(DbContextOptions<ItemContext> options) : base(options)
        {
        }

        public DbSet<Restaurant1Item> Restaurant1Items { get; set; }
        public DbSet<Restaurant2Item> Restaurant2Items { get; set; }
        public DbSet<Restaurant3Item> Restaurant3Items { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Map each derived entity to its own table
            modelBuilder.Entity<Restaurant1Item>().ToTable("Restaurant1");
            modelBuilder.Entity<Restaurant2Item>().ToTable("Restaurant2");
            modelBuilder.Entity<Restaurant3Item>().ToTable("Restaurant3");

            // Create a unique index on the Name property for each table
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
