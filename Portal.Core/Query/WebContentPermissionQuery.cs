using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace Portal.Core
{
    public class WebContentPermissionQuery
    {

        public AppDb Db { get; }

        public WebContentPermissionQuery(AppDb db)
        {
            Db = db;
        }

        public async Task<List<WebContentPermission>> FindAsync(int userid)
        {
            var cmd = Db.Connection.CreateCommand();
            cmd.CommandText = @"SELECT `webcontentpermission`.`Id`,`UserId`,`WebContentId`,`WebUrl`,`LogoUrl`,`Name`,`DisplayName` 
                                FROM `webcontentpermission` 
                                INNER JOIN `webcontent` 
                                ON `WebContentId` = `webcontent`.`Id` 
                                WHERE `UserId` = @userid Order By OrderNo";
            cmd.Parameters.Add(new MySqlParameter
            {
                ParameterName = "@userid",
                DbType = DbType.Int32,
                Value = userid,
            });
            var execute = cmd.ExecuteReaderAsync();
            var resultData = ReadAllAsync(await execute).Result;
            return resultData;
        }

        private async Task<List<WebContentPermission>> ReadAllAsync(System.Data.Common.DbDataReader reader)
        {
            var posts = new List<WebContentPermission>();
            using (reader)
            {
                while (await reader.ReadAsync())
                {
                    var post = new WebContentPermission(Db)
                    {
                        Id = reader.GetInt32(0),
                        UserId = reader.GetInt32(1),
                        WebContentId = reader.GetInt32(2),
                        WebContent = new WebContent() { WebUrl = reader.GetString(3), LogoUrl = reader.GetString(4), Name = reader.GetString(5), DisplayName = reader.GetString(6) }
                    };
                    posts.Add(post);
                }
            }
            return posts;
        }
    }
}
