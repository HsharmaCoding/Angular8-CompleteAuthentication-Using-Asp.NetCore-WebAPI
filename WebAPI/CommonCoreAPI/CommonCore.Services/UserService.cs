using CommonCore.DataAccess;
using CommonCore.Domain;
using CommonCore.Helper;
using CommonCore.Services.Interface;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using System.Web;

namespace CommonCore.Services
{
    public class UserService : IUserService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IEmailService _emailService;
        private readonly ApplicationSettings _appSettings;


        public UserService(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, IEmailService emailService, IOptions<ApplicationSettings> appSettings)
        {
            _userManager= userManager;
            _signInManager=signInManager;
            _emailService= emailService;
            _appSettings = appSettings.Value;
        }

        public async Task<IdentityResult> CreateUser(User model)
        {
            var user = new ApplicationUser
            {
                Email=model.Email,
                UserName=model.Email,
                FirstName=model.FirstName,
                LastName=model.LastName,
                Created=DateTime.UtcNow,
                CreatedBy=model.CreatedBy,
                Deleted=false
            };

            var userResult = await _userManager.CreateAsync(user, model.Password);

            if (userResult.Succeeded)
            {
                var roleResult = await _userManager.AddToRoleAsync(user, model.Role);

                if(roleResult.Succeeded)
                {
                    var code = await _userManager.GenerateEmailConfirmationTokenAsync(user);

                    ApplicationSettings appSettings = new ApplicationSettings();
                    var url = appSettings.GetConfigurationValue("ApplicationURL", "EmailConfirmationURL");

                    var callbackUrl = url + "?userId=" + user.Id + "&code=" + HttpUtility.UrlEncode(code);
                    await _emailService.SendEmail(model.Email, model.FirstName, model.LastName, HtmlEncoder.Default.Encode(callbackUrl),"Code Cerculation Account activation link","CreateUser");
                }
            }

            return userResult;
        }

