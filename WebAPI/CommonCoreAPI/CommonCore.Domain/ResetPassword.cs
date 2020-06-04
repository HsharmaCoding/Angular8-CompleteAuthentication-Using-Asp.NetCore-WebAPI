using System;
using System.Collections.Generic;
using System.Text;

namespace CommonCore.Domain
{
    public class ResetPassword
    {
        public string Password { get; set; }
        public string UserID { get; set; }
        public string code { get; set; }
    }
}
