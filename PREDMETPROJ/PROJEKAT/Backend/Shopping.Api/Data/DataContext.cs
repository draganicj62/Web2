using Microsoft.EntityFrameworkCore;
using Shopping.Api.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Shopping.Api.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }
        public DbSet<User> Users { get; set; }
        public DbSet<Article> Articles { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<Item> Items { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(DataContext).Assembly);
            modelBuilder.Entity<User>()
                .HasIndex(x => x.Email)
                .IsUnique();
            modelBuilder.Entity<User>()
                .HasIndex(x => x.Username)
                .IsUnique();
            modelBuilder.Entity<Order>()
                .HasOne(o => o.Seller)
                .WithMany(u => u.Orders)
                .HasForeignKey(o => o.SellerId)
                .OnDelete(DeleteBehavior.NoAction);
            modelBuilder.Entity<Item>()
                .HasOne(i => i.Order)
                .WithOne(u => u.Item)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
