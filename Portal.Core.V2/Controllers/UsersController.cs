﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Portal.Core.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UsersController : ControllerBase
    {

        public UsersController(AppDb db)
        {
            Db = db;
        }

        // GET api/blog
        //[HttpGet]
        //public async Task<IActionResult> GetLatest()
        //{
        //    await Db.Connection.OpenAsync();
        //    var query = new UsersQuery(Db);
        //    var result = await query.LatestPostsAsync();
        //    return new OkObjectResult(result);
        //}

        //GET api/blog/5
        //[HttpGet("{id}")]
        //public async Task<IActionResult> GetOne(int id)
        //{
        //    await Db.Connection.OpenAsync();
        //    var query = new UsersQuery(Db);
        //    var result = await query.FindOneAsync(id);
        //    if (result is null)
        //        return new NotFoundResult();
        //    return new OkObjectResult(result);
        //}

        [HttpGet]
        public async Task<IActionResult> GetNamePassword(string username, string password)
        {
            await Db.Connection.OpenAsync();
            var query = new UsersQuery(Db);
            var result = await query.FindOneAsync(username, password);
            if (result is null)
                return new EmptyResult();
            return new OkObjectResult(result);
        }

      

        //// POST api/blog
        //[HttpPost]
        //public async Task<IActionResult> Post([FromBody]Users body)
        //{
        //    await Db.Connection.OpenAsync();
        //    body.Db = Db;
        //    await body.InsertAsync();
        //    return new OkObjectResult(body);
        //}

        //// PUT api/blog/5
        //[HttpPut("{id}")]
        //public async Task<IActionResult> PutOne(int id, [FromBody]Users body)
        //{
        //    await Db.Connection.OpenAsync();
        //    var query = new UsersQuery(Db);
        //    var result = await query.FindOneAsync(id);
        //    if (result is null)
        //        return new NotFoundResult();
        //    result.Title = body.Title;
        //    result.Content = body.Content;
        //    await result.UpdateAsync();
        //    return new OkObjectResult(result);
        //}

        //// DELETE api/blog/5
        //[HttpDelete("{id}")]
        //public async Task<IActionResult> DeleteOne(int id)
        //{
        //    await Db.Connection.OpenAsync();
        //    var query = new UsersQuery(Db);
        //    var result = await query.FindOneAsync(id);
        //    if (result is null)
        //        return new NotFoundResult();
        //    await result.DeleteAsync();
        //    return new OkResult();
        //}

        //// DELETE api/blog
        //[HttpDelete]
        //public async Task<IActionResult> DeleteAll()
        //{
        //    await Db.Connection.OpenAsync();
        //    var query = new UsersQuery(Db);
        //    await query.DeleteAllAsync();
        //    return new OkResult();
        //}

        public AppDb Db { get; }
    }
}
