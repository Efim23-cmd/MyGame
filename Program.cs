using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Conventions;
using Microsoft.Extensions.FileProviders;
using MyGame.Models;
using System;
using System.Runtime.InteropServices;
using System.Text;

internal class Program
{
    private static void Main(string[] args)
    {
        List<User> listUser = new();
        object syncObj = new object();

        var builder = WebApplication.CreateBuilder(new WebApplicationOptions() { Args = args, WebRootPath = "wwwroot" });

        string connection = builder.Configuration.GetConnectionString("DefaultConnection")!;
        builder.Services.AddDbContext<ApplicationContext>((options) => options.UseSqlServer(connection));

        var app = builder.Build();
        app.Environment.EnvironmentName = "Development";
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

        app.UseStatusCodePages(async contextCode =>
        {
            await Results.Content($"<h1>😑 Not Found Page: {contextCode.HttpContext.Request.Path}</h1>", "text/html", Encoding.Unicode).ExecuteAsync(contextCode.HttpContext);
        });

        app.Map("/", async (HttpContext context, ApplicationContext db) =>
        {
            listUser = await db.Users.ToListAsync();
            context.Response.Headers.ContentDisposition = "inline";
            return Results.File("index.html", "text/html");
        });

        app.MapPost("/SaveUser", async (HttpContext context, ApplicationContext db) =>
        {
            try
            {
                var clientUser = new User(context.Request.Form["userName"]!, uint.Parse(context.Request.Form["record"]!));

                var serverUser = db.Users.FirstOrDefault((entry) => entry.UserName.ToLower().Equals(clientUser.UserName.ToLower()));

                if (serverUser is null)
                {
                    listUser.Add(clientUser);
                    db.Add(clientUser);
                    await db.SaveChangesAsync();

                    context.Response.StatusCode = 200;
                    return Results.Json(clientUser);
                }
                context.Response.StatusCode = 400;
                return Results.Json("User already exists!");
            }
            catch
            {
                context.Response.StatusCode = 500;
                return Results.Json("Server error!");
            }
        });

        app.MapPost("/UpdateUser", async (HttpContext context, ApplicationContext db) =>
        {
            try
            {
                var UserName = context.Request.Form["userName"].ToString();
                var user = await db.Users.FirstOrDefaultAsync((entry) => entry.UserName == UserName);

                if (user is not null)
                {
                    user.Record = uint.Parse(context.Request.Form["record"]);
                    db.Users.Update(user);

                    await db.SaveChangesAsync();

                    context.Response.StatusCode = 200;
                    return Results.Json(user);
                }
                else
                {
                    context.Response.StatusCode = 400;
                    return Results.Json("Not found user!");
                }
            }
            catch
            {
                context.Response.StatusCode = 500;
                return Results.Json("Error!");
            }
        });

        app.MapPost("/CheckUser", async (HttpContext context, ApplicationContext db) =>
        {
            try
            {
                string? Name = context.Request.Form["userName"];
                var user = await db.Users.FirstOrDefaultAsync((entry) => entry.UserName == Name);

                if (user is not null)
                {
                    if (db.Users.Contains(user))
                    {
                        context.Response.StatusCode = 200;
                        return Results.Json(user);
                    }
                }
            }
            catch
            {
                context.Response.StatusCode = 500;
                return Results.Json("Error!");
            }
            context.Response.StatusCode = 400;
            return Results.Json("Not found user!");
        });

        app.MapPost("/GetListTopTen", (HttpContext context, ApplicationContext db) =>
        {
            try
            {
                lock (syncObj)
                {
                    List<User> result = new List<User>();
                    int index = 0;

                    foreach (var user in listUser.AsParallel().OrderByDescending((entry) => entry.Record))
                    {
                        if (index < 10)
                        {
                            result.Add(user);
                        }
                        index++;
                    }

                    context.Response.StatusCode = 200;
                    return Results.Json(result);
                }
            }
            catch
            {
                context.Response.StatusCode = 500;
                return Results.Json("Error!");
            }
        });

        app.MapPost("/GetListOnRequest", (HttpContext context, ApplicationContext db) =>
        {
            try
            {
                lock (syncObj)
                {
                    string? input = context.Request.Form["input"];

                    List<User> result = new List<User>();

                    foreach (var user in listUser.AsParallel())
                    {
                        if (user.UserName.IndexOf(input) >= 0)
                        {
                            result.Add(user);
                        }
                    }
                    /*  result.OrderByDescending((entry) => entry.Record);*/
                    if (result.Count != 0)
                    {
                        context.Response.StatusCode = 200;
                        return Results.Json(result);
                    }
                    else
                    {
                        context.Response.StatusCode = 400;
                        return Results.Json("Not found user!");
                    }
                }
            }
            catch
            {
                context.Response.StatusCode = 500;
                return Results.Json("Error!");
            }
        });

        app.UseStaticFiles();

        app.Run();
    }
}