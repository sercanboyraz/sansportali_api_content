using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Portal.Core.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ImageController : Controller
    {

        public AppDb Db { get; }
        public ImageController(AppDb db)
        {
            Db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetImage(int userId)
        {
            await Db.Connection.OpenAsync();
            var query = new ImageQuery(Db);
            var result = await query.FindOneAsync(userId);
            if (result is null)
                return new NotFoundResult();
            return new OkObjectResult(result);
        }

        [HttpPost("setimage")]
        public async Task<IActionResult> SetImage(int userId, string ext, [FromBody] string datebase64)
        {
            await Db.Connection.OpenAsync();
            var query = new ImageQuery(Db);
            var result = query.AddImage(userId, datebase64, ext);
            return new OkObjectResult(result.Result);
        }
    }
}
