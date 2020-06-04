using CommonCore.Domain;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace CommonCore.Services.Interface
{
    public interface IEmailService
    {
        Task SendEmail(string email, string firstName, string lastName, string callbackUrl, string subject, string actionName);
    }
}
