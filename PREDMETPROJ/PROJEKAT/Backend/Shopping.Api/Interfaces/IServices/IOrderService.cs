using Shopping.Api.DTO.ArticleDTO;
using Shopping.Api.DTO.OrderDTO;

namespace Shopping.Api.Interfaces.IServices
{
    public interface IOrderService
    {
        public Task<List<HistoryOrderDto>> History(int id);
        public Task<GetCreatedOrderDto> Create(CreateOrderDto newArticle);
        public Task<GetCreatedOrderDto> CreatePayPal(CreateOrderDto newOrder);
        public Task<List<GetAllOrderDto>> AllOrders();
        public Task<List<GetActiveOrderDto>> GetActiveOrders(int id);
        public Task<bool> CancelOrder(CancelOrderDto cancelOrder);
        public Task<List<GetActiveOrderDto>> GetActiveOrdersUnclamed(int id);
        public Task<GetActiveOrderDto> GetActiveOrderUnclamed(int id);
        public Task<GetActiveOrderDto> UnclamedConfirm(int id);
        public Task<bool> GetQuanityOrder(CreateOrderDto newOrder);

    }
}
