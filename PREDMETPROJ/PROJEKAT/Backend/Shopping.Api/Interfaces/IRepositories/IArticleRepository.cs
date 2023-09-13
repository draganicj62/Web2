using Shopping.Api.Models;

namespace Shopping.Api.Interfaces.IRepositories
{
    public interface IArticleRepository
    {
        public Task<bool> Create(Article newArticle);
        public Task<bool> Update(Article newArticle);
        public Task<bool> Delete(int id, int sellerId);
        public Task<bool> DoesArticleExist(int id);
        public Task<List<Article>> GetAllArticles();
        public Task<List<Article>> GetSellerArticles(int id);
        public Task<Article> GetArticle(int id);

    }
}
