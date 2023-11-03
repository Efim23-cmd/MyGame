using System.Runtime.InteropServices;
using System.Text;

internal class Program
{
    private static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(new WebApplicationOptions() { Args = args, WebRootPath = "wwwroot" });

        var app = builder.Build();

        if (app.Environment.EnvironmentName == "Development")
        {
            app.UseDeveloperExceptionPage();
        }
        else
        {
            app.UseExceptionHandler(app => app.Run(async context =>
            {
                context.Response.StatusCode = 500;
                await Results.Content("<h3>Sorry, Error Server 🤬 </h3>", "text/html", contentEncoding: Encoding.Unicode).ExecuteAsync(context);
            }));
        }

        app.Map("/", (HttpContext context) =>
        {
            context.Response.Headers.ContentDisposition = "inline";
            return Results.File("index.html", "text/html");
        });

        app.UseStatusCodePages(async contextCode =>
        {
            await Results.Content($"<h1>😑 Not Found Page:{contextCode.HttpContext.Request.Path}</h1>", "text/html").ExecuteAsync(contextCode.HttpContext);
        });

        app.UseStaticFiles();

        app.Run();
    }
}
