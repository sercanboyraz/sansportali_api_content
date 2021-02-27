using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Portal.Core.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class LoginRecordController : Controller
    {
        public AppDb Db { get; }
        public LoginRecordController(AppDb db)
        {
            Db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetNamePassword(string username, string password)
        {
            await Db.Connection.OpenAsync();
            var query = new UsersQuery(Db);
            var result = await query.FindOneAsync(username, password);
            if (result is null)
                return new NotFoundResult();
            return new OkObjectResult(result);
        }

        [HttpGet("userid")]
        public async Task<IActionResult> GetNamePasswordUserId(int userId)
        {
            await Db.Connection.OpenAsync();
            var query = new UsersQuery(Db);
            var result = await query.FindOneUserIdAsync(userId);
            if (result is null)
                return new OkObjectResult(new Users());
            return new OkObjectResult(result);
        }

    }
}