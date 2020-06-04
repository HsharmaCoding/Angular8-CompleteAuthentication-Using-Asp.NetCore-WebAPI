using System;

namespace CommonCore.Domain
{
    public class User
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string CurrentPassword { get; set; }
        public string CreatedBy { get;set;}
        public string Role { get;set;}
        public string UserId { get;set;}
    }
}
