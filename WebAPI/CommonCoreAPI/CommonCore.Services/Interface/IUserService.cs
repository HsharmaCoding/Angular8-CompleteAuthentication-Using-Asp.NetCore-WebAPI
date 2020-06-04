using CommonCore.DataAccess;
using CommonCore.Domain;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace CommonCore.Services.Interface
{
    public interface IUserService
    {
        Task<IdentityResult> CreateUser(User model);
        Task<LoginResult> SingIn(Login model);
        Task<User> GetUserProfile(string userId);
        Task<OperationResult<string>> SaveUserInformation(User model);
        Task SignOut();

        Task<OperationResult<string>> ConfirmEmail(string userId, string code);
        Task<OperationResult<string>> ForgotPaswordEmail(string email);
        Task<OperationResult<string>> ResetPassword(ResetPassword model);
        Task<OperationResult<string>> ChangePassword(User model);
    }
}
