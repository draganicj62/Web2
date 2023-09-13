using Shopping.Api.Models;

namespace Shopping.Api.Interfaces.IRepositories
{
    public interface IOrderRepository
    {
        public Task<List<Order>> History(int id);
        public Task<Order> Create(Order newOrder);
        public Task<List<Order>> AllOrders();
        public Task UpdateStatus();
        public Task<List<Order>> GetActiveOrders(int id);
        public Task<bool> CancelOrder(int orderId, int userId);
        public Task<Order> CreatePayPal(Order newOrder);
        public Task<List<Order>> GetActiveOrdersUnclamed(int id);
        public Task<Order> GetActiveOrderUnclamed(int id);
        public Task<Order> UnclamedConfirm(int id);
        public Task<bool> GetQuanityOrder(Order newOrder);
    }
}
