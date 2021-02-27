using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Portal.Core.Query;

namespace Portal.Core.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RaspianIPController : Controller
    {
        public AppDb Db { get; }

        public IActionResult Index()
        {
            return View();
        }
        public RaspianIPController(AppDb db)
        {
            Db = db;
        }

        [HttpPost]
        public async Task<IActionResult> SetIP(int userId, string ipv4, string ipv6)
        {
            await Db.Connection.OpenAsync();
            var query = new RaspianIPQuery(Db);
            var result = query.AddIP(userId, ipv4, ipv6);
            return new OkObjectResult(result.Result);
        }
    }
}