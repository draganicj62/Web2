using AutoMapper;
using Shopping.Api.Data.Repositories;
using Shopping.Api.DTO.ArticleDTO;
using Shopping.Api.DTO.ItemDTO;
using Shopping.Api.DTO.OrderDTO;
using Shopping.Api.Interfaces.IRepositories;
using Shopping.Api.Interfaces.IServices;
using Shopping.Api.Models;

namespace Shopping.Api.Services
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IUserRepository _userRepository;
        private readonly IArticleRepository _articleRepository;
        private readonly IMapper _mapper;

        public OrderService(IOrderRepository orderRepository, IUserRepository userRepository,IArticleRepository articleRepository, IMapper mapper)
        {
            _orderRepository = orderRepository;
            _userRepository = userRepository;
            _articleRepository = articleRepository;
            _mapper = mapper;
        }

        public async Task<List<HistoryOrderDto>> History(int id)
        {
            /*if (!await _userRepository.DoesUserExist(id))
                return null;*/

            await _orderRepository.UpdateStatus();

            var result = await _orderRepository.History(id);
            if (result == null)
                return null;
            var history = _mapper.Map<List<HistoryOrderDto>>(result);
            return history;
        }

        public async Task<GetCreatedOrderDto> CreatePayPal(CreateOrderDto newOrder)
        {
            if (!await _userRepository.DoesUserExist(newOrder.SellerId))
                return null;
            if (!await _articleRepository.DoesArticleExist(newOrder.Item.ArticleId))
                return null;
            var order = _mapper.Map<Order>(newOrder);
            var result = await _orderRepository.CreatePayPal(order);
            if (result == null)
                return null;
            var returnValue = _mapper.Map<GetCreatedOrderDto>(result);
            return returnValue;
        }

        public async Task<GetCreatedOrderDto> Create(CreateOrderDto newOrder)
        {
            /*if (!await _userRepository.DoesUserExist(newOrder.UserId))
                return null;*/
            if (!await _userRepository.DoesUserExist(newOrder.SellerId))
                return null;
            if (!await _articleRepository.DoesArticleExist(newOrder.Item.ArticleId))
                return null;
            var order = _mapper.Map<Order>(newOrder);
            var result = await _orderRepository.Create(order);
            if (result == null)
                return null;
            var returnValue = _mapper.Map<GetCreatedOrderDto>(result);
            return returnValue;
        }

        public async Task<bool> GetQuanityOrder(CreateOrderDto newOrder)
        {
            var order = _mapper.Map<Order>(newOrder);
            var result = await _orderRepository.GetQuanityOrder(order);
            return result;
        }

        public async Task<List<GetAllOrderDto>> AllOrders()
        {
            await _orderRepository.UpdateStatus();
            var result = await _orderRepository.AllOrders();
            var returnValue = _mapper.Map<List<GetAllOrderDto>>(result);
            return returnValue;
        }

        public async Task<List<GetActiveOrderDto>> GetActiveOrders(int id)
        {
            await _orderRepository.UpdateStatus();
            var result = await _orderRepository.GetActiveOrders(id);
            var returnValue = _mapper.Map<List<GetActiveOrderDto>>(result);
            return returnValue;
        }

        public async Task<List<GetActiveOrderDto>> GetActiveOrdersUnclamed(int id)
        {
            await _orderRepository.UpdateStatus();
            var result = await _orderRepository.GetActiveOrdersUnclamed(id);
            var returnValue = _mapper.Map<List<GetActiveOrderDto>>(result);
            return returnValue;
        }

        public async Task<GetActiveOrderDto> GetActiveOrderUnclamed(int id)
        {
            await _orderRepository.UpdateStatus();
            var result = await _orderRepository.GetActiveOrderUnclamed(id);
            var returnValue = _mapper.Map<GetActiveOrderDto>(result);
            return returnValue;
        }

        public async Task<GetActiveOrderDto> UnclamedConfirm(int id)
        {
            await _orderRepository.UpdateStatus();
            var result = await _orderRepository.UnclamedConfirm(id);
            var returnValue = _mapper.Map<GetActiveOrderDto>(result);
            return returnValue;
        }

        public async Task<bool> CancelOrder(CancelOrderDto cancelOrder)
        {
            await _orderRepository.UpdateStatus();
            var result = await _orderRepository.CancelOrder(cancelOrder.orderId, cancelOrder.userId);
            return result;
        }

    }
}
