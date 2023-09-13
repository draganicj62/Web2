using Shopping.Api.DTO.ItemDTO;

namespace Shopping.Api.DTO.OrderDTO
{
    public class GetAllOrderDto
    {
        public int Id { get; set; }
        public GetAllOrderItemDto Item { get; set; }
        public string Comment { get; set; }
        public string Address { get; set; }
        public DateTime CreationTime { get; set; }
        public DateTime DeliveryTime { get; set; }
        public float Price { get; set; }
        public string Status { get; set; }
    }
}
