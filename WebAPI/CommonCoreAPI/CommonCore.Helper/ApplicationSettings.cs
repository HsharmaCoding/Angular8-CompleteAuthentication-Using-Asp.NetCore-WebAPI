using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Reflection;
using System.Text;

namespace CommonCore.Helper
{
    public class ApplicationSettings
    {
        private ConfigurationBuilder configurationBuilder;
        private IConfigurationRoot root;

        public ApplicationSettings()
        {
            configurationBuilder = new ConfigurationBuilder();
            var path = Path.Combine(Directory.GetCurrentDirectory(), "appsettings.json");
            configurationBuilder.AddJsonFile(path, false);
            root = configurationBuilder.Build();
        }

        public object GetConfiguration(string section, string key, object obj)
        {
            PropertyInfo propertyInfo = obj.GetType().GetProperty(key);
            var configValue = root.GetSection(section).GetSection(key).Value;
            if (propertyInfo != null)
            {
                propertyInfo.SetValue(obj, configValue, null);
            }
            return obj;
        }

        public string GetConfigurationValue(string section, string key)
        {
            return root.GetSection(section).GetSection(key).Value; ;
        }
    }
}
