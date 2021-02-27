using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace Portal.Core
{
    public class WebContentQuery
    {
        public AppDb Db { get; }

        public WebContentQuery(AppDb db)
        {
            Db = db;
        }

        public async Task<WebContent> AddWebContent(string websitename, string websiteaddress, int userid)
        {
            if (!websiteaddress.StartsWith("http"))
            {
                websiteaddress = "http://" + websiteaddress;
            }
            var getDate = new WebContent();
            var cmd = Db.Connection.CreateCommand();
            cmd.CommandText = @"INSERT INTO `WebContent`
                                (
                                `Name`,
                                `DisplayName`,
                                `WebUrl`,
                                `LogoUrl`,
                                `OrderNo`,
                                `CreatedById`)
                                VALUES
                                (
                                @Name,
                                @DisplayName,
                                @WebUrl,
                                @LogoUrl,
                                @OrderNo,
                                @CreatedById)";

            cmd.Parameters.Add(new MySqlParameter
            {
                ParameterName = "@Name",
                DbType = DbType.String,
                Value = websitename,
            });

            cmd.Parameters.Add(new MySqlParameter
            {
                ParameterName = "@DisplayName",
                DbType = DbType.String,
                Value = websitename,
            });

            cmd.Parameters.Add(new MySqlParameter
            {
                ParameterName = "@WebUrl",
                DbType = DbType.String,
                Value = websiteaddress,
            });

            cmd.Parameters.Add(new MySqlParameter
            {
                ParameterName = "@LogoUrl",
                DbType = DbType.String,
                Value = "assets/icons/images/default.png",
            });

            cmd.Parameters.Add(new MySqlParameter
            {
                ParameterName = "@OrderNo",
                DbType = DbType.Int32,
                Value = 100,
            });

            cmd.Parameters.Add(new MySqlParameter
            {
                ParameterName = "@CreatedById",
                DbType = DbType.Int32,
                Value = userid,
            });

            var saveResult = await cmd.ExecuteNonQueryAsync();
            if (saveResult > 0)
            {
                var cmds = Db.Connection.CreateCommand();
                cmds.CommandText = @"SELECT * FROM `WebContent` WHERE (`CreatedById` = @CreatedById OR `CreatedById` = 0) ORDER BY `Id` DESC ";
                cmds.Parameters.Add(new MySqlParameter
                {
                    ParameterName = "@CreatedById",
                    DbType = DbType.Int32,
                    Value = userid,
                });
                var execute = cmds.ExecuteReaderAsync();
                var result = ReadAllAsync(await execute).Result;
                return result.Count > 0 ? result[0] : null;
            }
            return null;
        }

        public async Task<List<WebContent>> FindAllAsync(int userid)
        {
            var cmd = Db.Connection.CreateCommand();
            cmd.CommandText = @"SELECT * FROM `WebContent` WHERE (`CreatedById` = @CreatedById OR `CreatedById` = 0)  ORDER BY `OrderNo` ASC ";
            cmd.Parameters.Add(new MySqlParameter
            {
                ParameterName = "@CreatedById",
                DbType = DbType.Int32,
                Value = userid,
            });
            var execute = cmd.ExecuteReaderAsync();
            var resultData = ReadAllAsync(await execute).Result;
            return resultData;
        }

        //public async Task<WebContent> FindOneAsync(int userid)
        //{
        //    using var cmd = Db.Connection.CreateCommand();
        //    cmd.CommandText = @"SELECT * FROM `WebContent` WHERE `UserId` = @userid ";
        //    cmd.Parameters.Add(new MySqlParameter
        //    {
        //        ParameterName = "@userName",
        //        DbType = DbType.Int32,
        //        Value = userid,
        //    });
        //    var execute = cmd.ExecuteReaderAsync();
        //    var result = ReadAllAsync(await execute).Result;
        //    return result.Count > 0 ? result[0] : null;
        //}

        private async Task<List<WebContent>> ReadAllAsync(System.Data.Common.DbDataReader reader)
        {
            var posts = new List<WebContent>();
            using (reader)
            {
                while (await reader.ReadAsync())
                {
                    var post = new WebContent(Db)
                    {
                        Id = reader.GetInt32(0),
                        Name = reader.GetString(1),
                        DisplayName = reader.GetString(2),
                        WebUrl = reader.GetString(3),
                        LogoUrl = reader.GetString(4),
                        OrderNo = reader.GetInt32(5),
                        CreatedById = reader.GetInt32(6),
                    };
                    posts.Add(post);
                }
            }
            return posts;
        }
    }
}
