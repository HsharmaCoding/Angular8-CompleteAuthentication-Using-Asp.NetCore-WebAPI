
using System;
using System.Linq;
using System.Threading.Tasks;
using CommonCore.Domain;
using CommonCore.Helper;
using CommonCore.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace CommonCoreAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private IUserService _userService;

        //app settings to access configuration
        private readonly ApplicationSettings _appSettings;

        public UserController(IUserService userService, IOptions<ApplicationSettings> appSettings)
        {
            _userService= userService;
            _appSettings = appSettings.Value;
        }
        
        //Create user
        [HttpPost, Route("CreateUser")]
        public async Task<IdentityResult> CreateUser(User model)
        {
            if(string.IsNullOrEmpty(model.Role))
            {
                model.Role="Admin";
            }
            if (string.IsNullOrEmpty(model.CreatedBy))
            {
                model.CreatedBy = "System";
            }

            var result= await _userService.CreateUser(model);
            
            return result;
        }

        //User login
        [HttpPost, Route("Login")]
        public async Task<LoginResult> Login(Login model)
        {
            return await _userService.SingIn(model);
        }

        //Logged in user profile
        [Authorize]
        [HttpGet, Route("GetUserProfile")]
        public async Task<User> GetUserProfile()
        {

            string userId = User.Claims.First(c => c.Type == "UserID").Value;
            return await _userService.GetUserProfile(userId);
        }

        //Sign Out from the system
        [HttpGet, Route("SignOut")]
        public async Task SignOut()
        {
            await _userService.SignOut();
        }

        //Confirm user account
        [HttpGet, Route("ConfirmEmail")]
        public async Task<OperationResult<string>> ConfirmEmail(string userId, string code)
        {
            OperationResult<string> result = new OperationResult<string>();
            result= await _userService.ConfirmEmail(userId, code);
            return result;
        }

        //Send forgot password link to user's registered email address
        [HttpGet, Route("SendForgotPasswordEmail")]
        public async Task<OperationResult<string>> SendForgotPasswordEmail (string email)
        {
            OperationResult<string> result = new OperationResult<string>();
            result = await _userService.ForgotPaswordEmail(email);
            return result;
        }

        //Reset user password from email/link
        [HttpPost, Route("ResetPassword")]
        public async Task<OperationResult<string>> ResetPassword(ResetPassword model)
        {
            OperationResult<string> result = new OperationResult<string>();
            result = await _userService.ResetPassword(model);
            return result;
        }

        //Save my profile/user information
        [HttpPost, Route("SaveUserInformation")]
        public async Task<OperationResult<string>> SaveUserInformation(User model)
        {
            var result = await _userService.SaveUserInformation(model);
            return result;
        }

        //Change the password of logged in user
        [HttpPost, Route("ChangePassword")]
        public async Task<OperationResult<string>> ChangePassword(User model)
        {
            string userId = User.Claims.First(c => c.Type == "UserID").Value;
            model.UserId=userId;
            var result = await _userService.ChangePassword(model);
            return result;
        }
    }
}
