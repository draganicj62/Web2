using Microsoft.EntityFrameworkCore;
using Shopping.Api.Interfaces.IRepositories;
using Shopping.Api.Models;
using System.Runtime.CompilerServices;

namespace Shopping.Api.Data.Repositories
{
    public class OrderRepository : IOrderRepository
    {
        private readonly DataContext _data;

        public OrderRepository(DataContext data)
        {
            _data = data;
        }

        public async Task<List<Order>> History(int id)
        {
            var historys = await _data.Orders
                .Include(o => o.Item)
                    .ThenInclude(i => i.Article)
                .Where(o => (o.UserId == id || o.SellerId == id) && o.Status == "Delivered")
                .ToListAsync();
            return historys;
        }

        public async Task<Order> CreatePayPal(Order newOrder)
        {
            var article = await _data.Articles.SingleOrDefaultAsync(x => x.Id == newOrder.Item.ArticleId);
            if (article.Quantity < newOrder.Item.Quantity)
                return null;
            //Random random = new Random();
            //int randomMinutes = random.Next(1, 59);
            newOrder.CreationTime = DateTime.Now;
            //newOrder.DeliveryTime = DateTime.Now.AddHours(1).AddMinutes(randomMinutes);
            newOrder.Status = "Pending";
            newOrder.Price = (article.Price * newOrder.Item.Quantity) + 7;
            var result = await _data.Orders.AddAsync(newOrder);
            article.Quantity -= newOrder.Item.Quantity;
            await _data.SaveChangesAsync();
            return result.Entity;
        }

        public async Task<Order> Create(Order newOrder)
        {
            var article = await _data.Articles.SingleOrDefaultAsync(x => x.Id == newOrder.Item.ArticleId);
            if (article.Quantity < newOrder.Item.Quantity)
                return null;
            Random random = new Random();
            int randomMinutes = random.Next(1, 59);
            newOrder.CreationTime = DateTime.Now;
            newOrder.DeliveryTime = DateTime.Now.AddHours(1).AddMinutes(randomMinutes);
            newOrder.Status = "Delivering";
            newOrder.Price = (article.Price * newOrder.Item.Quantity) + 7;
            var result = await _data.Orders.AddAsync(newOrder);
            article.Quantity -= newOrder.Item.Quantity;
            await _data.SaveChangesAsync();
            return result.Entity;
        }

        public async Task<bool> GetQuanityOrder(Order newOrder)
        {
            var article = await _data.Articles.SingleOrDefaultAsync(x => x.Id == newOrder.Item.ArticleId);
            if (article.Quantity < newOrder.Item.Quantity)
                return false;
            else
                return true;
        }

        public async Task<List<Order>> AllOrders()
        {
            var orders = await _data.Orders
                .Include(o => o.Item)
                    .ThenInclude(i => i.Article)
                .ToListAsync();
            return orders;
        }

        public async Task<List<Order>> GetActiveOrders(int id)
        {
            var sellerOrders = await _data.Orders
                .Where(o => o.SellerId == id && (o.Status == "Delivering" || o.Status == "Pending"))
                .Include(o => o.Item)
                    .ThenInclude(i => i.Article)
                .ToListAsync();
            var userOrders = await _data.Orders.Where(o => o.UserId == id && (o.Status == "Delivering" || o.Status == "Pending"))
                .Include(o => o.Item)
                    .ThenInclude(i => i.Article)
                .ToListAsync();

            if (sellerOrders != null && sellerOrders.Count > 0)
                return sellerOrders;
            if (userOrders != null && userOrders.Count > 0)
                return userOrders;
            return null;
        }

        public async Task<List<Order>> GetActiveOrdersUnclamed(int id)
        {
            var sellerOrders = await _data.Orders
                .Where(o => o.SellerId == id && (o.Status == "Pending"))
                .Include(o => o.Item)
                    .ThenInclude(i => i.Article)
                .ToListAsync();
            var userOrders = await _data.Orders.Where(o => o.UserId == id && ( o.Status == "Pending"))
                .Include(o => o.Item)
                    .ThenInclude(i => i.Article)
                .ToListAsync();

            if (sellerOrders != null && sellerOrders.Count > 0)
                return sellerOrders;
            if (userOrders != null && userOrders.Count > 0)
                return userOrders;
            return null;
        }

        public async Task<Order> GetActiveOrderUnclamed(int id)
        {
            var order = await _data.Orders.FirstOrDefaultAsync(o => o.Id == id && o.Status == "Pending");
            return order;
        }

        public async Task<Order> UnclamedConfirm(int id)
        {
            var order = await _data.Orders.FirstOrDefaultAsync(o => o.Id == id && o.Status == "Pending");
            Random random = new Random();
            int randomMinutes = random.Next(1, 59);
            order.DeliveryTime = DateTime.Now.AddHours(1).AddMinutes(randomMinutes);
            order.Status = "Delivering";
            await _data.SaveChangesAsync();
            return order;
        }

        public async Task<bool> CancelOrder(int orderId, int userId)
        {
            var order = await _data.Orders
                .Where(o => o.Id == orderId)
                .Include(o => o.Item)
                .SingleOrDefaultAsync();
            if (order == null || order.UserId != userId)
                return false;

            TimeSpan elapsed = DateTime.Now - order.CreationTime;
            if(elapsed.TotalHours < 1)
                return false;

            var article = await _data.Articles.Where(a => a.Id == order.Item.ArticleId).SingleOrDefaultAsync();
            if (article == null)
                return false;

            article.Quantity += order.Item.Quantity;
            order.Status = "Cancelled"; 
            await _data.SaveChangesAsync();
            return true;
        }

        public async Task UpdateStatus()
        {
            var orders = await _data.Orders.Where(o => o.Status == "Delivering").ToListAsync();

            foreach (var order in orders)
            {
                if (order.DeliveryTime < DateTime.Now)
                    order.Status = "Delivered";
            }

            await _data.SaveChangesAsync();
        }
    }
}
