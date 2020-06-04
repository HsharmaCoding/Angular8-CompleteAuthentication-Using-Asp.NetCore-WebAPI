using System;
using System.Collections.Generic;
using System.Text;

namespace CommonCore.Domain
{
    public class OperationResult<T>
    {
        public bool Success { get; set; }
        public string Message { get;set;}
        public T Data { get; set; }
    }
}
