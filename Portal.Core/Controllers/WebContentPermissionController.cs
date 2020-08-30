using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Portal.Core.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WebContentPermissionController : Controller
    {
        public AppDb Db { get; }
        public WebContentPermissionController(AppDb db)
        {
            Db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetPermission(int userId)
        {
            await Db.Connection.OpenAsync();
            var query = new WebContentPermissionQuery(Db);
            var result = await query.FindAsync(userId);
            if (result is null)
                return new NotFoundResult();
            return new OkObjectResult(result);
        }


        [HttpGet("GetAllPermission")]
        public async Task<IActionResult> GetAllPermission()
        {
            await Db.Connection.OpenAsync();
            var query = new WebContentPermissionQuery(Db);
            var result = await query.FindAllAsync();
            if (result is null)
                return new NotFoundResult();
            return new OkObjectResult(result);
        }

        [HttpGet("AddOrDelete")]
        public async Task<IActionResult> AddOrDeleteAsync(int websiteid, int userid, bool isadd)
        {
            await Db.Connection.OpenAsync();
            var query = new WebContentPermissionQuery(Db);
            var result = await query.AddOrDeleteAsync(websiteid,userid,isadd);
            return new OkObjectResult(result);
        }

    }
}