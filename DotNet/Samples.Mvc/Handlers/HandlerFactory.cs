using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Samples.Mvc.Handlers
{
  public class HandlerFactory
  {
    public delegate Task<string> CaseHandlerDelegate(HttpContext context);
    public readonly Dictionary<string, CaseHandlerDelegate> _handlers = new()
    {
      ["StreamingProgress"] = async context =>
      {
        async Task FlushProgressMessage(dynamic message, CancellationToken cancellation)
        {
          if(message == null || cancellation.IsCancellationRequested)
          {
            return;
          }
          var json = JsonSerializer.Serialize(message);
          var bytes = Encoding.UTF8.GetBytes(json + "\n");
          await context.Response.Body.WriteAsync(bytes, 0, bytes.Length);
          await context.Response.Body.FlushAsync();
        }
        int progress = 0;
        while (progress < 100 && !context.RequestAborted.IsCancellationRequested)
        {
          await FlushProgressMessage(new { Progress = progress }, context.RequestAborted);
          progress += 5; 
          await Task.Delay(500, context.RequestAborted); 
        }
        var file = context.Request.Form.Files["file"];
        await FlushProgressMessage(new { Progress = 100, Line = "Processing result", Information = $"StreamingProgress action handled {file?.FileName}." }, context.RequestAborted);
        return $"StreamingProgress action handled {file?.FileName}.";
      },

      ["Privacy"] = async context =>
      {
        return "Privacy action executed.";
      }
    };
  }
}