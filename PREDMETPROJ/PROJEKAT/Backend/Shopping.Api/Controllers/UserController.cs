using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Shopping.Api.DTO.UserDTO;
using Shopping.Api.Interfaces.IServices;
using Shopping.Api.Services;
using System.Data;

namespace Shopping.Api.Controllers
{
    [Route("v1/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IPhotoService _photoService;
        public UserController(IUserService userService, IPhotoService photoService) 
        {
            _userService = userService;
            _photoService = photoService;
        }

        //[ProducesResponseType(StatusCodes.Status200OK)]
        [HttpPost("authentication")]
        [AllowAnonymous]
        //All
        public async Task<IActionResult> Authentication(LoginUserDto loginUser)
        {
            var response = await _userService.Authenticate(loginUser);

            if(response == null)
                return BadRequest("User doesn't exist");

            //return Ulogovanog korisnika da ga odma u store stavim
            return Ok(response);
        }

        [HttpPost("googleAuth")]
        [AllowAnonymous]
        public async Task<IActionResult> GoogleAuth(GoogleLogDto googleUser)
        {
            var response = await _userService.GoogleAuth(googleUser);
            return Ok(response);
        }

        [HttpPost("register")]
        [AllowAnonymous]
        //Customer, Seller
        public async Task<IActionResult> Register(RegisterUserDto newUser)
        {
            if (newUser.Birthday.Date > DateTime.Now.Date)
                return BadRequest("Date is older than current date");

            var result = await _userService.Register(newUser);
            if (result == "failed")
                return BadRequest("Faild to register user to our shop");
            if (result == "emailexists")
                return BadRequest("Email already registered");
            if (result == "usernameexists")
                return BadRequest("Username already registered");
            return Ok();
        }

        [HttpPost("photo/{email}")]
        [AllowAnonymous]
        public async Task<IActionResult> AddPhoto(string email,[FromForm(Name = "myfile")] IFormFile file)
        {   
            var result = await _userService.AddPhoto(file, email);
            if (result is string)
            {
                return BadRequest(result);
            }
            else
            {
                return Ok();
            }
        }

        [HttpPost("photo/update/{id}")]
        [Authorize(Policy = "JwtSchemePolicy", Roles = "Customer,Seller,Administrator")]
        public async Task<IActionResult> UpdatePhoto(int id, [FromForm(Name = "myfile")] IFormFile file)
        {
            var result = await _userService.UpdatePhoto(file, id);
            if (result is string)
            {
                return BadRequest(result);
            }
            else
            {
                return Ok();
            }
        }

        [HttpGet("{id}")]
        [Authorize(Policy = "JwtSchemePolicy", Roles = "Customer,Seller,Administrator")]
        public async Task<IActionResult> Details(int id)
        {
            if(id < 1)
                return BadRequest("Invalid id");
            var result = await _userService.GetUserDetails(id);
            if (result == null)
                return BadRequest("No user found");
            return Ok(result);
        }



        [HttpPatch("update")]
        [Authorize(Policy = "JwtSchemePolicy", Roles = "Customer, Seller, Administrator")]
        public async Task<IActionResult> Update(UpdateUserDto updatedUser)
        {
            if (updatedUser.Birthday.Date > DateTime.Now.Date)
                return BadRequest("Date is older than current date");

            var response = await _userService.Update(updatedUser);

            if(response == "emailexists")
                return BadRequest("Email already exists");
            if (response == "usernameexists")
                return BadRequest("Username already exists");
            if (response == "nouserfound")
                return BadRequest("User not found");
            if (response == "passwordError")
                return BadRequest("Invalid new or old password");

            return Ok();
        }

        //Administrator
        [HttpPatch("verify/{id}")]
        [Authorize(Policy = "JwtSchemePolicy", Roles = "Administrator")]
        public async Task<IActionResult> Verify(int id)
        {
            if(id <= 0)
                return BadRequest("Invalid user id");
            if (!await _userService.Verify(id, "Verified"))
                return BadRequest("No users found with this id");
            return Ok();
        }

        //Administrator
        [HttpPatch("deny/{id}")]
        [Authorize(Policy = "JwtSchemePolicy", Roles = "Administrator")]
        public async Task<IActionResult> Deny(int id)
        {
            if (id <= 0)
                return BadRequest("Invalid user id");
            if (!await _userService.Verify(id, "Denied"))
                return BadRequest("No users found with this id");
            return Ok();
        }

        //Administrator
        [HttpGet("sellers")]
        [Authorize(Policy = "JwtSchemePolicy", Roles = "Administrator")]
        public async Task<IActionResult> GetSellers()
        {
            return Ok(await _userService.GetSellers());
        }

    }
}
