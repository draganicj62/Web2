using System.ComponentModel.DataAnnotations;

namespace Shopping.Api.DTO.UserDTO
{
    public class UpdateUserDto
    {
        [Required]
        [Range(1, int.MaxValue)]
        public int Id { get; set; }
        [Required]
        [StringLength(100)]
        public string Username { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        public string? Newpassword { get; set; }
        public string? Oldpassword { get; set; }
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
    }
}
