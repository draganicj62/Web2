using System.ComponentModel.DataAnnotations;

namespace Shopping.Api.DTO.ArticleDTO
{
    public class GetAllArticlesDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public float Price { get; set; }
        public int Quantity { get; set; }
        public string Description { get; set; }
        public string Picture { get; set; }
        public int UserId { get; set; }
    }
}
