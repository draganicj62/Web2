using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Shopping.Api.Models
{
    //public enum UserRole { Administrator = 0, Seller = 1, Customer = 2 };
    //public enum VerificationStatus { Pending = 0, Denied = 1, Verified = 2};
    public class User
    {
        [Required]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key]
        public int Id { get; set; }
        [Required]
        [StringLength(100)]
        public string Username { get; set; } 
        [Required]
        [StringLength(255)]
        public string Email { get; set; } 
        [Required]
        [StringLength(100)]
        public string FirstName { get; set; }
        [Required]
        [StringLength(100)]
        public string LastName { get; set; }
        [Required]
        public DateTime Birthday { get; set; } 
        [Required]
        [StringLength(255)]
        public string Address { get; set; }
        [Required]
        public string Role { get; set; }
        [Required]
        public string VerificationStatus { get; set; }
        [Required]
        public byte[] Password { get; set; } 
        [Required]
        public byte[] PasswordKey { get; set; }
        public string Picture { get; set; }
        public ICollection<Order> Orders { get; set; }
        public ICollection<Article> Articles { get; set; }
        
    }
}
