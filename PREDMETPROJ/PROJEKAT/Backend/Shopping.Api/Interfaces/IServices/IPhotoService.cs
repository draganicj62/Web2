using CloudinaryDotNet.Actions;

namespace Shopping.Api.Interfaces.IServices
{
    public interface IPhotoService
    {
        public Task<ImageUploadResult> UploadPhotoAsync(IFormFile photo);

    }
}
