using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Shopping.Api.DTO.OrderDTO;
using Shopping.Api.DTO.UserDTO;
using Shopping.Api.Interfaces.IServices;
using System.Data;

namespace Shopping.Api.Controllers
{
    [Route("v1/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrderController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpPost("create")]
        [Authorize(Policy = "JwtSchemePolicy", Roles = "Customer")]
        public async Task<IActionResult> Create(CreateOrderDto newOrder)
        {
            var result = await _orderService.Create(newOrder);
            if (result == null)
                return BadRequest("Faild to create new order");

            return Ok(result);
        }

        [HttpPost("getQuanityOrder")]
        [Authorize(Policy = "JwtSchemePolicy", Roles = "Customer")]
        public async Task<IActionResult> GetQuanityOrder(CreateOrderDto newOrder)
        {
            var result = await _orderService.GetQuanityOrder(newOrder);
            if (!result)
                return BadRequest();
            return Ok("Uspeh");
        }

        [HttpPost("createPayPal")]
        public async Task<IActionResult> CreatePayPal(CreateOrderDto newOrder)
        {
            var result = await _orderService.CreatePayPal(newOrder);
            if (result == null)
                return BadRequest("Faild to create new order");

            return Ok(result);
        }

        [HttpGet("history/{id}")]
        [Authorize(Policy = "JwtSchemePolicy", Roles = "Customer,Seller")]
        public async Task<IActionResult> History(int id)
        {
            var result = await _orderService.History(id);
            if (result == null)
                return BadRequest("Wrong Id");
            return Ok(result);
        }

        [HttpGet("active/{id}")]
        [Authorize(Policy = "JwtSchemePolicy", Roles = "Customer,Seller")]
        public async Task<IActionResult> GetActiveOrders(int id)
        {
            var result = await _orderService.GetActiveOrders(id);
            if (result == null)
                return BadRequest("Wrong Id");
            return Ok(result);
        }

        [HttpGet("activeOrderUnclamed/{id}")]
        [Authorize(Policy = "JwtSchemePolicy", Roles = "Customer,Seller")]
        public async Task<IActionResult> GetActiveOrderUnclamed(int id)
        {
            var result = await _orderService.GetActiveOrderUnclamed(id);
            if (result == null)
                return BadRequest("Wrong Id");
            return Ok(result);
        }

        [HttpGet("unclamedConfirm/{id}")]
        [Authorize(Policy = "JwtSchemePolicy", Roles = "Customer,Seller")]
        public async Task<IActionResult> UnclamedConfirm(int id)
        {
            var result = await _orderService.UnclamedConfirm(id);
            if (result == null)
                return BadRequest("Wrong Id");
            return Ok(result);
        }

        [HttpGet("activeUnclamed/{id}")]
        [Authorize(Policy = "JwtSchemePolicy", Roles = "Customer,Seller")]
        public async Task<IActionResult> GetActiveOrdersUnclamed(int id)
        {
            var result = await _orderService.GetActiveOrdersUnclamed(id);
            if (result == null)
                return BadRequest("Wrong Id");
            return Ok(result);
        }

        [HttpGet]
        [Authorize(Policy = "JwtSchemePolicy", Roles = "Administrator")]
        public async Task<IActionResult> AllOrder()
        {
            var result = await _orderService.AllOrders();
            return Ok(result);
        }

        //cancel Order
        [HttpPatch("cancel")]
        [Authorize(Policy = "JwtSchemePolicy", Roles = "Customer")]
        public async Task<IActionResult> CancelOrder(CancelOrderDto cancelOrder)
        {
            var result = await _orderService.CancelOrder(cancelOrder);
            if (!result)
                return BadRequest();
            return Ok();
        }
    }
}
