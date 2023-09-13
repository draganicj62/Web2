using Shopping.Api.DTO.ItemDTO;
using System.ComponentModel.DataAnnotations;

namespace Shopping.Api.DTO.OrderDTO
{
    public class CreateOrderDto
    {
        [Required]
        public CreateOrderItemDto Item { get; set; }

        [Required]
        public string Comment { get; set; }

        [Required]
        public string Address { get; set; }
        [Required]
        [Range(1, int.MaxValue)]
        public int UserId { get; set; }
        [Required]
        [Range(1, int.MaxValue)]
        public int SellerId { get; set; }

    }
}
