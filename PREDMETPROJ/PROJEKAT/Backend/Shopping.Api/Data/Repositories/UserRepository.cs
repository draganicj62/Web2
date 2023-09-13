using Backend.Helpers;
using Microsoft.EntityFrameworkCore;
using Shopping.Api.DTO.UserDTO;
using Shopping.Api.Interfaces.IRepositories;
using Shopping.Api.Models;
using System.Security.Cryptography;
using System.Security.Principal;
using System.Text;

namespace Shopping.Api.Data.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _data;
        private readonly AuthenticationHelper _helper;

        public UserRepository (DataContext data)
        {
            _data = data;
            _helper = new AuthenticationHelper();
        }

        public async Task<User> Authenticate(string email, string password)
        {
            var user = await _data.Users.FirstOrDefaultAsync(x => x.Email == email);

            if (user == null || user.PasswordKey == null)
                return null!;
            /*if (user.VerificationStatus != "Verified")
                return null;*/

            if (!_helper.MatchPasswordHash(password, user.Password!, user.PasswordKey))
                return null!;

            return user;
        }
        public async Task<bool> CheckOldPassword(int id, string password)
        {
            var user = await _data.Users.FirstOrDefaultAsync(x => x.Id == id);

            if (user == null || user.PasswordKey == null)
                return false;

            if (!_helper.MatchPasswordHash(password, user.Password!, user.PasswordKey))
                return false;

            return true;
        }

        public async Task<bool> Register(User newUser)
        {
            try
            {
                _data.Users.Add(newUser);
                await _data.SaveChangesAsync();
                return true;
            }
            catch(Exception ex)
            {
                return false;
            }
        }
        //drugi nacin map ignore i onda
        //dbContext.Users.Update(user);
        //await dbContext.SaveChangesAsync();
        //return user;
        public async Task<User> Update(UpdateUserDto updatedUser)
        {
            var user = await _data.Users.SingleOrDefaultAsync(x => x.Id == updatedUser.Id);

            if (!String.IsNullOrWhiteSpace(updatedUser.Newpassword))
            {
                byte[] passwordHash, passwordKey;

                using (var hmac = new HMACSHA512())
                {
                    passwordKey = hmac.Key;
                    passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(updatedUser.Newpassword));
                    user.Password = passwordHash;
                    user.PasswordKey = passwordKey;
                }
            }
            user.Address = updatedUser.Address;
            user.Birthday = updatedUser.Birthday;
            user.Email = updatedUser.Email;
            user.FirstName = updatedUser.FirstName;
            user.LastName = updatedUser.LastName;
            user.Username = updatedUser.Username;

            await _data.SaveChangesAsync();
            return user;
        }
        public async Task<User> Verify(int userId, string verificationStatus)
        {
            var user = await _data.Users.SingleOrDefaultAsync(x => x.Id == userId);
            user.VerificationStatus = verificationStatus;
            await _data.SaveChangesAsync();
            return user;
        }
        public async Task<List<User>> GetSellers()
        {
            var sellers = await _data.Users.Where(u => u.Role == "Seller").ToListAsync();
            return sellers;
        }
        public async Task<User> GetUserDetails(int id)
        {
            var user = await _data.Users.SingleOrDefaultAsync(x => x.Id == id);
            return user;
        }
        public async Task<bool> DoesEmailExist(string email) 
        {
            return await _data.Users.AnyAsync(u => u.Email == email);
        }
        public async Task<bool> DoesEmailExistExceptForThisUser(string email, int id)
        {
            return await _data.Users.AnyAsync(u => u.Email == email && u.Id != id);
        }
        public async Task<bool> DoesUsernameExist(string username)
        {
            return await _data.Users.AnyAsync(u => u.Username == username);
        }
        public async Task<bool> DoesUsernameExistExceptForThisUser(string username,int id)
        {
            return await _data.Users.AnyAsync(u => u.Username == username && u.Id != id);
        }
        public async Task<bool> DoesUserExist(int id)
        {
            return await _data.Users.AnyAsync(u => u.Id == id);
        }
        public async Task<bool> DoesSellerExist(int id)
        {
            return await _data.Users.AnyAsync(u => u.Id == id && u.Role == "Seller" && u.VerificationStatus == "Verified");
        }
        public async Task<bool> DoesSellerExistVer(int id)
        {
            return await _data.Users.AnyAsync(u => u.Id == id && u.Role == "Seller");
        }
        public async Task UpdateUserPhoto(string email, string photo)
        {
            var user = await _data.Users.SingleOrDefaultAsync(x => x.Email == email);
            user.Picture = photo;
            await _data.SaveChangesAsync();
        }
        public async Task UpdateUserPhoto(int id, string photo)
        {
            var user = await _data.Users.SingleOrDefaultAsync(x => x.Id == id);
            user.Picture = photo;
            await _data.SaveChangesAsync();
        }
    }
}
