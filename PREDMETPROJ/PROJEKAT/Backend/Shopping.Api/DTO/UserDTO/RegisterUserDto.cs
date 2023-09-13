using System.ComponentModel.DataAnnotations;

namespace Shopping.Api.DTO.UserDTO
{
    public class RegisterUserDto
    {
        [Required]
        public string Username { get; set; }
        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }
        [Required]
        public string Address { get; set; }
        [Required]
        public DateTime Birthday { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
        [Required]
        [RegularExpression("^(Customer|Seller)$", ErrorMessage = "Role must be either 'Customer' or 'Seller'.")]
        public string Role { get; set; }
        //public FormFile Picture { get; set; }

    }
}