        public async Task<LoginResult> SingIn(Login model)
        {
            var loginResult=new LoginResult();
            var user = await _userManager.FindByNameAsync(model.Email);

            if (user != null)
            {
                if (user.EmailConfirmed == false)
                {
                    loginResult.Success = false;
                    loginResult.Message = "Your account is not activated, Please confirm account activation link in your registered email.";
                    return loginResult;
                }
            }

            var result = await _signInManager.PasswordSignInAsync(model.Email, model.Password,true,lockoutOnFailure:false);

            if(result.Succeeded)
            {
                if (result.IsLockedOut)
                {
                    loginResult.Success = false;
                    loginResult.Message = "Your account is locked, Please contact to administrator to unlock your account.";
                    return loginResult;
                }

                //Get role assigned to the user
                var role = await _userManager.GetRolesAsync(user);

                ApplicationSettings appSettings = new ApplicationSettings();
                var secretKey = appSettings.GetConfigurationValue("JWT", "JWT_Secret");

                IdentityOptions _options = new IdentityOptions();

                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new Claim[]
                    {
                        new Claim("UserID",user.Id.ToString()),
                        new Claim(_options.ClaimsIdentity.RoleClaimType,role.FirstOrDefault())
                    }),
                    Expires = DateTime.UtcNow.AddDays(1),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)), SecurityAlgorithms.HmacSha256Signature)
                };

                var tokenHandler = new JwtSecurityTokenHandler();
                var securityToken = tokenHandler.CreateToken(tokenDescriptor);
                var token = tokenHandler.WriteToken(securityToken);

                loginResult.Success=true;
                loginResult.Token= token;
            }
            else
            {
                loginResult.Success=false;
                loginResult.Message= "Username or password is incorrect.";
            }
            return loginResult;
        }

        public async Task<User> GetUserProfile(string userId)
        {
            var userDetails=new User();
            var user = await _userManager.FindByIdAsync(userId);
            var role = await _userManager.GetRolesAsync(user);

            userDetails.FirstName=user.FirstName;
            userDetails.LastName = user.LastName;
            userDetails.Email = user.Email;
            userDetails.Role= role.FirstOrDefault();
            userDetails.UserId=user.Id;
            return userDetails;
        }

        public async Task<OperationResult<string>> ConfirmEmail(string userId, string code)
        {
            OperationResult<string> result = new OperationResult<string>();
            ApplicationUser appUser = _userManager.Users.FirstOrDefault(x => x.Id == userId && !x.Deleted);
            IdentityOptions options = new IdentityOptions();
            if (userId == null || code == null)
            {
                result.Success = false;
                result.Message="There is some problem. We are not able to activate your account, Please contact to administrator.";
            }
            var proivder = options.Tokens.EmailConfirmationTokenProvider;

            bool isValid = await _userManager.VerifyUserTokenAsync(appUser, proivder, "EmailConfirmation", HttpUtility.UrlDecode(code));

            if (isValid)
            {
                var data = await _userManager.ConfirmEmailAsync(appUser, HttpUtility.UrlDecode(code));
                if (data.Succeeded)
                {
                    result.Message= "Your account has been activated successfully.";
                    result.Success = true;
                }
                else
                {
                    result.Success = false;
                    result.Message = "Your account confirmation link has been expired or invalid link, Please contact to administrator.";
                }
            }
            else
            {
                result.Success = false;
                result.Message = "Your account confirmation link has been expired or invalid link, Please contact to administrator.";
            }
            return result;
        }

        public async Task<OperationResult<string>> ForgotPaswordEmail(string email)
        {
            OperationResult<string> result = new OperationResult<string>();

            var user = await _userManager.FindByNameAsync(email);
            if (user == null)
            {
                result.Message="We are not able to find your email in the system, Please try again.";
                result.Success=false;
                return result;
            }

            var code= await _userManager.GeneratePasswordResetTokenAsync(user);

            ApplicationSettings appSettings = new ApplicationSettings();
            var url = appSettings.GetConfigurationValue("ApplicationURL", "PasswordResetURL");

            var callbackUrl = url + "?userId=" + user.Id + "&code=" + HttpUtility.UrlEncode(code);
            await _emailService.SendEmail(email, user.FirstName, user.LastName, HtmlEncoder.Default.Encode(callbackUrl), "Code Cerculation Password reset link", "ForgotPassword");
            result.Success=true;
            return result;
        }

        public async Task<OperationResult<string>> ResetPassword(ResetPassword model)
        {
            OperationResult<string> result = new OperationResult<string>();
            var user = await _userManager.FindByIdAsync(model.UserID);
            if (user != null)
            {
                IdentityOptions options = new IdentityOptions();
                var proivder = options.Tokens.EmailConfirmationTokenProvider;
                bool isValid = await _userManager.VerifyUserTokenAsync(user, proivder, "ResetPassword", HttpUtility.UrlDecode(model.code));

                if (isValid)
                {
                    var resetPassword = await _userManager.ResetPasswordAsync(user, HttpUtility.UrlDecode(model.code), model.Password);
                    
                    if (resetPassword.Succeeded)
                    {
                        result.Success = true;
                        result.Message = "Your password has been updated successfully.";
                    }
                    else
                    {
                        result.Success = false;
                        result.Message = "There is some problem. We are not able to reset your password, Please contact to administrator.";
                    }
                }
                else
                {
                    result.Success = false;
                    result.Message = "Your password reset link has been expied, Please generate different link and try again.";
                }
            }
            else
            {
                result.Success = false;
                result.Message = "Your password reset link has been  expied, Please generate different link and try again.";
            }
            return result;
        }

        public async Task<OperationResult<string>> SaveUserInformation(User model)
        {
            OperationResult<string> result = new OperationResult<string>();
            var user = await _userManager.FindByIdAsync(model.UserId);
            user.FirstName = model.FirstName;
            user.LastName = model.LastName;
            user.LastUpdated = DateTime.UtcNow;
            user.LastUpdatedBy = model.UserId;
            var userResult = await _userManager.UpdateAsync(user);

            if (userResult.Succeeded)
            {
                result.Success=true;
                result.Message="Profile has been updated scuccessfully.";
            }
            return result;
        }

        public async Task<OperationResult<string>> ChangePassword(User model)
        {
            OperationResult<string> result = new OperationResult<string>();
            var user = await _userManager.FindByIdAsync(model.UserId);
            var passwordResult= await _userManager.ChangePasswordAsync(user,model.CurrentPassword, model.Password);

            if (passwordResult.Succeeded)
            {
                result.Success=true;
                result.Message="Password has been updated successfully.";
            }
            else
            {
                string error= passwordResult.Errors.FirstOrDefault().Code;

                if (error == "PasswordMismatch")
                {
                    result.Message="Current password is incorrect. Please try again";
                }
                else
                {
                    result.Message = "There is some problem. We are not able to change your password. Please contact to administrator.";
                }
                result.Success = false;
            }
            return result;
        }
        public async Task SignOut()
        {
            await _signInManager.SignOutAsync();
        }
    }
}
