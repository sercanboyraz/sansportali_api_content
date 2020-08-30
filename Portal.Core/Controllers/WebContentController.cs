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

        [HttpGet("addwebcontent")]
        public async Task<IActionResult> AddWebContent(string websitename, string websiteaddress,int userid)
        {
            await Db.Connection.OpenAsync();
            var query = new WebContentQuery(Db);
            var result = await query.AddWebContent(websitename, websiteaddress, userid);
            if (result is null)
                return new NotFoundResult();
            return new OkObjectResult(result);
        }

        [HttpGet("AllPermission")]
        public async Task<IActionResult> AllPermission(int userid)
        {
            await Db.Connection.OpenAsync();
            var query = new WebContentQuery(Db);
            var result = await query.FindAllAsync(userid);
            if (result is null)
                return new NotFoundResult();
            return new OkObjectResult(result);
        }

    }
}