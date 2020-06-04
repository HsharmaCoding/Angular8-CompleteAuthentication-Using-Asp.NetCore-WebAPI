using CommonCore.Domain;
using CommonCore.Services.Interface;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace CommonCore.Services
{
    public class EmailService : IEmailService
    {
        public EmailService()
        {

        }

        public async Task SendEmail(string email, string firstName, string lastName, string callbackUrl, string subject, string actionName)
        {
          

            string body=string.Empty;

            if(actionName== "CreateUser")
                body = "<p>Hi {0} {1},</p><p>Welcome to code circulation network.</p><p>Please click on below link to activate your account.</p><p>{2}</p><p>Thanks,</p><p>Code Circulation Team</p><p>*******Please do not reply to this email. This is auto generated email.*******&quot;</p>";
            else if(actionName == "ForgotPassword")
                body = "<p>Hi {0} {1},</p><p>Welcome to code circulation network.</p><p>Please click on below link to reset your login password.</p><p>{2}</p><p>Thanks,</p><p>Code Circulation Team</p><p>*******Please do not reply to this email. This is auto generated email.*******</p>";

            var message = new MailMessage();
            message.To.Add(new MailAddress(email));
            message.From = new MailAddress("abc@mail.com");  // replace with valid value
            message.Subject = subject;
            message.Body = string.Format(body, firstName, lastName, callbackUrl);
            message.IsBodyHtml = true;

            using (var smtp = new SmtpClient())
            {
                var credential = new NetworkCredential
                {
                    UserName = "abc@mail.com",  // replace with valid value
                    Password = "122456789"  // replace with valid value
                };
                smtp.Credentials = credential;
                smtp.Host = "smtp.office365.com";
                smtp.Port = 587;
                smtp.EnableSsl = true;
                await smtp.SendMailAsync(message);
            }
        }
    }
}
