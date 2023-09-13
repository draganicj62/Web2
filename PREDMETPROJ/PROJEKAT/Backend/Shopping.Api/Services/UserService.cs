using AutoMapper;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using MimeKit;
using MailKit;
using MailKit.Net.Smtp;
using Shopping.Api.DTO.UserDTO;
using Shopping.Api.Interfaces.IRepositories;
using Shopping.Api.Interfaces.IServices;
using Shopping.Api.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace Shopping.Api.Services
{
    public class UserService : IUserService
    {
        private readonly IConfiguration _configuration;
        private readonly IUserRepository _userRepo;
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;

        public UserService(IConfiguration configuration, IUserRepository userRepository, IMapper mapper, IPhotoService photoService)
        {
            _configuration = configuration;
            _userRepo = userRepository;
            _mapper = mapper;
            _photoService = photoService;
        }

        public async Task<string> Authenticate(LoginUserDto loginUser)
        {
            var user = await _userRepo.Authenticate(loginUser.Email,loginUser.Password);

            if (user == null)
                return null;

            var token = CreateJWT(user);
            return token;
        }

        public async Task<string> GoogleAuth(GoogleLogDto loginUser)
        {
            var user = new User();
            user.Username = loginUser.Username;
            user.Role = "Customer";
            user.Id = loginUser.Id;

            var token = CreateJWT(user);
            return token;
        }

        public async Task<string> Register(RegisterUserDto newUser)
        {
            byte[] passwordHash, passwordKey;

            using (var hmac = new HMACSHA512())
            {
                passwordKey = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(newUser.Password));

            }

            if (await _userRepo.DoesEmailExist(newUser.Email))
                return "emailexists";

            if (await _userRepo.DoesUsernameExist(newUser.Username))
                return "usernameexists";

            var user = _mapper.Map<User>(newUser);
            user.Password = passwordHash;
            user.PasswordKey = passwordKey;
            user.VerificationStatus = newUser.Role == "Customer" ? "Verified" : "Pending";
            //user.Role = "Administrator";
            //var photo = await _photoService.UploadPhotoAsync(newUser.Picture);
            user.Picture = "";
            var response = await _userRepo.Register(user);

            if (!response)
                return "failed"; 

            return "successful";
        }

        public async Task<Object> AddPhoto(IFormFile file, string email)
        {
            var result = await _photoService.UploadPhotoAsync(file);
            if (result.Error != null)
                return result.Error.Message;

            await _userRepo.UpdateUserPhoto(email, result.SecureUrl.AbsoluteUri);

            return true;
        }
        public async Task<Object> UpdatePhoto(IFormFile file, int id)
        {
            var result = await _photoService.UploadPhotoAsync(file);
            if (result.Error != null)
                return result.Error.Message;

            await _userRepo.UpdateUserPhoto(id, result.SecureUrl.AbsoluteUri);

            return true;
        }

        public async Task<string> Update(UpdateUserDto updatedUser)
        {
            if (await _userRepo.DoesEmailExistExceptForThisUser(updatedUser.Email, updatedUser.Id))
                return "emailexists";

            if (await _userRepo.DoesUsernameExistExceptForThisUser(updatedUser.Username, updatedUser.Id))
                return "usernameexists";

            if (!await _userRepo.DoesUserExist(updatedUser.Id))
                return "nouserfound";

            if (String.IsNullOrWhiteSpace(updatedUser.Newpassword) && String.IsNullOrWhiteSpace(updatedUser.Oldpassword))
            {
                await _userRepo.Update(updatedUser);
            }
            else if (!String.IsNullOrWhiteSpace(updatedUser.Newpassword) && !String.IsNullOrWhiteSpace(updatedUser.Oldpassword))
            {
                if (await _userRepo.CheckOldPassword(updatedUser.Id, updatedUser.Oldpassword))
                    await _userRepo.Update(updatedUser);
                else
                    return "passwordError";
            }
            else
                return "passwordError";

            return "updated";
        }

        public async Task<bool> Verify(int id, string verificationStatus)
        {
            if (!await _userRepo.DoesSellerExistVer(id))
                return false;

            await _userRepo.Verify(id, verificationStatus);
            string message = verificationStatus == "Verified" ? "Congratulation you have been verified successfully!" : "Sorry, we currently have to much of sellers on our site... Better luck next time";
            var result = await _userRepo.GetUserDetails(id);
            SendEmail(result.Email, message);
            return true;
        }
        public async Task<List<GetSellersDto>> GetSellers()
        {
            var results = await _userRepo.GetSellers();
            var returnValue = _mapper.Map<List<GetSellersDto>>(results);
            return returnValue;
        }

        public async Task<GetUserDto> GetUserDetails(int id)
        {
            var result = await _userRepo.GetUserDetails(id);
            var returnValue = _mapper.Map<GetUserDto>(result);
            return returnValue;
        }

        private string CreateJWT(User user)
        {
            var secretKey = _configuration.GetSection("AppSettings:Key").Value;
            var key = new SymmetricSecurityKey(Encoding.UTF8
                .GetBytes(secretKey!));

            var claims = new Claim[] {  
                new Claim(ClaimTypes.Name,user.Username),
                new Claim(ClaimTypes.NameIdentifier,user.Id.ToString()),
                new Claim(ClaimTypes.Role,user.Role.ToString())
            };

            var signingCredentials = new SigningCredentials(
                    key, SecurityAlgorithms.HmacSha256Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(10),
                SigningCredentials = signingCredentials
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
        public void SendEmail(string recipientEmail, string theMessage)
        {

            MimeMessage message = new MimeMessage();

            message.From.Add(new MailboxAddress("web2shop", "draganicj62@gmail.com"));
            message.To.Add(MailboxAddress.Parse(recipientEmail));
            message.Subject = "Verification";
            message.Body = new TextPart("plain")
            {
                Text = theMessage
            };

            SmtpClient client = new SmtpClient();

            try
            {
                client.Connect("smtp.gmail.com", 465, true);
                client.Authenticate("draganicj62@gmail.com", "wenp fofc maba matx");
                client.Send(message);
                Console.WriteLine("Email sent successfully.");
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error sending email: " + ex.Message);
            }
            finally
            {
                client.Disconnect(true);
                client.Dispose();
            }
        }
    }
}
