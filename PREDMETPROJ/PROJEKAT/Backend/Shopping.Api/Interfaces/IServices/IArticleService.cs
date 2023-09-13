using Shopping.Api.DTO.ArticleDTO;
using Shopping.Api.DTO.UserDTO;

namespace Shopping.Api.Interfaces.IServices
{
    public interface IArticleService
    {
        public Task<bool> Create(CreateArticleDto newArticle);
        public Task<bool> Update(UpdateArticleDto oldArticle);
        public Task<bool> Delete(int id, int seller);
        public Task<GetArticleDto> GetArticle(int id);
        public Task<List<GetAllArticlesDto>> GetAllArticles();
        public Task<List<GetSellerArticlesDto>> GetSellerArticles(int id);
    }
}
