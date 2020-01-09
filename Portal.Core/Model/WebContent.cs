using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Portal.Core
{
    public class WebContent
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string DisplayName { get; set; }
        public string WebUrl { get; set; }
        public string LogoUrl { get; set; }
        public int OrderNo { get; set; }

        internal AppDb Db { get; set; }

        public WebContent()
        {
        }

        internal WebContent(AppDb db)
        {
            Db = db;
        }
    }
}
