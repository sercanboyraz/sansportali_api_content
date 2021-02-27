using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Portal.Core
{
    public class WebContentPermission
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int WebContentId { get; set; }
        public virtual WebContent WebContent { get; set; }
        internal AppDb Db { get; set; }

        public WebContentPermission()
        {
        }

        internal WebContentPermission(AppDb db)
        {
            Db = db;
        }
    }
}
