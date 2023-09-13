using Backend.Helpers;
using Microsoft.EntityFrameworkCore;
using Shopping.Api.Interfaces.IRepositories;
using Shopping.Api.Models;

namespace Shopping.Api.Data.Repositories
{
    public class ArticleRepository : IArticleRepository
    {
        private readonly DataContext _data;

        public ArticleRepository(DataContext data)
        {
            _data = data;
        }

        public async Task<bool> Create(Article newArticle)
        {
            _data.Articles.Add(newArticle);
            await _data.SaveChangesAsync();
            return true;
        }

        public async Task<bool> Update(Article newArticle)
        {
            var existingArticle = await _data.Articles.SingleOrDefaultAsync(x => x.Id == newArticle.Id);

            if(existingArticle != null && existingArticle.UserId == newArticle.UserId) 
            {

                existingArticle.Name = newArticle.Name;
                existingArticle.Price = newArticle.Price;
                existingArticle.Quantity = newArticle.Quantity;
                existingArticle.Description = newArticle.Description;
                existingArticle.Picture = newArticle.Picture;
                await _data.SaveChangesAsync();
                return true;
            }
            return false;
        }

        public async Task<bool> Delete (int id, int sellerId)
        {
            var existingArticle = await _data.Articles.FindAsync(id);
            var itemsToDelete = await _data.Items.Where(a => a.ArticleId == id).ToListAsync();
            var orderIdsToDelete = itemsToDelete.Select(i => i.OrderId).Distinct().ToList();
            var ordersToDelete = await _data.Orders.Where(o => orderIdsToDelete.Contains(o.Id)).ToListAsync();

            if (ordersToDelete != null && ordersToDelete.Count > 0)
            {
                foreach(var order in ordersToDelete)
                {
                    if (order.Status == "Delivering")
                        return false;
                }
            }

            if (existingArticle != null && existingArticle.UserId == sellerId)
            {
                _data.Items.RemoveRange(itemsToDelete);
                _data.Orders.RemoveRange(ordersToDelete);
                _data.Articles.RemoveRange(existingArticle);
                await _data.SaveChangesAsync();
                return true;
            }
            return false;
        }

        public async Task<Article> GetArticle(int id)
        {
            var article = await _data.Articles.FirstOrDefaultAsync(a => a.Id == id);
            return article;
        }

        public async Task<bool> DoesArticleExist(int id)
        {
            return await _data.Articles.AnyAsync(u => u.Id == id);
        }

        public async Task<List<Article>> GetAllArticles()
        {
            return await _data.Articles.Where(a => a.Quantity > 0).ToListAsync();
        }
        public async Task<List<Article>> GetSellerArticles(int id)
        {
            return await _data.Articles.Where(a => a.UserId == id).ToListAsync();
        }
    }
}
