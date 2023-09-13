using AutoMapper;
using Shopping.Api.DTO.ArticleDTO;
using Shopping.Api.DTO.ItemDTO;
using Shopping.Api.DTO.OrderDTO;
using Shopping.Api.DTO.UserDTO;
using Shopping.Api.Models;

namespace Shopping.Api.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            //USER
            //register user
            CreateMap<RegisterUserDto, User>()
                .ForMember(dest => dest.Password, opt => opt.Ignore())
                .ForMember(dest => dest.PasswordKey, opt => opt.Ignore());

            //update user
            CreateMap<UpdateUserDto, User>()
                .ForMember(dest => dest.Password, opt => opt.Ignore())
                .ForMember(dest => dest.PasswordKey, opt => opt.Ignore());

            //get all sellers
            CreateMap<User, GetSellersDto>();

            //get user details
            CreateMap<User, GetUserDto>();

            //ARTICLE
            //create article
            CreateMap<CreateArticleDto, Article>();

            //update article
            CreateMap<UpdateArticleDto, Article>();

            //get all articles
            CreateMap<Article, GetAllArticlesDto>();

            //get all seller articles
            CreateMap<Article, GetSellerArticlesDto>();

            //get article details
            CreateMap<Article, GetArticleDto>();

            //ORDER
            //create order
            CreateMap<CreateOrderDto, Order>()
                .ForMember(dest => dest.Item, opt => opt.MapFrom(src => src.Item))
                //.ForMember(dest => dest.User, opt => opt.Ignore())
                .ForMember(dest => dest.Seller, opt => opt.Ignore());
            CreateMap<CreateOrderItemDto, Item>();
            CreateMap<Order, GetCreatedOrderDto>()
                .ForMember(dest => dest.Item, opt => opt.MapFrom(src => src.Item));
            CreateMap<Item, GetCreatedOrderItemDto>()
                .ForMember(dest => dest.ArticleName, opt => opt.MapFrom(src => src.Article.Name));

            //get order history for customer and seller
            CreateMap<Order, HistoryOrderDto>()
                .ForMember(dest => dest.Item, opt => opt.MapFrom(src => src.Item));
            CreateMap<Item, HistoryOrderItemDto>()
                .ForMember(dest => dest.ArticleName, opt => opt.MapFrom(src => src.Article.Name));

            //get all orders
            CreateMap<Order, GetAllOrderDto>()
                .ForMember(dest => dest.Item, opt => opt.MapFrom(src => src.Item));
            CreateMap<Item, GetAllOrderItemDto>()
                .ForMember(dest => dest.ArticleName, opt => opt.MapFrom(src => src.Article.Name));

            //get all active orders
            CreateMap<Order, GetActiveOrderDto>()
                            .ForMember(dest => dest.Item, opt => opt.MapFrom(src => src.Item));
            CreateMap<Item, GetActiveOrderItemDto>()
                .ForMember(dest => dest.ArticleName, opt => opt.MapFrom(src => src.Article.Name));
        }
    }
}
