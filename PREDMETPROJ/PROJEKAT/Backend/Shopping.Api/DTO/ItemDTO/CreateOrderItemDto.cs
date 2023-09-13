using Shopping.Api.Models;
using System.ComponentModel.DataAnnotations;

namespace Shopping.Api.DTO.ItemDTO
{
    public class CreateOrderItemDto
    {
        [Required]
        [Range(1, int.MaxValue)]
        public int Quantity { get; set; }
        [Required]
        [Range(1, int.MaxValue)]
        public int ArticleId { get; set; }
    }
}
