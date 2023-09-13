using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Shopping.Api.Models
{
    public class Order
    {
        [Required]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key]
        public int Id { get; set; }
        [Required]
        [Range(0, float.MaxValue)]
        public float Price { get; set; }
        [Required]
        public DateTime CreationTime { get; set; }
        [Required]
        public DateTime DeliveryTime { get; set; }
        [Required]
        public string Status { get; set; } 
        [Required]
        [StringLength(255)]
        public string Comment { get; set; }
        [Required]
        public string Address { get; set; }
        [Required]
        public int UserId { get; set; }
        //public User User { get; set; }
        [Required]
        public int SellerId { get; set; }
        public User Seller { get; set; } 
        public Item Item { get; set; }
    }
}
