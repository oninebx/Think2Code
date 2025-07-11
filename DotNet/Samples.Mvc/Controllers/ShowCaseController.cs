using Microsoft.AspNetCore.Mvc;

namespace Samples.Mvc.Controllers;

public class ShowCaseController : Controller
{
  private readonly Handlers.HandlerFactory _handlerFactory = new ();
  public IActionResult Index(string caseName)
  {
    if (string.IsNullOrEmpty(caseName))
    {
      return NotFound();
    }
    ViewData["CaseName"] = caseName;
    return View();
  }

  [HttpPost]
  public IActionResult ActionHandler(string caseName)
  {
    var handler = _handlerFactory._handlers.GetValueOrDefault(caseName);
    if (handler == null)
    {
      TempData["Message"] = $"No handler found for case: {caseName}";
    }
    else
    {
      TempData["Message"] = _handlerFactory._handlers[caseName].Invoke(HttpContext).Result;
    }
    
    return new EmptyResult();
  }
}
