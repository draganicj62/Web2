using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Shopping.Api.Models
{
    public class Item
    {
        [Required]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key]
        public int Id { get; set; }
        [Required]
        [Range(1, int.MaxValue)]
        public int Quantity { get; set; }
        [Required]
        public int ArticleId { get; set; }
        public Article Article { get; set; }
        [Required]
        public int OrderId { get; set; }
        public Order Order { get; set; } 
    }
}
