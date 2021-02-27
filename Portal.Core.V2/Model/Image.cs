using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Portal.Core.Model
{
    public class Image
    {
        public int Id { get; set; }
        public string DataUrl { get; set; }
        public int UserId { get; set; }

        internal AppDb Db { get; set; }

        public Image()
        {
        }

        internal Image(AppDb db)
        {
            Db = db;
        }
    }
}
