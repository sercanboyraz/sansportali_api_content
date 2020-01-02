using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Portal.Core.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WebContentController : Controller
    {
        public AppDb Db { get; }
        public WebContentController(AppDb db)
        {
            Db = db;
        }

        //[HttpGet]
        //public async Task<IActionResult> GetNamePassword(string username, string password)
        //{
        //    await Db.Connection.OpenAsync();
        //    var query = new UsersQuery(Db);
        //    var result = await query.FindOneAsync(username, password);
        //    if (result is null)
        //        return new NotFoundResult();
        //    return new OkObjectResult(result);
        //}

    }
}