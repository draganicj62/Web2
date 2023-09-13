using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Shopping.Api.DTO.ArticleDTO;
using Shopping.Api.DTO.UserDTO;
using Shopping.Api.Interfaces.IServices;
using Shopping.Api.Services;
using System.Data;

namespace Shopping.Api.Controllers
{
    [Route("v1/[controller]")]
    [ApiController]
    public class ArticleController : ControllerBase
    {
        private readonly IArticleService _articleService;

        public ArticleController(IArticleService articleService)
        {
            _articleService = articleService;
        }

        [HttpPost("create")]
        [Authorize(Policy = "JwtSchemePolicy", Roles = "Seller")]
        public async Task<IActionResult> Create([FromForm] CreateArticleDto newArticle)
        {
            if (!await _articleService.Create(newArticle))
                return BadRequest("User not valid");
            return Ok();
        }

        [HttpPatch("update")]
        [Authorize(Policy = "JwtSchemePolicy", Roles = "Seller")]
        public async Task<IActionResult> Update([FromForm] UpdateArticleDto updatedArticle)
        {
            if (!await _articleService.Update(updatedArticle))
                return BadRequest("Updated article not valid");
            return Ok();
        }

        [HttpDelete("delete/{id}/{sellerId}")]
        [Authorize(Policy = "JwtSchemePolicy", Roles = "Seller")]
        public async Task<IActionResult> Delete(int id, int sellerId)
        {
            if (!await _articleService.Delete(id, sellerId))
                return BadRequest("Invalid id-s");
            return Ok();
        }

        [HttpGet("details/{id}")]
        [Authorize(Policy = "JwtSchemePolicy", Roles = "Seller,Customer")]
        public async Task<IActionResult> GetArticle(int id)
        {
            if (id < 1)
                return BadRequest("Invalid id");
            var result = await _articleService.GetArticle(id);
            if (result == null)
                return BadRequest("No user found");
            return Ok(result);
        }

        //get all articles
        [HttpGet()]
        [Authorize(Policy = "JwtSchemePolicy", Roles = "Customer")]
        public async Task<IActionResult> GetAllArticles()
        {
            var result = await _articleService.GetAllArticles();
            return Ok(result);
        }
        //get only articles for seller
        [HttpGet("{id}")]
        [Authorize(Policy = "JwtSchemePolicy", Roles = "Seller")]
        public async Task<IActionResult> GetSellerArticles(int id)
        {
            var result = await _articleService.GetSellerArticles(id);
            if (result == null)
                return BadRequest("Wrong Id");
            return Ok(result);
        }
    }
}
